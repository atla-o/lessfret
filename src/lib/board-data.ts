import type { CoordinationPathway } from "@/lib/intake";

export type BoardStatus =
  | "requested"
  | "coordinating"
  | "waiting"
  | "scheduled"
  | "closed";

export type BoardKind = "referral" | "scheduling" | "records" | "prep" | "follow-up";

export type BoardItem = {
  id: string;
  title: string;
  detail: string;
  status: BoardStatus;
  kind: BoardKind;
  pathway: CoordinationPathway;
  example: boolean;
  session?: boolean;
};

export const statusOrder: BoardStatus[] = [
  "requested",
  "coordinating",
  "waiting",
  "scheduled",
  "closed",
];

export const statusLabels: Record<BoardStatus, string> = {
  requested: "Requested",
  coordinating: "Coordinating",
  waiting: "Waiting on provider",
  scheduled: "Scheduled",
  closed: "Closed",
};

export const kindLabels: Record<BoardKind, string> = {
  referral: "Referral",
  scheduling: "Scheduling",
  records: "Records",
  prep: "Visit prep",
  "follow-up": "Follow-up",
};

export const exampleBoardItems: BoardItem[] = [
  {
    id: "ex-fertility-consult",
    title: "First fertility-clinic consult",
    detail:
      "Example: help the person schedule a first visit with a licensed clinic they already named. Lessfret does not provide fertility treatment or interpret results.",
    status: "coordinating",
    kind: "scheduling",
    pathway: "fertility",
    example: true,
  },
  {
    id: "ex-fertility-records",
    title: "Prior cycle records request",
    detail:
      "Example: request existing records from a prior clinic so the person can bring them to a consult they arrange.",
    status: "waiting",
    kind: "records",
    pathway: "fertility",
    example: true,
  },
  {
    id: "ex-imaging",
    title: "Diagnostic imaging logistics",
    detail:
      "Example: confirm hours, prep instructions published by the facility, and a time that fits the person’s calendar. No clinical ordering from Lessfret.",
    status: "scheduled",
    kind: "scheduling",
    pathway: "diagnostics",
    example: true,
  },
  {
    id: "ex-lab",
    title: "Lab draw appointment",
    detail:
      "Example: locate a draw site the person’s clinician already ordered work for, and note fasting windows the lab publishes.",
    status: "requested",
    kind: "scheduling",
    pathway: "diagnostics",
    example: true,
  },
  {
    id: "ex-pcp",
    title: "Primary-care follow-up",
    detail:
      "Example: book a routine follow-up the person already discussed with their own clinician. Coordination only.",
    status: "requested",
    kind: "follow-up",
    pathway: "general",
    example: true,
  },
  {
    id: "ex-questions",
    title: "Visit question list",
    detail:
      "Example: draft a short list of logistical and preference questions for the person to take to their licensed provider. Not medical advice.",
    status: "closed",
    kind: "prep",
    pathway: "general",
    example: true,
  },
];
