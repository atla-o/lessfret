import { cn } from "@/lib/utils";

export function StatusSelect<T extends string>({
  value,
  options,
  labels,
  onChange,
  label,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          "h-9 w-full border border-foreground/15 bg-background px-2 text-sm outline-none",
          "focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/15"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
