"use client";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTickets } from "@/hooks/useTickets";
import { api } from "@/services/api";
import { PRIORITY_LABELS, STATUSES, STATUS_LABELS, isFinalStatus } from "@/types/ticket";

export default function MyTickets() {
  const { allowed } = useRequireAuth();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [actionError, setActionError] = useState("");
  const { tickets, totalPages, loading, error, reload } = useTickets({
    status,
    page,
    enabled: allowed,
  });

  async function withdrawTicket(id: number, title: string) {
    if (!window.confirm(`Withdraw "${title}"? A withdrawn ticket can't be reopened.`)) return;
    setActionError("");
    try {
      await api(`/tickets/${id}/withdraw`, { method: "POST" });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Couldn't withdraw the ticket.");
    }
    reload();
  }

  if (!allowed) {
    return <p className="p-8 text-center text-gray-500">Loading...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My tickets</h1>
        <Link
          href="/tickets/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + New ticket
        </Link>
      </div>

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
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="font-medium text-gray-900">
              {status ? "No tickets with this status" : "Start your first ticket"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {status
                ? "Try another status."
                : "Raise a ticket and we'll track it until it's resolved."}
            </p>
            {!status && (
              <Link
                href="/tickets/new"
                className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Raise a ticket
              </Link>
            )}
          </div>
        )}

        <ul className="space-y-3">
          {tickets.map((ticket) => {
            // Every ticket in this list belongs to the logged-in user
            const canEdit = !isFinalStatus(ticket.status);
            const canWithdraw = ticket.status === "OPEN";

            return (
              <li key={ticket.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-medium text-gray-900">{ticket.title}</h2>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ticket.description}</p>
                {ticket.status === "CLOSED" && ticket.resolutionNote && (
                  <p className="mt-2 rounded-lg bg-green-50 p-2 text-sm text-green-800">
                    <span className="font-medium">Resolution:</span> {ticket.resolutionNote}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  {PRIORITY_LABELS[ticket.priority]} priority ·{" "}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
                {(canEdit || canWithdraw) && (
                  <div className="mt-3 flex gap-4 text-sm">
                    {canEdit && (
                      <Link
                        href={`/tickets/${ticket.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                    {canWithdraw && (
                      <button
                        onClick={() => withdrawTicket(ticket.id, ticket.title)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
