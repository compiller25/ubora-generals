import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductInfo } from "@/components/ProductInfo";
import { PackageTiers } from "@/components/PackageTiers";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { StickyBuy } from "@/components/StickyBuy";
import { product, type Package } from "@/data/product";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(product.packages[0]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    // Scroll to product info
    const element = document.querySelector("main");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background pb-28">
      <div className="container-mobile space-y-10 py-6">
        <header className="flex items-center justify-between pt-16">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Ubora General Enterprises" 
              className="h-12 w-auto"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Ubora</p>
              <p className="text-sm font-semibold">General Enterprises</p>
            </div>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Free shipping
          </span>
        </header>

        <HeroVideo src={product.videoUrl} poster={product.packages[0].image} />
        
        <PackageTiers packages={product.packages} onSelectPackage={handleSelectPackage} />
        
        <ProductCarousel selectedPackage={selectedPackage} />
        <ProductInfo product={product} selectedPackage={selectedPackage} />
        <Benefits benefits={product.benefits} />
        <Testimonials items={product.testimonials} />
        <FAQ items={product.faqs} />

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ubora General Enterprises · Dar es Salaam
        </footer>
      </div>

      <StickyBuy price={selectedPackage?.price ?? product.packages[0].price} selectedPackage={selectedPackage} />
    </main>
  );
}
