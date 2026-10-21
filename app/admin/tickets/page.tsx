"use client";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTickets } from "@/hooks/useTickets";
import { api } from "@/services/api";
import { PRIORITY_LABELS, STATUSES, STATUS_LABELS, type TicketStatus } from "@/types/ticket";

export default function AdminTicketsPage() {
  const { allowed } = useRequireAuth(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [actionError, setActionError] = useState("");
  const { tickets, totalPages, loading, error, reload } = useTickets({
    status,
    page,
    enabled: allowed,
  });

  async function changeStatus(id: number, newStatus: TicketStatus) {
    setActionError("");
    try {
      await api(`/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Couldn't update the status.");
    }
  }

  async function deleteTicket(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setActionError("");
    try {
      await api(`/tickets/${id}`, { method: "DELETE" });
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Couldn't delete the ticket.");
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{ticket.title}</td>
                    <td className="px-4 py-3 text-gray-600">{ticket.owner.email}</td>
                    <td className="px-4 py-3 text-gray-600">{PRIORITY_LABELS[ticket.priority]}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Status of ${ticket.title}`}
                        value={ticket.status}
                        onChange={(e) => changeStatus(ticket.id, e.target.value as TicketStatus)}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteTicket(ticket.id, ticket.title)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
