"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const primary =
  "rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700";
const secondary =
  "rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-100";

// The home page buttons depend on whether someone is logged in.
export default function HomeActions() {
  const { user, loading } = useAuth();

  // Reserve the space while we find out, so the page doesn't jump
  if (loading) return <div className="mt-8 h-12" aria-hidden="true" />;

  if (user) {
    return (
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/tickets/new" className={primary}>
          Raise a ticket
        </Link>
        <Link href="/tickets" className={secondary}>
          My tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href="/register" className={primary}>
        Create account
      </Link>
      <Link href="/login" className={secondary}>
        Log in
      </Link>
    </div>
  );
}
