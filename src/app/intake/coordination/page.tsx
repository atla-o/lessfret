import type { Metadata } from "next";
import { CoordinationForm } from "@/components/intake/coordination-form";

export const metadata: Metadata = {
  title: "Care-coordination intake",
  description:
    "Request help navigating referrals, scheduling, records, and follow-ups. Not medical advice.",
};

export default function CoordinationIntakePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-5 py-14 md:py-20">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Care coordination
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          Coordination intake
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Describe the logistics you want help with. Fertility and diagnostics
          are common early pathways; general health navigation is in scope.
          We will not treat, diagnose, or prescribe.
        </p>
      </div>
      <CoordinationForm />
    </div>
  );
}
