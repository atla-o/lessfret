"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatSubmittedAt } from "@/lib/format";
import { coachingFocusLabels, pathwayLabels } from "@/lib/intake";
import {
  getServerSession,
  readSession,
  subscribeSession,
} from "@/lib/session";

export function IntakeSessionPanel() {
  const session = useSyncExternalStore(
    subscribeSession,
    readSession,
    getServerSession
  );

  if (session.intakes.length === 0) return null;

  return (
    <section className="space-y-4 border border-foreground/12 p-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          This session
        </p>
        <h2 className="mt-2 text-sm font-medium">Requests saved in this browser</h2>
      </div>
      <ul className="space-y-3">
        {session.intakes.map((intake) => {
          const href = intake.lane === "coaching" ? "/coaching" : "/board";
          const label =
            intake.lane === "coaching"
              ? coachingFocusLabels[intake.focus || "other"]
              : pathwayLabels[intake.pathway || "other"];
          return (
            <li
              key={intake.id}
              className="flex flex-col gap-2 border-t border-foreground/10 pt-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm">
                  {intake.lane === "coaching" ? "Coaching" : "Coordination"} ·{" "}
                  {label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {intake.name} · {formatSubmittedAt(intake.submittedAt)}
                </p>
              </div>
              <Link
                href={href}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                {intake.lane === "coaching" ? "View coaching" : "View board"}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
