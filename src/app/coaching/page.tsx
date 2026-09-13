import type { Metadata } from "next";
import { CoachingBoard } from "@/components/coaching/coaching-board";
import { ScopeNotice } from "@/components/form-notice";

export const metadata: Metadata = {
  title: "Coaching requests",
  description:
    "Review life-coach requests saved to Lessfret. Guidance, not psychotherapy.",
};

export default async function CoachingPage({
  searchParams,
}: {
  searchParams: Promise<{ examples?: string }>;
}) {
  const hideExamples = (await searchParams).examples === "hidden";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-14 md:py-16">
      <div className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Life-coach counseling
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          Coaching requests
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Saved coaching requests from GCP project devo-holding, plus labeled
          examples. Move a card when a conversation is set or closed. This is
          coaching, not therapy, and it is not a clinical record.
        </p>
      </div>
      <ScopeNotice title="No clinical work happens here">
        Changing status does not book a coach or start licensed care. If you
        need a clinician, use care coordination — and if you are in danger,
        contact local emergency services.
      </ScopeNotice>
      <CoachingBoard hideExamples={hideExamples} />
    </div>
  );
}
