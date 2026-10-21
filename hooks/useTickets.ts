"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Ticket, TicketPage } from "@/types/ticket";

type Params = { status: string; page: number; enabled: boolean };
type Result = { key: string; data?: TicketPage; error?: string };

// Loads one page of tickets. `loading` is derived: it is true until a result
// exists for the current filter, page and reload counter.
export function useTickets({ status, page, enabled }: Params) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const key = `${status}|${page}|${reloadCount}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const query = new URLSearchParams({ page: String(page), size: "10" });
    if (status) query.set("status", status);

    api<TicketPage>(`/tickets?${query}`)
      .then((data) => {
        if (!cancelled) setResult({ key, data });
      })
      .catch((error: Error) => {
        if (!cancelled) setResult({ key, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [key, status, page, enabled]);

  const current = result?.key === key ? result : null;

  return {
    tickets: (current?.data?.content ?? []) as Ticket[],
    totalPages: current?.data?.page.totalPages ?? 0,
    loading: enabled && current === null,
    error: current?.error ?? "",
    reload: () => setReloadCount((n) => n + 1),
  };
}
