import { formatPrice, type Product, type Package } from "@/data/product";

interface OrderItem { pkg: Package; quantity: number }

interface OrderSummaryProps {
  product: Product;
  items: OrderItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  if (items.length === 0) return null;
  const total = items.reduce((sum, { pkg, quantity }) => sum + pkg.price * quantity, 0);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      {items.map(({ pkg, quantity }) => (
        <div key={pkg.id} className="flex items-center gap-3">
          <img src={pkg.image} alt={pkg.name} className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{pkg.name}</p>
            <p className="text-xs text-muted-foreground">Qty {quantity} · {formatPrice(pkg.price)} each</p>
          </div>
          <span className="text-sm font-medium">{formatPrice(pkg.price * quantity)}</span>
        </div>
      ))}
      <div className="space-y-2 border-t border-border pt-3 text-sm">
        <Row label="Shipping" value="Free" />
        <Row label="Total" value={formatPrice(total)} bold />
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-base font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "text-base font-semibold" : "text-foreground"}>{value}</span>
    </div>
  );
}
