import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { QuantitySelector } from "@/components/QuantitySelector";
import { OrderSummary } from "@/components/OrderSummary";
import { product, formatPrice } from "@/data/product";
import { api } from "@/lib/api/client";
import { useAuth } from "@/auth/context/AuthContext";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    packageId: (search.packageId as string) || "",
  }),
  component: Checkout,
});

const CARRIERS = [
  { id: "mpesa",    label: "M-Pesa",       sub: "Vodacom",  color: "#4CAF50" },
  { id: "airtel",   label: "Airtel Money",  sub: "Airtel",   color: "#FF0000" },
  { id: "tigo",     label: "Tigo Pesa",     sub: "Tigo",     color: "#0099CC" },
  { id: "halopesa", label: "HaloPesa",      sub: "Halotel",  color: "#FF6B00" },
] as const;

type Carrier = (typeof CARRIERS)[number]["id"];
type Items = Record<string, number>;

function Checkout() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { isAuthenticated, isLoading, user } = useAuth();

  const initial: Items = {};
  if (search.packageId) initial[search.packageId] = 1;

  const [items, setItems] = useState<Items>(initial);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
  const [carrier, setCarrier] = useState<Carrier>("mpesa");
  const [payPhone, setPayPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Waiting / polling state
  const [waiting, setWaiting] = useState(false);
  const [txRef, setTxRef] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.profile.fullName, phone: user.profile.phone, address: user.profile.addresses[0] || "" });
      setPayPhone(user.profile.phone || "");
    }
  }, [user]);

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  function setQty(packageId: string, qty: number) {
    setItems((prev) => ({ ...prev, [packageId]: qty }));
  }

  function toggle(packageId: string) {
    setItems((prev) => {
      if (prev[packageId]) { const next = { ...prev }; delete next[packageId]; return next; }
      return { ...prev, [packageId]: 1 };
    });
  }

  const selectedItems = product.packages
    .filter((p) => items[p.id] > 0)
    .map((p) => ({ pkg: p, quantity: items[p.id] }));

  const grandTotal = selectedItems.reduce((s, { pkg, quantity }) => s + pkg.price * quantity, 0);
  const valid = selectedItems.length > 0 && form.fullName.trim() && form.address.trim() && payPhone.trim().length >= 9;

  function startPolling(ref: string, orderId: string) {
    pollRef.current = setInterval(async () => {
      try {
        const result = await api.flutterwaveStatus(ref);
        if (result.status === "paid" || result.status === "confirmed") {
          clearInterval(pollRef.current!);
          navigate({ to: "/success", search: { order: orderId, payment: ref } });
        } else if (result.status === "failed") {
          clearInterval(pollRef.current!);
          setWaiting(false);
          setSubmitting(false);
          alert("Payment failed. Please try again.");
        }
      } catch { /* keep polling on network errors */ }
    }, 3500);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    try {
      // Step 1: create order
      const { order } = await api.placeOrder({
        items: selectedItems.map(({ pkg, quantity }) => ({ packageId: pkg.id, quantity })),
        paymentMethod: carrier,
        deliveryAddress: form.address,
      });

      const orderId = order._id ?? order.id;

      // Step 2: trigger STK push
      const { txRef: ref } = await api.flutterwaveCharge({
        orderId,
        phone: payPhone.replace(/\s/g, ""),
        carrier,
      });

      setTxRef(ref);
      setWaiting(true);

      // Step 3: start polling
      startPolling(ref, orderId);
    } catch (err: any) {
      alert(err.message ?? "Failed to initiate payment. Please try again.");
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  // Waiting screen — shown after STK push sent
  if (waiting) {
    const activeCarrier = CARRIERS.find((c) => c.id === carrier)!;
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          {/* Pulsing phone icon */}
          <div className="relative mx-auto h-20 w-20">
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: activeCarrier.color }} />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full text-4xl" style={{ background: activeCarrier.color + "22", border: `2px solid ${activeCarrier.color}` }}>
              📱
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Authorize Payment</h2>
            <p className="text-sm text-muted-foreground">
              A secure prompt has been sent to <span className="font-semibold text-foreground">{payPhone}</span> via <span className="font-semibold" style={{ color: activeCarrier.color }}>{activeCarrier.label}</span>.
            </p>
            <p className="text-sm text-muted-foreground">Enter your Mobile Money PIN on your phone to complete the payment of <span className="font-semibold text-foreground">{formatPrice(grandTotal)}</span>.</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Waiting for confirmation…
          </div>

          <button
            onClick={() => {
              if (pollRef.current) clearInterval(pollRef.current);
              setWaiting(false);
              setSubmitting(false);
            }}
            className="text-xs text-muted-foreground underline underline-offset-2"
          >
            Cancel and go back
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="container-mobile py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <FaArrowLeft size={12} /> Continue shopping
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-3xl">
          Checkout
        </motion.h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {/* Customer info */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Customer information</h2>
            <Field label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="Amani Kimaro" />
            <Field label="Phone number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+255 712 345 678" />
            <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Street, area, city" />
          </section>

          {/* Package selection */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Select packages</h2>
            <div className="grid gap-3">
              {product.packages.map((pkg) => {
                const selected = !!items[pkg.id];
                return (
                  <div key={pkg.id} className={`rounded-2xl border bg-card transition-colors ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                      <input type="checkbox" checked={selected} onChange={() => toggle(pkg.id)} className="h-4 w-4 accent-[var(--primary)]" />
                      <img src={pkg.image} alt={pkg.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{pkg.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(pkg.price)}</p>
                      </div>
                    </label>
                    <AnimatePresence>
                      {selected && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                          <div className="flex items-center justify-between border-t border-border px-4 py-2">
                            <span className="text-xs text-muted-foreground">Quantity</span>
                            <QuantitySelector value={items[pkg.id]} onChange={(q) => setQty(pkg.id, q)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Order summary */}
          {selectedItems.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Order summary</h2>
              <OrderSummary product={product} items={selectedItems} />
            </section>
          )}

          {/* Mobile money payment */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mobile money</h2>

            {/* Carrier selector */}
            <div className="grid grid-cols-2 gap-2">
              {CARRIERS.map((c) => (
                <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-2xl border bg-card px-3 py-3 transition-colors ${carrier === c.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                  <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="flex flex-col min-w-0">
                    <span className="text-sm font-medium leading-tight">{c.label}</span>
                    <span className="text-xs text-muted-foreground">{c.sub}</span>
                  </span>
                  <input type="radio" name="carrier" value={c.id} checked={carrier === c.id} onChange={() => setCarrier(c.id)} className="sr-only" />
                </label>
              ))}
            </div>

            {/* Mobile money phone number */}
            <Field
              label="Mobile money number"
              type="tel"
              value={payPhone}
              onChange={setPayPhone}
              placeholder="255712345678"
            />
            <p className="text-xs text-muted-foreground">Enter the number linked to your {CARRIERS.find(c => c.id === carrier)?.label} wallet.</p>
          </section>

          <button
            type="submit"
            disabled={!valid || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <FaLock size={12} />
            {submitting ? "Sending prompt…" : `Pay now · ${formatPrice(grandTotal)}`}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            By placing your order you agree to our terms & privacy policy.
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
