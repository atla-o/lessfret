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
import { formatSubmittedAt } from "@/lib/format";
import { coachingFocusLabels, type StoredIntake } from "@/lib/intake";
import {
  clearIntakes,
  clearStatusOverrides,
  getServerSession,
  readSession,
  removeIntake,
  setCoachingStatus,
  subscribeSession,
} from "@/lib/session";

function itemFromIntake(intake: StoredIntake): CoachingItem | null {
  if (intake.lane !== "coaching") return null;
  const focus = intake.focus || "other";
  return {
    id: intake.id,
    title: `${intake.name} · ${coachingFocusLabels[focus]}`,
    detail: intake.conversation,
    focus,
    status: "requested",
    example: false,
    session: true,
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
  onStatusChange: (id: string, status: CoachingStatus) => void;
  onRemove: (id: string) => void;
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
  onStatusChange: (id: string, status: CoachingStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="space-y-3 border border-foreground/10 px-3 py-3">
      <div className="flex flex-wrap gap-1.5">
        {item.example ? (
          <Badge variant="outline" className="font-normal">
            Example
          </Badge>
        ) : (
          <Badge className="font-normal">This session</Badge>
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
        onChange={(status) => onStatusChange(item.id, status)}
      />
      {item.session ? (
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          onClick={() => onRemove(item.id)}
        >
          Remove from this session
        </button>
      ) : null}
    </article>
  );
}

export function CoachingBoard({ hideExamples }: { hideExamples: boolean }) {
  const session = useSyncExternalStore(
    subscribeSession,
    readSession,
    getServerSession
  );

  const items = useMemo(() => {
    const sessionItems = session.intakes
      .map(itemFromIntake)
      .filter((item): item is CoachingItem => item !== null)
      .map((item) => ({
        ...item,
        status: session.coachingStatus[item.id] ?? item.status,
      }));
    const examples = hideExamples
      ? []
      : exampleCoachingItems.map((item) => ({
          ...item,
          status: session.coachingStatus[item.id] ?? item.status,
        }));
    return [...sessionItems, ...examples];
  }, [hideExamples, session]);

  function grouped(status: CoachingStatus) {
    return items.filter((item) => item.status === status);
  }

  const sessionCount = session.intakes.filter(
    (item) => item.lane === "coaching"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border border-foreground/10 bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          Cards marked <span className="text-foreground">Example</span> are
          placeholder notes. They are not real people or outcomes. Move any
          card to track a coaching request in this browser.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={hideExamples ? "/coaching" : "/coaching?examples=hidden"}
            aria-pressed={hideExamples}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {hideExamples ? "Show examples" : "Hide examples"}
          </Link>
          {sessionCount > 0 ? (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              onClick={() => clearIntakes("coaching")}
            >
              Clear session requests
            </button>
          ) : null}
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            onClick={() => clearStatusOverrides("coaching")}
          >
            Reset statuses
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="space-y-4 border border-dashed border-foreground/20 px-6 py-12 text-center">
          <p className="font-heading text-2xl">No coaching requests yet.</p>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Example cards are hidden, and this browser session has no coaching
            intake. Submit one to see a live card, or show the examples again.
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
            <Column
              key={status}
              status={status}
              items={grouped(status)}
              onStatusChange={setCoachingStatus}
              onRemove={removeIntake}
            />
          ))}
        </div>
      )}
    </div>
  );
}
