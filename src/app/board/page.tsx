import type { Metadata } from "next";
import { CoordinationBoard } from "@/components/board/coordination-board";
import { ScopeNotice } from "@/components/form-notice";

export const metadata: Metadata = {
  title: "Care-coordination board",
  description:
    "Example tasks, referrals, and status for Lessfret care coordination. Placeholder data.",
};

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ examples?: string }>;
}) {
  const hideExamples = (await searchParams).examples === "hidden";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-14 md:py-16">
      <div className="max-w-2xl space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Stub board
        </p>
        <h1 className="font-heading text-4xl tracking-tight">
          Care coordination
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Status of referrals, scheduling, records, prep, and follow-ups.
          Example cards are labeled. A coordination intake submitted in this
          browser session appears as a requested item.
        </p>
      </div>
      <ScopeNotice title="No clinical work happens here">
        Moving a card does not schedule a real visit or contact a provider.
        Status language describes logistics, not diagnoses or outcomes.
      </ScopeNotice>
      <CoordinationBoard hideExamples={hideExamples} />
    </div>
  );
}
