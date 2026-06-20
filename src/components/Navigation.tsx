import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/auth/context/AuthContext";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Order Now", href: "/checkout" },
    { label: "Contact Us", href: "/contact" },
  ];

  const authNavLinks = [
    { label: "My Orders", href: "/orders" },
  ];

  async function handleLogout() {
    await logout();
    setIsOpen(false);
    navigate({ to: "/" });
  }

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed right-4 top-6 z-50 rounded-lg bg-[var(--gold)] p-3 text-background shadow-lg transition-transform active:scale-95 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-64 bg-background shadow-xl"
          >
            <div className="flex flex-col gap-2 p-6 pt-24">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                {isAuthenticated ? (
                  <>
                    {authNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-4 py-3 text-lg font-semibold text-primary transition-colors hover:bg-accent"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <p className="px-4 py-2 text-sm font-medium text-foreground">{user?.profile.fullName}</p>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-4 py-3 text-left text-lg font-semibold text-destructive transition-colors hover:bg-accent"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-accent">Sign in</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-lg font-semibold text-primary transition-colors hover:bg-accent">Create account</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <nav className="hidden md:fixed md:right-6 md:top-6 md:z-40 md:flex md:items-center md:gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            {authNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <span className="ml-2 px-3 py-2 text-sm font-medium text-foreground">{user?.profile.fullName}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-accent"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent">Sign in</Link>
            <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Create account</Link>
          </>
        )}
      </nav>
    </>
  );
}
