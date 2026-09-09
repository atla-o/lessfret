import type { Metadata } from "next";
import { CoachingForm } from "@/components/intake/coaching-form";

export const metadata: Metadata = {
  title: "Coaching intake",
  description:
    "Request a life-coach conversation. This is guidance, not psychotherapy or diagnosis.",
};

export default function CoachingIntakePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-5 py-14 md:py-20">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Life-coach counseling
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          Coaching intake
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Tell us what a useful conversation would cover. Keep medical
          questions for licensed clinicians; we can help you reach them on
          the coordination side.
        </p>
      </div>
      <CoachingForm />
    </div>
  );
}
