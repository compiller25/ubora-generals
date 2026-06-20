import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/" }),
  beforeLoad: ({ context, search }: any) => {
    if (context?.auth?.isAuthenticated) throw redirect({ to: search.redirect || "/" });
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">Enter your phone number and password to continue.</p>
        <LoginForm redirect={redirectTo} />
      </div>
    </main>
  );
}
