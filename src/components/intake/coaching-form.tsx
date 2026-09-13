"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CrisisNotice, ScopeNotice } from "@/components/form-notice";
import { SessionNotice } from "@/components/session-notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitCoachingIntake } from "@/app/actions/intakes";
import { coachingFocusLabels, type CoachingFocus } from "@/lib/intake";

const focuses = Object.entries(coachingFocusLabels) as [
  CoachingFocus,
  string,
][];

const fieldClass =
  "h-10 w-full border border-foreground/15 bg-background px-3 text-sm outline-none focus-visible:border-foreground";
const areaClass =
  "w-full border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus-visible:border-foreground";

export function CoachingForm() {
  const [state, action, pending] = useActionState(submitCoachingIntake, null);

  return (
    <form action={action} className="space-y-8">
      <CrisisNotice />
      <ScopeNotice title="This is coaching, not therapy">
        Lessfret coaches in a wellness and life-coach lane. We do not provide
        psychotherapy, psychiatry, diagnosis, or crisis intervention. If you
        need licensed clinical care, ask a clinician — we can help coordinate
        that search on the care-coordination side.
      </ScopeNotice>
      <SessionNotice>
        This request is stored in GCP project devo-holding so Lessfret can
        follow up. It is not a clinical record and not emergency care.
      </SessionNotice>

      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          How should we address you
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact"
          className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          Best contact
        </label>
        <p className="text-sm leading-6 text-muted-foreground">
          Email or phone so we can reach you about this request.
        </p>
        <input
          id="contact"
          name="contact"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          What do you want coaching around
        </legend>
        <div className="space-y-2">
          {focuses.map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 border border-foreground/12 px-3 py-3 text-sm leading-6"
            >
              <input type="radio" name="focus" value={value} required className="mt-1" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="conversation"
          className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          What would a useful first conversation cover
        </label>
        <p className="text-sm leading-6 text-muted-foreground">
          Goals, constraints, and what “less fret” would look like for you. Keep
          clinical history for licensed clinicians.
        </p>
        <textarea
          id="conversation"
          name="conversation"
          required
          minLength={12}
          rows={6}
          className={areaClass}
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6">
        <input type="checkbox" name="acceptedScope" required className="mt-1" />
        <span>
          I understand this is life-coach counseling, not therapy, not a
          diagnosis, and not a substitute for licensed clinical care.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {pending ? "Saving…" : "Submit coaching intake"}
        </button>
        <Link
          href="/intake"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
