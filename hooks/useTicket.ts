"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Ticket } from "@/types/ticket";

type Result = { id: string; ticket?: Ticket; error?: string };

// Loads one ticket. `loading` is derived: true until a result exists for the current id.
export function useTicket(id: string, enabled: boolean) {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    api<Ticket>(`/tickets/${id}`)
      .then((ticket) => {
        if (!cancelled) setResult({ id, ticket });
      })
      .catch((error: Error) => {
        if (!cancelled) setResult({ id, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [id, enabled]);

  const current = result?.id === id ? result : null;

  return {
    ticket: current?.ticket ?? null,
    loading: enabled && current === null,
    error: current?.error ?? "",
  };
}
