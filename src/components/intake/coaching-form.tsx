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
  coachingFocusLabels,
  simulateSubmit,
  writeIntake,
  type CoachingFocus,
  type CoachingIntake,
} from "@/lib/intake";

const focuses = Object.entries(coachingFocusLabels) as [
  CoachingFocus,
  string,
][];

type FormState = "editing" | "invalid" | "submitting" | "error" | "success";

export function CoachingForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [focus, setFocus] = useState<CoachingFocus | "">("");
  const [conversation, setConversation] = useState("");
  const [acceptedScope, setAcceptedScope] = useState(false);
  const [state, setState] = useState<FormState>("editing");
  const [error, setError] = useState<string | null>(null);

  const missing = {
    name: !name.trim(),
    contact: !contact.trim(),
    focus: !focus,
    conversation: conversation.trim().length < 12,
    acceptedScope: !acceptedScope,
  };

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
      const payload: CoachingIntake = {
        lane: "coaching",
        name: name.trim(),
        contact: contact.trim(),
        focus,
        conversation: conversation.trim(),
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
          We have your coaching request.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          This first pass stores the note in your browser session only. A coach
          does not see it yet. Nothing here starts a clinical relationship, and
          we will not diagnose or treat anything from this form.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/intake" className={cn(buttonVariants({ size: "lg" }))}>
            Back to intake
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  const showFieldErrors = state === "invalid";

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <CrisisNotice />
      <ScopeNotice title="This is coaching, not therapy">
        Lessfret coaches in a wellness and life-coach lane. We do not provide
        psychotherapy, psychiatry, diagnosis, or crisis intervention. If you
        need licensed clinical care, ask a clinician — we can help coordinate
        that search on the care-coordination side.
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
        label="What do you want coaching around"
        error={showFieldErrors && missing.focus ? "Choose one." : undefined}
      >
        <RadioGroup
          value={focus}
          onValueChange={(value) => setFocus(value as CoachingFocus)}
          className="gap-2"
        >
          {focuses.map(([value, label]) => (
            <ChoiceRow key={value}>
              <RadioGroupItem value={value} className="mt-1" />
              <span>{label}</span>
            </ChoiceRow>
          ))}
        </RadioGroup>
      </Field>

      <Field
        label="What would a useful first conversation cover"
        hint="Goals, constraints, and what “less fret” would look like for you. Keep clinical history for licensed clinicians."
        htmlFor="conversation"
        error={
          showFieldErrors && missing.conversation
            ? "Add a short note so we know where to start."
            : undefined
        }
      >
        <Textarea
          id="conversation"
          name="conversation"
          value={conversation}
          onChange={(event) => setConversation(event.target.value)}
          rows={6}
          aria-invalid={showFieldErrors && missing.conversation}
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
          I understand this is life-coach counseling, not therapy, not a
          diagnosis, and not a substitute for licensed clinical care.
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
          {state === "submitting" ? "Saving…" : "Submit coaching intake"}
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
