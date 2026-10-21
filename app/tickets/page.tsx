"use client";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTickets } from "@/hooks/useTickets";
import { PRIORITY_LABELS, STATUSES, STATUS_LABELS } from "@/types/ticket";

export default function TicketsPage() {
  const { allowed } = useRequireAuth();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const { tickets, totalPages, loading, error, reload } = useTickets({
    status,
    page,
    enabled: allowed,
  });

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
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-medium text-gray-900">{ticket.title}</h2>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ticket.description}</p>
              <p className="mt-2 text-xs text-gray-400">
                {PRIORITY_LABELS[ticket.priority]} priority ·{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
