import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Get help, fast</h1>

      <p className="mt-8 max-w-md text-gray-600">
        Raise a ticket and track it until it's resolved.
      </p>

      <Link
        href="/tickets/new"
        className="mt-8 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
      >
        Raise a ticket
      </Link>

      <p className="mt-4 text-sm text-gray-500">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}