import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-5 px-5 py-24">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Missing
      </p>
      <h1 className="font-heading text-4xl tracking-tight">
        That page is not here.
      </h1>
      <p className="text-sm leading-7 text-muted-foreground">
        Return to the landing page, or start an intake if you meant to request
        coaching or coordination.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          Home
        </Link>
        <Link
          href="/intake"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Intake
        </Link>
      </div>
    </div>
  );
}
