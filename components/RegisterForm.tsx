"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/services/api";
import AuthCard from "@/components/AuthCard";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterForm() {
  const router = useRouter();
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
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/login");
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
      title="Create your account"
      subtitle="Register to raise and track support tickets"
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
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
            autoComplete="new-password"
          />
          {fieldErrors.password ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
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
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
