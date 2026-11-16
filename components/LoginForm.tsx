"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/services/api";
import AuthCard from "@/components/AuthCard";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import { useAuth, type User } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setPending(true);

    try {
      const user = await api<User>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(user);
      router.push(user.role === "ADMIN" ? "/admin/tickets" : "/tickets");
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors ?? {});
        if (!error.fieldErrors) setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to raise and track your tickets"
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <EmailInput
            id="email"
            value={email}
            onChange={setEmail}
            placeholder="name@company.com"
            autoComplete="email"
          />
          {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        {formError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-700 active:scale-[0.99] disabled:opacity-60"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
