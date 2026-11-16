type Props = {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
};

// The shared frame for the login and register screens.
export default function AuthCard({ title, subtitle, footer, children }: Props) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900"
            aria-hidden="true"
          >
            <svg viewBox="0 0 32 32" className="h-7 w-7">
              <path
                d="M7 10h18a1 1 0 0 1 1 1v3a2.5 2.5 0 0 0 0 5v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a2.5 2.5 0 0 0 0-5v-3a1 1 0 0 1 1-1z"
                fill="#ffffff"
              />
              <path
                d="M12 16.5l3 3 5.5-6"
                fill="none"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-gray-500">{footer}</p>
      </div>
    </main>
  );
}
