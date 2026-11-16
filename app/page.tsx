import HomeActions from "@/components/HomeActions";

const STEPS = [
  { title: "Raise a ticket", text: "Describe the problem and choose how urgent it is." },
  { title: "We pick it up", text: "An admin starts work, and you can follow the status." },
  { title: "Get it resolved", text: "When it is closed, you see what was done." },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-16 text-center">
      <span className="rounded-full bg-gray-900/5 px-3 py-1 text-xs font-medium text-gray-600">
        Support made simple
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Get help, fast
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        Raise a ticket and track it until it&apos;s resolved.
      </p>

      <HomeActions />

      <ol className="mt-16 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <h2 className="mt-3 font-medium text-gray-900">{step.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
