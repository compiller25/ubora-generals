import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { type Package } from "@/data/product";

interface ProductCarouselProps {
  selectedPackage?: Package;
}

export function ProductCarousel({ selectedPackage }: ProductCarouselProps) {
  if (!selectedPackage) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-muted">
        <div className="h-full w-full animate-pulse bg-muted" />
      </div>
    );
  }

  return (
    <div className="ubora-carousel overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img
          src={selectedPackage.image}
          alt={selectedPackage.name}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <style>{`
        .ubora-carousel .swiper-pagination-bullet { background: var(--foreground); opacity: 0.3; }
        .ubora-carousel .swiper-pagination-bullet-active { background: var(--primary); opacity: 1; width: 22px; border-radius: 4px; transition: all .3s; }
      `}</style>
    </div>
  );
}
