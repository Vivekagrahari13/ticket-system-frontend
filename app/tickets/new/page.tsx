"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/services/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { PRIORITIES, PRIORITY_LABELS, type Priority } from "@/types/ticket";

export default function NewTicketPage() {
  const { allowed } = useRequireAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setPending(true);

    try {
      await api("/tickets", {
        method: "POST",
        body: JSON.stringify({ title, description, priority }),
      });
      router.push("/tickets");
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

  if (!allowed) {
    return <p className="p-8 text-center text-gray-500">Loading...</p>;
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">New ticket</h1>

        <div className="mt-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wi-Fi not working"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
          {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened, and what did you expect?"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          {fieldErrors.priority && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.priority}</p>
          )}
        </div>

        {formError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {formError}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-gray-900 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-60"
          >
            {pending ? "Submitting..." : "Submit"}
          </button>
          <Link
            href="/tickets"
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
