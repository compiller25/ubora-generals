import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { formatPrice, type Package } from "@/data/product";

interface StickyBuyProps {
  price: number;
  selectedPackage?: Package;
}

export function StickyBuy({ price, selectedPackage }: StickyBuyProps) {
  const searchParams = selectedPackage ? { packageId: selectedPackage.id } : {};

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md"
    >
      <div className="container-mobile flex items-center justify-between gap-3 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Total</p>
          <p className="text-lg font-semibold">{formatPrice(price)}</p>
        </div>
        <Link
          to="/checkout"
          search={searchParams}
          className="flex-1 rounded-full bg-primary px-6 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform active:scale-[0.98]"
        >
          Buy Now
        </Link>
      </div>
    </motion.div>
  );
}
