import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { logoutUser } from "@/services/auth";

// The gated example: only reachable when logged in (see ProtectedRoute).
export default function Account() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const onLogout = async () => {
    await logoutUser();
    navigate("/");
  };

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
          🎉 You're signed in. This page is protected — visiting <code>/account</code>{" "}
          without a session redirects to login.
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
