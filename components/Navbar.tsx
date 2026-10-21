"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <Link href="/" className="text-lg font-bold text-gray-900">
        Helpdesk
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {loading ? null : user ? (
          <>
            <Link href="/tickets" className="text-gray-600 hover:text-gray-900">
              My tickets
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin/tickets" className="text-gray-600 hover:text-gray-900">
                All tickets
              </Link>
            )}
            <span className="hidden text-gray-400 sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
