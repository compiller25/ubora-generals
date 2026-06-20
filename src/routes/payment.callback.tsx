import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/payment/callback")({
  validateSearch: (s: Record<string, unknown>) => ({
    status: typeof s.status === "string" ? s.status : undefined,
    tx_ref: typeof s.tx_ref === "string" ? s.tx_ref : undefined,
    transaction_id: typeof s.transaction_id === "string" ? s.transaction_id : undefined,
  }),
  component: PaymentCallback,
});

function PaymentCallback() {
  const navigate = useNavigate();
  const { status, tx_ref, transaction_id } = Route.useSearch();

  useEffect(() => {
    // Fallback handler — STK push flow handles success via polling, not redirect.
    // This page only fires if Flutterwave sends a redirect for any reason.
    if (status === "successful" && tx_ref) {
      navigate({ to: "/success", search: { order: tx_ref, payment: transaction_id || tx_ref } });
    } else {
      navigate({ to: "/" });
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </main>
  );
}
