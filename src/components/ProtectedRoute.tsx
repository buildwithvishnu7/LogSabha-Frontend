import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

// Gate for logged-in-only pages. Uses token presence (user object may still be
// loading from /me). The API is the real guard — this is just UX.
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
