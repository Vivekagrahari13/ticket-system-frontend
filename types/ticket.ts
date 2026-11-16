export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "WITHDRAWN";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;
  resolutionNote: string | null;
  closedAt: string | null;
  withdrawnAt: string | null;
  owner: { id: number; email: string; role: "USER" | "ADMIN" };
};

export type TicketPage = {
  content: Ticket[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
  WITHDRAWN: "Withdrawn",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const STATUSES = Object.keys(STATUS_LABELS) as TicketStatus[];
export const PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];

// Mirrors the backend rules. The server enforces them, this only hides invalid options.
const ADMIN_NEXT: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["CLOSED"],
  CLOSED: [],
  WITHDRAWN: [],
};

// Statuses an admin may move a ticket to. Withdrawing belongs to the owner.
export function nextStatuses(current: TicketStatus): TicketStatus[] {
  return ADMIN_NEXT[current];
}

// CLOSED and WITHDRAWN are final: no edits and no further moves.
export function isFinalStatus(status: TicketStatus): boolean {
  return status === "CLOSED" || status === "WITHDRAWN";
}
