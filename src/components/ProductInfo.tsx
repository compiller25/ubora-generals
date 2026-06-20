import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatPrice, type Package, type Product } from "@/data/product";

interface ProductInfoProps {
  product: Product;
  selectedPackage?: Package;
}

export function ProductInfo({ product, selectedPackage }: ProductInfoProps) {
  if (!selectedPackage) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-[var(--gold)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={i < Math.round(product.rating) ? "" : "opacity-25"} />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating} ({product.reviewCount.toLocaleString()} reviews)
        </span>
      </div>

      <div>
        <h2 className="text-3xl">{selectedPackage.name}</h2>
        <p className="mt-2 text-base text-muted-foreground">{selectedPackage.description}</p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          {formatPrice(selectedPackage.price)}
        </span>
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(Math.round(selectedPackage.price * 1.25))}
        </span>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          Save 20%
        </span>
      </div>
    </motion.section>
  );
}
