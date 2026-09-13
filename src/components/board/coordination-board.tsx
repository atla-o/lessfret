"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SavedStatusForm } from "@/components/saved-status-form";
import { StatusSelect } from "@/components/status-select";
import { cn } from "@/lib/utils";
import { formatSubmittedAt } from "@/lib/format";
import {
  exampleBoardItems,
  kindLabels,
  statusLabels,
  statusOrder,
  type BoardItem,
  type BoardStatus,
} from "@/lib/board-data";
import {
  clearExampleStatus,
  emptyExampleStatus,
  readExampleStatus,
  setExampleStatus,
  subscribeExampleStatus,
} from "@/lib/example-status";
import { needLabels, pathwayLabels } from "@/lib/intake";
import type { PersistedCoordination, PersistedIntake } from "@/lib/records";

function itemFromIntake(intake: PersistedCoordination): BoardItem {
  const need = intake.needs[0] ?? "scheduling";
  return {
    id: intake.id,
    title: `${intake.name} · ${pathwayLabels[intake.pathway || "other"]}`,
    detail: `${intake.situation}${
      intake.providers ? ` Providers noted: ${intake.providers}.` : ""
    } Needs: ${intake.needs.map((item) => needLabels[item]).join("; ")}.`,
    status: intake.status,
    kind: need,
    pathway: intake.pathway || "other",
    example: false,
    session: false,
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
          <Badge className="font-normal">Saved</Badge>
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
      {item.example ? (
        <StatusSelect
          label="Move this item"
          value={item.status}
          options={statusOrder}
          labels={statusLabels}
          onChange={(status) => setExampleStatus(item.id, status)}
        />
      ) : (
        <SavedStatusForm
          id={item.id}
          lane="coordination"
          status={item.status}
          options={statusOrder}
          labels={statusLabels}
        />
      )}
    </article>
  );
}

export function CoordinationBoard({
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
    (item): item is PersistedCoordination => item.lane === "coordination"
  );

  const items = useMemo(() => {
    const saved = savedIntakes.map(itemFromIntake);
    const examples = hideExamples
      ? []
      : exampleBoardItems.map((item) => ({
          ...item,
          status: (exampleStatus[item.id] as BoardStatus) ?? item.status,
        }));
    return [...saved, ...examples];
  }, [exampleStatus, hideExamples, savedIntakes]);

  function grouped(status: BoardStatus) {
    return items.filter((item) => item.status === status);
  }

  return (
    <div className="space-y-6">
      {justSaved ? (
        <p className="border border-foreground/12 px-4 py-3 text-sm" role="status">
          Coordination request saved to GCP project devo-holding. Refresh keeps
          it here.
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
            href={hideExamples ? "/board" : "/board?examples=hidden"}
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
          <p className="font-heading text-2xl">No coordination items yet.</p>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Example cards are hidden, and no saved request came back from
            Lessfret. Submit one to put a live card on this board.
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

      {savedIntakes.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          {savedIntakes.length === 1
            ? "1 saved request."
            : `${savedIntakes.length} saved requests.`}{" "}
          Latest {formatSubmittedAt(savedIntakes[0]?.submittedAt)}.
        </p>
      ) : null}
    </div>
  );
}
