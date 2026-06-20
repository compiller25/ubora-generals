import { motion } from "framer-motion";
import { FaBolt, FaLeaf, FaTruck, FaShieldAlt, FaHeart, FaSyncAlt } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { Benefit } from "@/data/product";

const ICONS: Record<string, IconType> = {
  spark: FaBolt, leaf: FaLeaf, truck: FaTruck, shield: FaShieldAlt, heart: FaHeart, refresh: FaSyncAlt,
};

export function Benefits({ benefits }: { benefits: Benefit[] }) {
  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why Ubora</p>
        <h2 className="mt-1 text-2xl">Built around what matters.</h2>
      </header>
      <div className="grid grid-cols-2 gap-3">
        {benefits.map((b, i) => {
          const Icon = ICONS[b.icon] ?? FaBolt;
          return (
            <motion.article
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-base font-semibold">{b.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
