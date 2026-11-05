import type { Metadata } from "next";

export const metadata: Metadata = { title: "New ticket" };

export default function NewTicketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
