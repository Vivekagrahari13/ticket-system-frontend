"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Redirects logged-out visitors to /login, and non-admins away from admin pages.
// This improves the experience only. The backend is what enforces access.
export function useRequireAuth(adminOnly = false) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (adminOnly && user.role !== "ADMIN") router.replace("/tickets");
  }, [user, loading, adminOnly, router]);

  const allowed = !loading && !!user && (!adminOnly || user.role === "ADMIN");
  return { user, allowed };
}
