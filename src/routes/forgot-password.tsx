import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/lib/api/client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "reset">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.forgotPassword(phone);
      setStep("reset");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.resetPassword(phone, code, newPassword);
      navigate({ to: "/login" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Reset password</h1>

        {step === "phone" ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">Enter your phone number and we'll send you a reset code.</p>
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 712 345 678"
                  required
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground disabled:opacity-50">
                {submitting ? "Sending…" : "Send reset code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">Enter the 6-digit code sent to {phone} and your new password.</p>
            <form onSubmit={resetPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Reset code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  required
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm tracking-widest placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars, include a number"
                    required
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 pr-11 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground disabled:opacity-50">
                {submitting ? "Updating…" : "Set new password"}
              </button>
              <button type="button" onClick={() => setStep("phone")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                ← Use a different number
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
