import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PackageTiers } from "@/components/PackageTiers";
import { Benefits } from "@/components/Benefits";
import { product, type Package } from "@/data/product";
import { useState } from "react";

export const Route = createFileRoute("/products")({
  component: Products,
});

function Products() {
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(product.packages[0]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  return (
    <main className="relative min-h-screen bg-background pb-28">
      <div className="container-mobile space-y-10 py-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 pt-16"
        >
          <h1 className="text-4xl font-bold">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Fresh, sun-dried DAGAA (sardines) sourced directly from Lake Victoria. Choose the package that fits your needs.
          </p>
        </motion.section>

        <PackageTiers packages={product.packages} onSelectPackage={handleSelectPackage} />

        {selectedPackage && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted">
              <img
                src={selectedPackage.image}
                alt={selectedPackage.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{selectedPackage.name}</h2>
              <p className="mt-3 text-base text-muted-foreground">{selectedPackage.description}</p>
            </div>
          </motion.section>
        )}

        <Benefits benefits={product.benefits} />

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ubora General Enterprises · Dar es Salaam
        </footer>
      </div>
    </main>
  );
}
