"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SavedStatusForm } from "@/components/saved-status-form";
import { StatusSelect } from "@/components/status-select";
import { cn } from "@/lib/utils";
import {
  coachingStatusLabels,
  coachingStatusOrder,
  exampleCoachingItems,
  type CoachingItem,
  type CoachingStatus,
} from "@/lib/coaching-data";
import {
  clearExampleStatus,
  emptyExampleStatus,
  readExampleStatus,
  setExampleStatus,
  subscribeExampleStatus,
} from "@/lib/example-status";
import { formatSubmittedAt } from "@/lib/format";
import { coachingFocusLabels } from "@/lib/intake";
import type { PersistedCoaching, PersistedIntake } from "@/lib/records";

function itemFromIntake(intake: PersistedCoaching): CoachingItem {
  const focus = intake.focus || "other";
  return {
    id: intake.id,
    title: `${intake.name} · ${coachingFocusLabels[focus]}`,
    detail: intake.conversation,
    focus,
    status: intake.status,
    example: false,
    session: false,
    submittedAt: intake.submittedAt,
  };
}

function Column({
  status,
  items,
}: {
  status: CoachingStatus;
  items: CoachingItem[];
}) {
  return (
    <section className="flex min-w-[16.5rem] flex-1 flex-col border border-foreground/10 bg-background">
      <header className="flex items-center justify-between gap-2 border-b border-foreground/10 px-3 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em]">
          {coachingStatusLabels[status]}
        </h2>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {items.length === 0 ? (
          <p className="px-2 py-6 text-sm text-muted-foreground">
            Nothing in this column.
          </p>
        ) : (
          items.map((item) => <CoachingCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}

function CoachingCard({ item }: { item: CoachingItem }) {
  return (
    <article className="space-y-3 border border-foreground/10 px-3 py-3">
      <div className="flex flex-wrap gap-1.5">
        {item.example ? (
          <Badge variant="outline" className="font-normal">
            Example
          </Badge>
        ) : (
          <Badge className="font-normal">Saved</Badge>
        )}
        <Badge variant="secondary" className="font-normal">
          {coachingFocusLabels[item.focus]}
        </Badge>
      </div>
      <h3 className="text-sm font-medium leading-5">{item.title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
      {item.submittedAt ? (
        <p className="text-xs text-muted-foreground">
          Saved {formatSubmittedAt(item.submittedAt)}
        </p>
      ) : null}
      {item.example ? (
        <StatusSelect
          label="Move this request"
          value={item.status}
          options={coachingStatusOrder}
          labels={coachingStatusLabels}
          onChange={(status) => setExampleStatus(item.id, status)}
        />
      ) : (
        <SavedStatusForm
          id={item.id}
          lane="coaching"
          status={item.status}
          options={coachingStatusOrder}
          labels={coachingStatusLabels}
        />
      )}
    </article>
  );
}

export function CoachingBoard({
  hideExamples,
  initialIntakes,
  loadError,
  justSaved,
}: {
  hideExamples: boolean;
  initialIntakes: PersistedIntake[];
  loadError: string | null;
  justSaved?: boolean;
}) {
  const exampleStatus = useSyncExternalStore(
    subscribeExampleStatus,
    readExampleStatus,
    emptyExampleStatus
  );

  const savedIntakes = initialIntakes.filter(
    (item): item is PersistedCoaching => item.lane === "coaching"
  );

  const items = useMemo(() => {
    const saved = savedIntakes.map(itemFromIntake);
    const examples = hideExamples
      ? []
      : exampleCoachingItems.map((item) => ({
          ...item,
          status: (exampleStatus[item.id] as CoachingStatus) ?? item.status,
        }));
    return [...saved, ...examples];
  }, [exampleStatus, hideExamples, savedIntakes]);

  function grouped(status: CoachingStatus) {
    return items.filter((item) => item.status === status);
  }

  return (
    <div className="space-y-6">
      {justSaved ? (
        <p className="border border-foreground/12 px-4 py-3 text-sm" role="status">
          Coaching request saved to GCP project devo-holding. Refresh keeps it
          here.
        </p>
      ) : null}
      <div className="flex flex-col gap-3 border border-foreground/10 bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          Cards marked <span className="text-foreground">Saved</span> live in
          GCP project devo-holding. Example cards are placeholders, not real
          people or outcomes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={hideExamples ? "/coaching" : "/coaching?examples=hidden"}
            aria-pressed={hideExamples}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {hideExamples ? "Show examples" : "Hide examples"}
          </Link>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            onClick={() => clearExampleStatus()}
          >
            Reset example statuses
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="border border-destructive/30 px-4 py-4" role="alert">
          <p className="text-sm text-destructive">{loadError}</p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="space-y-4 border border-dashed border-foreground/20 px-6 py-12 text-center">
          <p className="font-heading text-2xl">No coaching requests yet.</p>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Example cards are hidden, and no saved request came back from
            Lessfret. Submit one to put a live card here.
          </p>
          <Link
            href="/intake/coaching"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Start a coaching intake
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {coachingStatusOrder.map((status) => (
            <Column key={status} status={status} items={grouped(status)} />
          ))}
        </div>
      )}
    </div>
  );
}
