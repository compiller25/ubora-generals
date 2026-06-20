import { motion } from "framer-motion";
import { formatPrice, type Package } from "@/data/product";
import { Button } from "@/components/ui/button";

interface PackageTiersProps {
  packages: Package[];
  onSelectPackage: (pkg: Package) => void;
}

export function PackageTiers({ packages, onSelectPackage }: PackageTiersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-semibold">Choose Your Package</h2>
        <p className="mt-2 text-muted-foreground">Select the perfect DAGAA package for your needs</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {packages.map((pkg, idx) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            isPopular={idx === 2}
            onSelect={() => onSelectPackage(pkg)}
          />
        ))}
      </div>
    </motion.section>
  );
}

interface PackageCardProps {
  package: Package;
  isPopular?: boolean;
  onSelect: () => void;
}

function PackageCard({ package: pkg, isPopular = false, onSelect }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border-2 p-4 transition-all ${
        isPopular
          ? "border-[var(--gold)] bg-gradient-to-b from-[var(--gold)]/5 to-transparent shadow-lg"
          : "border-border bg-card"
      }`}
    >
      {isPopular && (
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-[var(--gold)] opacity-10" />
      )}

      {isPopular && (
        <div className="mb-3 inline-block rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-background">
          Most Popular
        </div>
      )}

      <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted mb-4">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>

      <h3 className="text-xl font-semibold">{pkg.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">{formatPrice(pkg.price)}</span>
      </div>

      <Button
        onClick={onSelect}
        className="mt-4 w-full bg-[var(--gold)] text-background hover:bg-[var(--gold)]/90"
      >
        Select Package
      </Button>
    </motion.div>
  );
}
