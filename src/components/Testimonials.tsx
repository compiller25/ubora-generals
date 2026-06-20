import { FaStar } from "react-icons/fa";
import type { Testimonial } from "@/data/product";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Loved by thousands</p>
        <h2 className="mt-1 text-2xl">Real reviews from real customers.</h2>
      </header>
      <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
        {items.map((t) => (
          <article
            key={t.id}
            className="min-w-[78%] snap-start rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <div className="flex text-[var(--gold)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} size={11} className={i < t.rating ? "" : "opacity-25"} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
          </article>
        ))}
      </div>
    </section>
  );
}
