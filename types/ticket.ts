export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;
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
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const STATUSES = Object.keys(STATUS_LABELS) as TicketStatus[];
export const PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];
