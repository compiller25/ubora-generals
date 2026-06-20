import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/auth/context/AuthContext";
import { validatePhone, validatePassword } from "@/auth/validation";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function LoginForm({ redirect = "/" }: { redirect?: string }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    const pv = validatePhone(phone);
    if (!pv.valid) errs.phone = pv.error;
    const pw = validatePassword(password);
    if (!pw.valid) errs.password = pw.error;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});
    const result = await login(phone, password);
    if (result.success) {
      navigate({ to: redirect });
    } else {
      setErrors({ general: result.error });
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+255 712 345 678"
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 pr-11 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
      </div>

      {errors.general && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors.general}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <FaLock size={12} />
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
      </p>
    </form>
  );
}
