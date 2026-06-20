export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string;
};

export type Benefit = { id: string; icon: string; title: string; description: string };

export type Package = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  tagline: string;
  currency: string;
  rating: number;
  reviewCount: number;
  videoUrl: string;
  benefits: Benefit[];
  testimonials: Testimonial[];
  faqs: { q: string; a: string }[];
  packages: Package[];
};

const sharedAttributes: Omit<Product, "packages"> = {
  id: "dagaa-product",
  tagline: "Fresh, sun-dried, naturally preserved.",
  currency: "TZS",
  rating: 4.8,
  reviewCount: 856,
  videoUrl: "/images/dagaa-video.mp4",
  benefits: [
    { id: "b1", icon: "spark", title: "Lake Victoria Fresh", description: "Sourced directly from trusted fishermen on Lake Victoria." },
    { id: "b2", icon: "leaf", title: "Sun-Dried Natural", description: "No chemicals or preservatives. Traditional sun-drying method." },
    { id: "b3", icon: "truck", title: "Fast Delivery", description: "Same-day dispatch in Dar es Salaam, 1-3 days nationwide." },
    { id: "b4", icon: "shield", title: "Quality Tested", description: "Inspected and certified for freshness and quality." },
    { id: "b5", icon: "heart", title: "Rich in Protein", description: "Excellent source of protein and omega-3 fatty acids." },
    { id: "b6", icon: "refresh", title: "Fresh Guarantee", description: "7-day freshness guarantee or full refund." },
  ],
  testimonials: [
    { id: "t1", name: "Mama Fatuma", rating: 5, text: "Fresh DAGAA, exactly what I needed. Quality ni nzuri sana!", avatar: "/images/customers/customer-1.jpg" },
    { id: "t2", name: "Juma M.", rating: 5, text: "Best DAGAA in Dar. Delivered fresh and well-packed. Highly recommend!", avatar: "/images/customers/customer-2.jpg" },
    { id: "t3", name: "Grace K.", rating: 4, text: "Good quality, fast delivery. Will order again.", avatar: "/images/customers/customer-3.jpg" },
    { id: "t4", name: "Harriet.", rating: 5, text: "Very fresh, just like buying from the market but more convenient.", avatar: "/images/customers/customer-4.jpg" },
  ],
  faqs: [
    { q: "How is the DAGAA packaged?", a: "Sealed in food-grade plastic bags to maintain freshness during transport." },
    { q: "How long does delivery take?", a: "Same-day in Dar es Salaam, 1-3 business days across mainland Tanzania." },
    { q: "What payment methods are accepted?", a: "M-Pesa, Airtel Money, and Tigo Pesa. Card payments coming soon." },
    { q: "How should I store DAGAA?", a: "Keep in a cool, dry place. Refrigerate after opening for extended freshness." },
    { q: "Can I return if not satisfied?", a: "Yes — 7-day freshness guarantee. Contact us if you're not satisfied." },
  ],
};

export const product: Product = {
  ...sharedAttributes,
  packages: [
    {
      id: "dagaa-starter",
      name: "Starter Package",
      price: 4000,
      description: "Perfect for trying DAGAA or individual use. Fresh, sun-dried sardines ideal for home cooking.",
      image: "/images/dagaa-1.jpg",
    },
    {
      id: "dagaa-standard",
      name: "Standard Package",
      price: 8000,
      description: "Ideal for regular household use. Greater quantity, excellent value for families.",
      image: "/images/dagaa-4.jpg",
    },
    {
      id: "dagaa-premium",
      name: "Premium Package",
      price: 15000,
      description: "Maximum quantity for bulk use or commercial needs. Best value per unit.",
      image: "/images/dagaa-6.jpg",
    },
  ],
};

export const formatPrice = (amount: number, currency = product.currency) =>
  `${currency} ${amount.toLocaleString()}`;
