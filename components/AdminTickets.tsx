"use client";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTickets } from "@/hooks/useTickets";
import { api } from "@/services/api";
import {
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  isFinalStatus,
  nextStatuses,
  type TicketStatus,
} from "@/types/ticket";

type ClosingTicket = { id: number; title: string };

export default function AdminTickets() {
  const { allowed } = useRequireAuth(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [actionError, setActionError] = useState("");
  const [closing, setClosing] = useState<ClosingTicket | null>(null);
  const [note, setNote] = useState("");
  const [closeError, setCloseError] = useState("");
  const [pending, setPending] = useState(false);
  const { tickets, totalPages, loading, error, reload } = useTickets({
    status,
    page,
    enabled: allowed,
    scope: "all",
  });

  // Returns an error message, or an empty string on success.
  async function sendStatus(id: number, newStatus: TicketStatus, resolutionNote?: string) {
    try {
      await api(`/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, resolutionNote }),
      });
      return "";
    } catch (e) {
      return e instanceof Error ? e.message : "Couldn't update the status.";
    } finally {
      reload();
    }
  }

  async function startWork(id: number) {
    setActionError(await sendStatus(id, "IN_PROGRESS"));
  }

  function openCloseDialog(ticket: ClosingTicket) {
    setClosing(ticket);
    setNote("");
    setCloseError("");
  }

  async function submitClose(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!closing) return;
    if (!note.trim()) {
      setCloseError("Enter a resolution note.");
      return;
    }
    setPending(true);
    const message = await sendStatus(closing.id, "CLOSED", note);
    setPending(false);
    if (message) {
      setCloseError(message);
    } else {
      setClosing(null);
    }
  }

  function handleSelect(ticket: ClosingTicket, next: TicketStatus) {
    setActionError("");
    if (next === "CLOSED") {
      openCloseDialog(ticket);
    } else if (next === "IN_PROGRESS") {
      void startWork(ticket.id);
    }
  }

  if (!allowed) {
    return <p className="p-8 text-center text-gray-500">Loading...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">All tickets</h1>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <label htmlFor="status" className="text-gray-600">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {actionError && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      <div className="mt-4">
        {loading && <p className="py-8 text-center text-gray-500">Loading tickets...</p>}

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}{" "}
            <button onClick={reload} className="font-medium underline">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No tickets found.
          </p>
        )}

        {tickets.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const options = nextStatuses(ticket.status);
                  return (
                    <tr key={ticket.id} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{ticket.title}</p>
                        {ticket.status === "CLOSED" && ticket.resolutionNote && (
                          <p className="mt-1 text-xs text-gray-500">Resolution: {ticket.resolutionNote}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ticket.owner.email}</td>
                      <td className="px-4 py-3 text-gray-600">{PRIORITY_LABELS[ticket.priority]}</td>
                      <td className="px-4 py-3">
                        {options.length === 0 ? (
                          <StatusBadge status={ticket.status} />
                        ) : (
                          <select
                            aria-label={`Status of ${ticket.title}`}
                            value={ticket.status}
                            onChange={(e) =>
                              handleSelect(
                                { id: ticket.id, title: ticket.title },
                                e.target.value as TicketStatus,
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-2 py-1"
                          >
                            <option value={ticket.status}>{STATUS_LABELS[ticket.status]}</option>
                            {options.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isFinalStatus(ticket.status) && (
                          <Link
                            href={`/tickets/${ticket.id}/edit`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {closing && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={submitClose}
            noValidate
            role="dialog"
            aria-modal="true"
            aria-labelledby="close-title"
            className="w-full max-w-md rounded-xl bg-white p-6"
          >
            <h2 id="close-title" className="text-lg font-bold text-gray-900">
              Close ticket
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              &quot;{closing.title}&quot; will become read-only. This can&apos;t be undone.
            </p>

            <label htmlFor="resolution" className="mt-4 block text-sm font-medium text-gray-700">
              Resolution note
            </label>
            <textarea
              id="resolution"
              rows={4}
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was done to resolve it?"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
            />
            {closeError && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {closeError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setClosing(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
              >
                {pending ? "Closing..." : "Close ticket"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
