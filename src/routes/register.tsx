import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Create account</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign up to place orders and track your purchases.</p>
        <RegisterForm />
      </div>
    </main>
  );
}
