import { useAuthStore } from "@/stores/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const AUTH = `${API_URL}/api/v1/auth`;

// Extract the server's real message (NestJS sends string | string[]).
function messageFrom(data: any, fallback: string): string {
  const m = data?.message;
  if (Array.isArray(m)) return m.join(". ");
  if (typeof m === "string" && m.trim()) return m;
  return fallback;
}

async function post(path: string, body: unknown) {
  let res: Response;
  try {
    res = await fetch(`${AUTH}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach the server. Please try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(messageFrom(data, "Something went wrong."));
  return data;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
}) {
  const data = await post("/register", input);
  useAuthStore.getState().setSession(data);
  return data;
}

export async function loginUser(input: { email: string; password: string }) {
  const data = await post("/login", input);
  useAuthStore.getState().setSession(data);
  return data;
}

export async function logoutUser() {
  const { accessToken, clear } = useAuthStore.getState();
  try {
    await fetch(`${AUTH}/logout`, {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  } catch {
    /* best effort — clear locally regardless */
  }
  clear();
}

// Validate the persisted session on app load: fetch /me, refreshing once on 401.
export async function fetchMe(): Promise<void> {
  const { accessToken, refreshToken, setUser, setTokens, clear } =
    useAuthStore.getState();
  if (!accessToken) return;

  const call = (token: string) =>
    fetch(`${AUTH}/me`, { headers: { Authorization: `Bearer ${token}` } });

  let res = await call(accessToken).catch(() => null);

  if (res && res.status === 401 && refreshToken) {
    const r = await fetch(`${AUTH}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => null);
    if (r && r.ok) {
      const d = await r.json();
      setTokens(d.accessToken, d.refreshToken);
      res = await call(d.accessToken).catch(() => null);
    }
  }

  if (!res || !res.ok) {
    clear();
    return;
  }
  setUser(await res.json());
}
