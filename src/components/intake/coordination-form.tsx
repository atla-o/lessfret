"use client";

import { useState } from "react";
import Link from "next/link";
import { ChoiceRow, Field } from "@/components/field";
import { CrisisNotice, ScopeNotice } from "@/components/form-notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  needLabels,
  pathwayLabels,
  simulateSubmit,
  writeIntake,
  type CoordinationNeed,
  type CoordinationPathway,
  type CoordinationIntake,
} from "@/lib/intake";

const pathways = Object.entries(pathwayLabels) as [
  CoordinationPathway,
  string,
][];
const needs = Object.entries(needLabels) as [CoordinationNeed, string][];

type FormState = "editing" | "invalid" | "submitting" | "error" | "success";

export function CoordinationForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [pathway, setPathway] = useState<CoordinationPathway | "">("");
  const [selectedNeeds, setSelectedNeeds] = useState<CoordinationNeed[]>([]);
  const [situation, setSituation] = useState("");
  const [providers, setProviders] = useState("");
  const [acceptedScope, setAcceptedScope] = useState(false);
  const [state, setState] = useState<FormState>("editing");
  const [error, setError] = useState<string | null>(null);

  const missing = {
    name: !name.trim(),
    contact: !contact.trim(),
    pathway: !pathway,
    needs: selectedNeeds.length === 0,
    situation: situation.trim().length < 12,
    acceptedScope: !acceptedScope,
  };

  function toggleNeed(need: CoordinationNeed, checked: boolean) {
    setSelectedNeeds((current) =>
      checked ? [...current, need] : current.filter((item) => item !== need)
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (Object.values(missing).some(Boolean)) {
      setState("invalid");
      setError("Fill the required fields and accept the scope note.");
      return;
    }

    setState("submitting");
    setError(null);

    try {
      await simulateSubmit();
      const payload: CoordinationIntake = {
        lane: "coordination",
        name: name.trim(),
        contact: contact.trim(),
        pathway,
        needs: selectedNeeds,
        situation: situation.trim(),
        providers: providers.trim(),
        acceptedScope,
        submittedAt: new Date().toISOString(),
      };
      writeIntake(payload);
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "success") {
    return (
      <div className="space-y-6 border border-foreground/12 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Intake received
        </p>
        <h2 className="font-heading text-3xl tracking-tight">
          Coordination request is on the board.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          This first pass keeps the request in your browser session and adds it
          to the example board. No clinic is contacted. Lessfret does not order
          tests, interpret results, or practice medicine.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/board" className={cn(buttonVariants({ size: "lg" }))}>
            Open the board
          </Link>
          <Link
            href="/intake"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Another intake
          </Link>
        </div>
      </div>
    );
  }

  const showFieldErrors = state === "invalid";

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <CrisisNotice />
      <ScopeNotice title="Coordination is not treatment">
        We help people navigate referrals, scheduling, records, visit prep, and
        follow-ups with licensed providers. Fertility and diagnostics show up
        often early on; the lane is still broad health navigation. We do not
        invent prescriptions, give medical advice, or claim clinical outcomes.
      </ScopeNotice>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Field
        label="How should we address you"
        htmlFor="name"
        error={showFieldErrors && missing.name ? "Required." : undefined}
      >
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10"
          autoComplete="name"
          aria-invalid={showFieldErrors && missing.name}
        />
      </Field>

      <Field
        label="Best contact"
        hint="Email or phone. This stub does not send messages."
        htmlFor="contact"
        error={showFieldErrors && missing.contact ? "Required." : undefined}
      >
        <Input
          id="contact"
          name="contact"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          className="h-10"
          autoComplete="email"
          aria-invalid={showFieldErrors && missing.contact}
        />
      </Field>

      <Field
        label="Pathway"
        hint="Highlighted early: fertility and diagnostics. General health is first-class."
        error={showFieldErrors && missing.pathway ? "Choose one." : undefined}
      >
        <RadioGroup
          value={pathway}
          onValueChange={(value) => setPathway(value as CoordinationPathway)}
          className="gap-2"
        >
          {pathways.map(([value, label]) => (
            <ChoiceRow key={value}>
              <RadioGroupItem value={value} className="mt-1" />
              <span>{label}</span>
            </ChoiceRow>
          ))}
        </RadioGroup>
      </Field>

      <Field
        label="What do you need coordinated"
        error={
          showFieldErrors && missing.needs ? "Select at least one." : undefined
        }
      >
        <div className="space-y-2">
          {needs.map(([value, label]) => (
            <ChoiceRow key={value}>
              <Checkbox
                className="mt-1"
                checked={selectedNeeds.includes(value)}
                onCheckedChange={(checked) =>
                  toggleNeed(value, checked === true)
                }
              />
              <span>{label}</span>
            </ChoiceRow>
          ))}
        </div>
      </Field>

      <Field
        label="What is going on, in practical terms"
        hint="Who you already see, what is scheduled, what is stuck. Do not use this form for symptoms that need a clinician."
        htmlFor="situation"
        error={
          showFieldErrors && missing.situation
            ? "Add a short note so we know what to coordinate."
            : undefined
        }
      >
        <Textarea
          id="situation"
          name="situation"
          value={situation}
          onChange={(event) => setSituation(event.target.value)}
          rows={6}
          aria-invalid={showFieldErrors && missing.situation}
        />
      </Field>

      <Field
        label="Providers or facilities already in play (optional)"
        htmlFor="providers"
      >
        <Textarea
          id="providers"
          name="providers"
          value={providers}
          onChange={(event) => setProviders(event.target.value)}
          rows={3}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-6">
        <Checkbox
          checked={acceptedScope}
          onCheckedChange={(checked) => setAcceptedScope(checked === true)}
          className="mt-0.5"
          aria-invalid={showFieldErrors && missing.acceptedScope}
        />
        <span>
          I understand Lessfret coordinates care and does not diagnose, treat,
          prescribe, or replace a licensed clinician or emergency services.
        </span>
      </label>
      {showFieldErrors && missing.acceptedScope ? (
        <p className="text-sm text-destructive">Please confirm the scope.</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {state === "submitting" ? "Saving…" : "Submit coordination intake"}
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
