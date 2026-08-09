import Link from "next/link";

// Shared shell for the login / signup screens.
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-28 pb-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <Link href="/" className="mb-6 flex justify-center">
          <img
            src="/logo/mainlogofinal.gif"
            alt="LogSabha"
            className="h-14 w-auto"
          />
        </Link>
        <h1 className="text-center text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-gray-500">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
      />
    </label>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
