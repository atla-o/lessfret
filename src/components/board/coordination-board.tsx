"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  exampleBoardItems,
  kindLabels,
  statusLabels,
  statusOrder,
  type BoardItem,
  type BoardStatus,
} from "@/lib/board-data";
import {
  clearIntake,
  needLabels,
  pathwayLabels,
  readIntake,
  subscribeIntake,
  type StoredIntake,
} from "@/lib/intake";

function itemFromIntake(intake: StoredIntake): BoardItem | null {
  if (intake.lane !== "coordination") return null;
  const need = intake.needs[0] ?? "scheduling";
  return {
    id: `session-${intake.submittedAt}`,
    title: `Your request · ${pathwayLabels[intake.pathway || "other"]}`,
    detail: `${intake.situation}${
      intake.providers ? ` Providers noted: ${intake.providers}.` : ""
    } Needs: ${intake.needs.map((item) => needLabels[item]).join("; ")}.`,
    status: "requested",
    kind: need,
    pathway: intake.pathway || "other",
    example: false,
    session: true,
  };
}

function Column({
  status,
  items,
}: {
  status: BoardStatus;
  items: BoardItem[];
}) {
  return (
    <section className="flex min-w-[16.5rem] flex-1 flex-col border border-foreground/10 bg-background">
      <header className="flex items-center justify-between gap-2 border-b border-foreground/10 px-3 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em]">
          {statusLabels[status]}
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
          items.map((item) => <BoardCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}

function BoardCard({ item }: { item: BoardItem }) {
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
          {kindLabels[item.kind]}
        </Badge>
        <Badge variant="secondary" className="font-normal">
          {pathwayLabels[item.pathway]}
        </Badge>
      </div>
      <h3 className="text-sm font-medium leading-5">{item.title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
    </article>
  );
}

export function CoordinationBoard({ hideExamples }: { hideExamples: boolean }) {
  const intake = useSyncExternalStore(subscribeIntake, readIntake, () => null);

  const items = useMemo(() => {
    const sessionItem = intake ? itemFromIntake(intake) : null;
    const examples = hideExamples ? [] : exampleBoardItems;
    return sessionItem ? [sessionItem, ...examples] : examples;
  }, [hideExamples, intake]);

  function grouped(status: BoardStatus) {
    return items.filter((item) => item.status === status);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border border-foreground/10 bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          Cards marked <span className="text-foreground">Example</span> are
          placeholder data. They are not real people, visits, or outcomes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={hideExamples ? "/board" : "/board?examples=hidden"}
            aria-pressed={hideExamples}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {hideExamples ? "Show examples" : "Hide examples"}
          </Link>
          {intake?.lane === "coordination" ? (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              onClick={() => {
                clearIntake();
              }}
            >
              Clear session request
            </button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="space-y-4 border border-dashed border-foreground/20 px-6 py-12 text-center">
          <p className="font-heading text-2xl">No coordination items yet.</p>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Example cards are hidden, and this browser session has no
            coordination intake. Submit one to see a live stub card, or show the
            examples again.
          </p>
          <Link
            href="/intake/coordination"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Start a coordination intake
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {statusOrder.map((status) => (
            <Column key={status} status={status} items={grouped(status)} />
          ))}
        </div>
      )}
    </div>
  );
}
