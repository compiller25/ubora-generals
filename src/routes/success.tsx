// @refresh reset
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { PaymentStatus } from "@/components/PaymentStatus";
import { useState } from "react";

type SuccessSearch = { order?: string; payment?: string };

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>): SuccessSearch => ({
    order: typeof s.order === "string" ? s.order : undefined,
    payment: typeof s.payment === "string" ? s.payment : undefined,
  }),
  component: Success,
});

function Success() {
  const { order, payment } = Route.useSearch();
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  
  const isPaymentPending = Boolean(order) && paymentStatus === "pending";
  const isPaymentFailed = Boolean(order) && paymentStatus === "failed";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="container-mobile text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-elevated)] ${
            isPaymentFailed ? "bg-red-500" : isPaymentPending ? "bg-amber-500" : "bg-primary"
          }`}
        >
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 280 }}
          >
            {isPaymentPending ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FaCheck size={36} />
            )}
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="mt-8 space-y-3"
        >
          <h1 className="text-3xl">
            {isPaymentPending ? "Waiting for payment..." : "Order received!"}
          </h1>
          
          <p className="text-sm text-muted-foreground">
            {isPaymentPending 
              ? "Your order is waiting for payment. Complete payment to confirm delivery."
              : isPaymentFailed
              ? "Payment failed. Please try placing your order again."
              : "Asante sana. We've received your order and will reach out shortly to confirm delivery."
            }
          </p>

          {order && (
            <div className="mx-auto max-w-sm text-left rounded-2xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-soft)]">
              <div className="mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Order ID</span>
                <p className="mt-1 font-mono text-base font-semibold break-all">{order}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Transaction ID</span>
                <p className="mt-1 font-mono text-base font-semibold break-all">{payment ?? "Pending"}</p>
              </div>
            </div>
          )}

          {order && (
            <div className="mx-auto mt-5 max-w-sm">
              <PaymentStatus orderId={order} onStatusChange={setPaymentStatus} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.45 }}
          className="mt-8 space-y-3"
        >
          {isPaymentFailed ? (
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform active:scale-[0.98]"
            >
              Try again
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform active:scale-[0.98]"
            >
              Return home
            </Link>
          )}
          
          {payment && (
            <p className="text-xs text-muted-foreground">
              Transaction ID: {payment}
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
