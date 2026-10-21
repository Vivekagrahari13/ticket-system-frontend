import Link from "next/link";
export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <form className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <div className="mt-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
          <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-gray-900 py-2 font-medium text-white hover:bg-gray-700"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
