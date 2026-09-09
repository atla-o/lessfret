import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
      </label>
      {hint ? (
        <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChoiceRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-foreground/12 px-3 py-3 text-sm leading-6 has-data-checked:border-foreground has-data-checked:bg-foreground/[0.03]",
        className
      )}
    >
      {children}
    </label>
  );
}
