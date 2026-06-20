import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    { icon: FaPhone, label: "Phone", value: "+255 712 345 678" },
    { icon: FaEnvelope, label: "Email", value: "info@ubora.co.tz" },
    { icon: FaMapMarkerAlt, label: "Location", value: "Dar es Salaam, Tanzania" },
    { icon: FaClock, label: "Business Hours", value: "9 AM - 6 PM (Mon-Fri)" },
  ];

  return (
    <main className="relative min-h-screen bg-background pb-12">
      <div className="container-mobile space-y-12 py-6">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 pt-16"
        >
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Get in touch with our team today.
          </p>
        </motion.section>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Get In Touch</h2>
            <div className="space-y-4">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--gold)]/10">
                      <Icon className="text-[var(--gold)] text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">{info.label}</p>
                      <p className="text-foreground">{info.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message"
                  rows={4}
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--gold)] px-6 py-3 font-semibold text-background transition-transform active:scale-95 hover:bg-[var(--gold)]/90"
              >
                {submitted ? "Message Sent! ✓" : "Send Message"}
              </button>
            </form>
          </motion.section>
        </div>

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ubora General Enterprises · Dar es Salaam
        </footer>
      </div>
    </main>
  );
}
