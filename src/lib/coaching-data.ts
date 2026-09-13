import type { CoachingFocus } from "@/lib/intake";

export type CoachingStatus = "requested" | "conversation-set" | "closed";

export const coachingStatusOrder: CoachingStatus[] = [
  "requested",
  "conversation-set",
  "closed",
];

export const coachingStatusLabels: Record<CoachingStatus, string> = {
  requested: "Requested",
  "conversation-set": "Conversation set",
  closed: "Closed",
};

export type CoachingItem = {
  id: string;
  title: string;
  detail: string;
  focus: CoachingFocus;
  status: CoachingStatus;
  example: boolean;
  session?: boolean;
  submittedAt?: string;
};

export const exampleCoachingItems: CoachingItem[] = [
  {
    id: "ex-work",
    title: "Work decision and evenings",
    detail:
      "Example: talk through a job choice and how to protect evenings. Coaching only — not a workplace evaluation.",
    focus: "work",
    status: "conversation-set",
    example: true,
  },
  {
    id: "ex-habits",
    title: "Travel-proof morning routine",
    detail:
      "Example: build a short morning routine that survives messy weeks. Guidance and follow-through, not a clinical plan.",
    focus: "habits",
    status: "requested",
    example: true,
  },
  {
    id: "ex-fertility-adjacent",
    title: "Logistics stress around a clinic calendar",
    detail:
      "Example: the life load of waiting on appointments. Coaching for the stress; coordination handles the calendar.",
    focus: "fertility-adjacent",
    status: "closed",
    example: true,
  },
];
