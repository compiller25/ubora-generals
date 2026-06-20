import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/auth/context/AuthContext";
import { validatePhone, validatePassword, validateEmail } from "@/auth/validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "", fullName: "", address: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string; fullName?: string; address?: string; email?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    const pv = validatePhone(form.phone); if (!pv.valid) errs.phone = pv.error;
    const pw = validatePassword(form.password); if (!pw.valid) errs.password = pw.error;
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    const ev = validateEmail(form.email); if (!ev.valid) errs.email = ev.error;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});
    const result = await register(form.phone, form.password, {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addresses: [form.address.trim()],
      email: form.email.trim() || undefined,
    });
    if (result.success) {
      navigate({ to: "/checkout" });
    } else {
      setErrors({ general: result.error });
    }
    setSubmitting(false);
  }

  const fields: { field: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { field: "fullName", label: "Full name",              type: "text",     placeholder: "Amani Kimaro" },
    { field: "phone",    label: "Phone number",           type: "tel",      placeholder: "+255 712 345 678" },
    { field: "address",  label: "Delivery address",       type: "text",     placeholder: "Street, area, city" },
    { field: "email",    label: "Email address (optional)", type: "email",  placeholder: "you@example.com" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map(({ field, label, type, placeholder }) => (
        <div key={field}>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
          <input
            type={type}
            value={form[field]}
            onChange={set(field)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors[field] && <p className="mt-1 text-xs text-destructive">{errors[field]}</p>}
        </div>
      ))}

      {/* Password field with show/hide */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            placeholder="Min 8 chars, include a number"
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

      <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all active:scale-[0.99] disabled:opacity-50">
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
