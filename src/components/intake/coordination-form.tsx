"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CrisisNotice, ScopeNotice } from "@/components/form-notice";
import { SessionNotice } from "@/components/session-notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitCoordinationIntake } from "@/app/actions/intakes";
import {
  needLabels,
  pathwayLabels,
  type CoordinationNeed,
  type CoordinationPathway,
} from "@/lib/intake";

const pathways = Object.entries(pathwayLabels) as [
  CoordinationPathway,
  string,
][];
const needs = Object.entries(needLabels) as [CoordinationNeed, string][];

const fieldClass =
  "h-10 w-full border border-foreground/15 bg-background px-3 text-sm outline-none focus-visible:border-foreground";
const areaClass =
  "w-full border border-foreground/15 bg-background px-3 py-2 text-sm outline-none focus-visible:border-foreground";

export function CoordinationForm() {
  const [state, action, pending] = useActionState(
    submitCoordinationIntake,
    null
  );

  return (
    <form action={action} className="space-y-8">
      <CrisisNotice />
      <ScopeNotice title="Coordination is not treatment">
        We help people navigate referrals, scheduling, records, visit prep, and
        follow-ups with licensed providers. Fertility and diagnostics show up
        often early on; the lane is still broad health navigation. We do not
        invent prescriptions, give medical advice, or claim clinical outcomes.
      </ScopeNotice>
      <SessionNotice>
        This request is stored in GCP project devo-holding and appears on the
        board so we can coordinate logistics. It is not medical treatment.
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
          Pathway
        </legend>
        <p className="text-sm leading-6 text-muted-foreground">
          Highlighted early: fertility and diagnostics. General health is
          first-class.
        </p>
        <div className="space-y-2">
          {pathways.map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 border border-foreground/12 px-3 py-3 text-sm leading-6"
            >
              <input type="radio" name="pathway" value={value} required className="mt-1" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          What do you need coordinated
        </legend>
        <div className="space-y-2">
          {needs.map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 border border-foreground/12 px-3 py-3 text-sm leading-6"
            >
              <input type="checkbox" name="needs" value={value} className="mt-1" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="situation"
          className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          What is going on, in practical terms
        </label>
        <p className="text-sm leading-6 text-muted-foreground">
          Who you already see, what is scheduled, what is stuck. Do not use this
          form for symptoms that need a clinician.
        </p>
        <textarea
          id="situation"
          name="situation"
          required
          minLength={12}
          rows={6}
          className={areaClass}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="providers"
          className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          Providers or facilities already in play (optional)
        </label>
        <textarea id="providers" name="providers" rows={3} className={areaClass} />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6">
        <input type="checkbox" name="acceptedScope" required className="mt-1" />
        <span>
          I understand Lessfret coordinates care and does not diagnose, treat,
          prescribe, or replace a licensed clinician or emergency services.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {pending ? "Saving…" : "Submit coordination intake"}
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
