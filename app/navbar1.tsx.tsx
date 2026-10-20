import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <Link href="/" className="text-lg font-bold text-gray-900">
        Helpdesk
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/login" className="text-gray-600 hover:text-gray-900">
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}