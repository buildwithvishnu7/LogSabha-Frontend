"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logoutUser } from "@/services/auth";

// Gated page: client-side redirect when no session. (The API is the real
// guard — this is UX. Was ProtectedRoute + Account in the Vite app.)
export default function Account() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  // Zustand persist hydrates after mount — gate all auth-dependent UI on
  // `mounted` so the server HTML and first client render match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !accessToken) router.replace("/login");
  }, [mounted, accessToken, router]);

  const onLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (!mounted || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-28 pb-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-white">
            {(user?.name?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          🎉 You're signed in. This page is protected — visiting{" "}
          <code>/account</code> without a session redirects to login.
        </div>

        <button
          onClick={onLogout}
          className="mt-6 w-full rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
