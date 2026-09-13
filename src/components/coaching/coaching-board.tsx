"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import {
  changeIntakeStatus,
  refreshIntakes,
  removeSavedIntake,
  removeSavedLane,
} from "@/lib/intakes-store";
import type { PersistedCoaching } from "@/lib/records";
import { useIntakes } from "@/lib/use-intakes";

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
  onStatusChange,
  onRemove,
}: {
  status: CoachingStatus;
  items: CoachingItem[];
  onStatusChange: (item: CoachingItem, status: CoachingStatus) => void;
  onRemove: (item: CoachingItem) => void;
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
          items.map((item) => (
            <CoachingCard
              key={item.id}
              item={item}
              onStatusChange={onStatusChange}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </section>
  );
}

function CoachingCard({
  item,
  onStatusChange,
  onRemove,
}: {
  item: CoachingItem;
  onStatusChange: (item: CoachingItem, status: CoachingStatus) => void;
  onRemove: (item: CoachingItem) => void;
}) {
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
      <StatusSelect
        label="Move this request"
        value={item.status}
        options={coachingStatusOrder}
        labels={coachingStatusLabels}
        onChange={(status) => onStatusChange(item, status)}
      />
      {!item.example ? (
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          onClick={() => onRemove(item)}
        >
          Remove saved request
        </button>
      ) : null}
    </article>
  );
}

export function CoachingBoard({ hideExamples }: { hideExamples: boolean }) {
  const { intakes, loading, error } = useIntakes();
  const exampleStatus = useSyncExternalStore(
    subscribeExampleStatus,
    readExampleStatus,
    emptyExampleStatus
  );

  const savedIntakes = intakes.filter(
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

  async function onStatusChange(item: CoachingItem, status: CoachingStatus) {
    if (item.example) {
      setExampleStatus(item.id, status);
      return;
    }
    await changeIntakeStatus(item.id, status);
  }

  return (
    <div className="space-y-6">
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
            onClick={() => void refreshIntakes()}
          >
            Reload
          </button>
          {savedIntakes.length > 0 ? (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              onClick={() => void removeSavedLane("coaching")}
            >
              Remove my saved requests
            </button>
          ) : null}
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            onClick={() => clearExampleStatus()}
          >
            Reset example statuses
          </button>
        </div>
      </div>

      {error ? (
        <div className="space-y-3 border border-destructive/30 px-4 py-4" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            className={cn(buttonVariants({ size: "lg" }))}
            onClick={() => void refreshIntakes()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground" role="status">
          Loading saved coaching requests…
        </p>
      ) : null}

      {!loading && items.length === 0 ? (
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
      ) : !loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {coachingStatusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              items={grouped(status)}
              onStatusChange={onStatusChange}
              onRemove={(item) => void removeSavedIntake(item.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
