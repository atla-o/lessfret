import {
  changeSavedStatus,
  removeSavedRequest,
} from "@/app/actions/intakes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SavedStatusForm({
  id,
  lane,
  status,
  options,
  labels,
}: {
  id: string;
  lane: "coaching" | "coordination";
  status: string;
  options: readonly string[];
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      <form action={changeSavedStatus} className="space-y-1.5">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="lane" value={lane} />
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Move this item
          </span>
          <select
            name="status"
            defaultValue={status}
            className="h-9 w-full border border-foreground/15 bg-background px-2 text-sm outline-none"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {labels[option]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={cn(buttonVariants({ size: "sm" }))}>
          Save status
        </button>
      </form>
      <form action={removeSavedRequest}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Remove saved request
        </button>
      </form>
    </div>
  );
}
