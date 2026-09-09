import type { Metadata } from "next";
import Link from "next/link";
import { CrisisNotice } from "@/components/form-notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Intake",
  description:
    "Choose a coaching conversation or care-coordination intake. Neither is therapy or medical treatment.",
};

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 py-14 md:py-20">
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Consultation intake
        </p>
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
          Start with the lane you need.
        </h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          These forms are stubs. They validate, save to this browser session,
          and show the empty, error, submitting, and received states. Nothing
          is sent to a coach, clinic, or cloud yet.
        </p>
      </div>

      <CrisisNotice />

      <div className="grid gap-4 md:grid-cols-2">
        <article className="flex flex-col gap-4 border border-foreground/12 p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em]">
            Coaching
          </h2>
          <p className="flex-1 text-sm leading-7 text-muted-foreground">
            A first conversation in the life-coach lane — direction, work,
            relationships, habits, or the stress around health logistics.
            Not therapy.
          </p>
          <Link
            href="/intake/coaching"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Open coaching intake
          </Link>
        </article>
        <article className="flex flex-col gap-4 border border-foreground/12 p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em]">
            Care coordination
          </h2>
          <p className="flex-1 text-sm leading-7 text-muted-foreground">
            Referrals, scheduling, records, prep, and follow-ups. Fertility
            and diagnostics are highlighted; general health is included. Not
            a medical practice.
          </p>
          <Link
            href="/intake/coordination"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Open coordination intake
          </Link>
        </article>
      </div>
    </div>
  );
}
