import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SiteUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: SiteUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (s: {
    accessToken: string;
    refreshToken: string;
    user: SiteUser;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: SiteUser | null) => void;
  clear: () => void;
}

// The website visitor's session — client state, persisted so a refresh keeps
// them logged in. Separate from the admin's store (different app, different
// user base). Server data still lives in React Query, not here.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clear: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "logsabha_user_auth" },
  ),
);
