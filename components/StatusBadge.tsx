import { STATUS_LABELS, type TicketStatus } from "@/types/ticket";

const STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CLOSED: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
