import { motion } from "framer-motion";

export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-3xl bg-muted shadow-[var(--shadow-elevated)]"
      style={{ aspectRatio: "4/5" }}
    >
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">Ubora General Enterprises</p>
        <h1 className="mt-1 text-3xl leading-tight">Crafted for everyday excellence.</h1>
      </div>
    </motion.div>
  );
}
