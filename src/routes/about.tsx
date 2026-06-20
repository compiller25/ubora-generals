import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaHeart, FaLeaf, FaTruck, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const values = [
    {
      icon: FaLeaf,
      title: "Natural Quality",
      description: "We believe in traditional sun-drying methods without chemicals or preservatives. Our DAGAA maintains its natural nutritional value.",
    },
    {
      icon: FaTruck,
      title: "Fast Delivery",
      description: "Same-day dispatch in Dar es Salaam and 1-3 business days nationwide. Your fresh DAGAA arrives at your doorstep quickly.",
    },
    {
      icon: FaHeart,
      title: "Customer Care",
      description: "We're committed to your satisfaction. 7-day freshness guarantee or full refund. Your happiness is our priority.",
    },
  ];

  const contactMethods = [
    { icon: FaPhone, label: "Call Us", value: "+255 628 027 609 / +255 656 565 698", href: "tel:+255628027609" },
    { icon: FaWhatsapp, label: "WhatsApp", value: "+255 615 340 549", href: "https://wa.me/255615340549" },
    { icon: FaEnvelope, label: "Email", value: "uborageneral@gmail.com", href: "mailto:uborageneral@gmail.com" },
    { icon: FaMapMarkerAlt, label: "Office Location", value: "Keko, Temeke, Dar es Salaam", href: "#" },
  ];

  const socialLinks = [
    { icon: FaTiktok, label: "TikTok", handle: "@ubora_dagaa", url: "https://tiktok.com/@ubora_dagaa" },
    { icon: FaInstagram, label: "Instagram", handle: "@ubora_dagaa", url: "https://instagram.com/ubora_dagaa" },
  ];

  return (
    <main className="relative min-h-screen bg-background pb-12">
      <div className="container-mobile space-y-12 py-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 pt-16"
        >
          <h1 className="text-4xl font-bold">About Ubora General Enterprises</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted source for premium DAGAA (sun-dried sardines) from Lake Victoria, serving Dar es Salaam and beyond.
          </p>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Ubora General Enterprises was founded with a simple mission: to bring high-quality, freshly sun-dried DAGAA (sardines) from Lake Victoria directly to your table. We partner with trusted fishermen and use traditional sun-drying methods to preserve the natural nutritional value of our products.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Every package is carefully inspected and tested for quality and freshness. We believe in transparency, quality, and putting our customers first. Based in Keko, Temeke, Dar es Salaam, we're committed to serving the Tanzanian community with the best DAGAA available.
          </p>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Icon className="text-[var(--gold)] text-2xl" />
                    <h3 className="font-semibold">{value.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Quality Assurance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4 rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="text-2xl font-semibold">Quality Assurance</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[var(--gold)] font-bold">✓</span>
              <span className="text-muted-foreground">Lake Victoria sourced from trusted fishermen</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--gold)] font-bold">✓</span>
              <span className="text-muted-foreground">Traditional sun-drying method</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--gold)] font-bold">✓</span>
              <span className="text-muted-foreground">No chemicals or artificial preservatives</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--gold)] font-bold">✓</span>
              <span className="text-muted-foreground">Quality tested before shipment</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--gold)] font-bold">✓</span>
              <span className="text-muted-foreground">7-day freshness guarantee</span>
            </li>
          </ul>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Get In Touch</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.label}
                  href={method.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl border border-border bg-card p-4 hover:border-[var(--gold)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold)]/10">
                      <Icon className="text-[var(--gold)]" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">{method.label}</p>
                  </div>
                  <p className="text-foreground font-medium">{method.value}</p>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* Social Media */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-6 rounded-2xl border border-border bg-card p-8"
        >
          <h2 className="text-2xl font-semibold">Follow Us</h2>
          <p className="text-muted-foreground">Stay updated with our latest products and offers on social media</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 hover:border-[var(--gold)] transition-colors"
                >
                  <Icon className="text-[var(--gold)] text-2xl" />
                  <div>
                    <p className="font-semibold text-foreground">{social.label}</p>
                    <p className="text-sm text-muted-foreground">{social.handle}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* Office Address */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4 rounded-2xl border border-border bg-card p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--gold)]/10 flex-shrink-0">
              <FaMapMarkerAlt className="text-[var(--gold)] text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Office Location</h3>
              <p className="text-muted-foreground mt-2">
                Keko, Temeke<br />
                Dar es Salaam, Tanzania
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Business Hours: 9 AM - 6 PM (Monday - Friday)<br />
                Weekend: 10 AM - 4 PM (Saturday - Sunday)
              </p>
            </div>
          </div>
        </motion.section>

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ubora General Enterprises · Dar es Salaam
        </footer>
      </div>
    </main>
  );
}
