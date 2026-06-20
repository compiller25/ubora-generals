import { FaMinus, FaPlus } from "react-icons/fa";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        disabled={value <= min}
      >
        <FaMinus size={11} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        disabled={value >= max}
      >
        <FaPlus size={11} />
      </button>
    </div>
  );
}
