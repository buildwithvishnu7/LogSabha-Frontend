"use client";

/* LogSabha — Community Forum data layer.
 *
 * Every method is async and shaped like the REST call it will become, so wiring
 * this to the real backend means replacing the body of `tx()` with fetch() and
 * deleting the persistence block. No UI code changes.
 *
 *   POST  /auth/otp             -> signIn
 *   GET   /threads?cat=&sort=   -> listThreads
 *   GET   /threads/:id          -> getThread
 *   POST  /threads              -> createThread
 *   POST  /threads/:id/replies  -> createComment
 *   POST  /vote                 -> vote
 *   POST  /reports              -> report
 *   GET   /mod/reports          -> listReports
 *   PATCH /mod/reports/:id      -> resolveReport
 *
 * Until then state lives in localStorage so the forum genuinely works across
 * reloads instead of resetting to a fixture on every visit.
 *
 * Ported from reference/new_ref/assets/forum-store.js.
 */

import {
  forumThreads,
  forumComments,
  forumReports,
  forumUsers,
  type Thread,
  type Comment,
  type Report,
  type ForumUser,
} from "@/data/forum";

const KEY = "logsabha.forum.v2";
const LATENCY = 90; // ms — the shape of a network call, so the UI is built to wait

export type Session = { id: string; name: string; handle: string; phone: string } | null;

export type ForumState = {
  threads: Thread[];
  comments: Record<string, Comment[]>;
  reports: Report[];
  /** per-item vote the CURRENT visitor cast: 1, -1, or absent */
  votes: Record<string, 1 | -1>;
  session: Session;
};

function seed(): ForumState {
  return {
    threads: structuredClone(forumThreads),
    comments: structuredClone(forumComments),
    reports: structuredClone(forumReports),
    votes: {},
    session: null,
  };
}

function read(): ForumState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Partial<ForumState>;
    // Merge over a fresh seed: a stored blob written by an older shape must not
    // leave a key undefined and crash the feed.
    return { ...seed(), ...parsed };
  } catch {
    return seed();
  }
}

function write(s: ForumState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Private mode, or the quota is full. The forum keeps working for this
    // session; it just will not survive the reload.
  }
}

/** The seam. Replace this body with fetch() and the rest of the file goes. */
function tx<T>(fn: (s: ForumState) => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const s = read();
      const out = fn(s);
      write(s);
      resolve(out);
    }, LATENCY);
  });
}

/* ── auth ─────────────────────────────────────────────────────────────── */

export function getSession(): Promise<Session> {
  return tx((s) => s.session);
}

/** POST /auth/otp — no real OTP is sent; the code is not checked because there
 *  is nothing to check it against yet. The flow exists so the UI around it is
 *  built and the backend swap is a body change, not a redesign. */
export function signIn(phone: string, name: string): Promise<Session> {
  return tx((s) => {
    const handle = (name.trim().split(/\s+/)[0] || "member").toLowerCase() + "_" + phone.slice(-4);
    s.session = { id: "me", name: name.trim() || "Member", handle, phone };
    return s.session;
  });
}

export function signOut(): Promise<null> {
  return tx((s) => {
    s.session = null;
    return null;
  });
}

/* ── threads ──────────────────────────────────────────────────────────── */

export type Sort = "hot" | "new" | "top";

export function listThreads(cat?: string | null, sort: Sort = "hot"): Promise<Thread[]> {
  return tx((s) => {
    const rows = s.threads.filter((t) => !cat || t.cat === cat);
    const score = (t: Thread) => t.up - t.down;
    const sorted = [...rows].sort((a, b) => {
      if (sort === "new") return a.t - b.t; // t is hours since posting
      if (sort === "top") return score(b) - score(a);
      return (b.hot ?? score(b)) - (a.hot ?? score(a));
    });
    // Pinned threads lead regardless of sort — that is what pinning is for.
    return [...sorted.filter((t) => t.pinned), ...sorted.filter((t) => !t.pinned)];
  });
}

export function getThread(id: string): Promise<{ thread: Thread | null; comments: Comment[] }> {
  return tx((s) => ({
    thread: s.threads.find((t) => t.id === id) ?? null,
    comments: s.comments[id] ?? [],
  }));
}

export function createThread(input: {
  cat: string;
  title: string;
  body: string;
}): Promise<Thread | { error: string }> {
  return tx((s) => {
    if (!s.session) return { error: "Sign in to post." };
    const t: Thread = {
      id: "t" + Date.now().toString(36),
      cat: input.cat,
      by: "me",
      t: 0,
      title: input.title,
      body: input.body,
      up: 1,
      down: 0,
      views: 1,
    };
    s.threads.unshift(t);
    s.comments[t.id] = [];
    return t;
  });
}

export function createComment(
  threadId: string,
  text: string,
  parent: string | null = null,
): Promise<Comment | { error: string }> {
  return tx((s) => {
    if (!s.session) return { error: "Sign in to reply." };
    const c: Comment = {
      id: "c" + Date.now().toString(36),
      by: "me",
      t: 0,
      up: 1,
      down: 0,
      parent,
      text,
    };
    (s.comments[threadId] ??= []).push(c);
    return c;
  });
}

/* ── votes ────────────────────────────────────────────────────────────── */

/** POST /vote. Casting the same vote twice clears it, which is what every forum
 *  does and what a visitor expects from a pressed button. */
export function vote(
  kind: "thread" | "comment",
  id: string,
  dir: 1 | -1,
  threadId?: string,
): Promise<{ up: number; down: number; mine: 1 | -1 | 0 } | { error: string }> {
  return tx((s) => {
    if (!s.session) return { error: "Sign in to vote." };
    const key = kind + ":" + id;
    const prev = s.votes[key];
    const target =
      kind === "thread"
        ? s.threads.find((t) => t.id === id)
        : (s.comments[threadId ?? ""] ?? []).find((c) => c.id === id);
    if (!target) return { error: "Not found." };

    // Undo the previous vote first, so a switch is one step not two.
    if (prev === 1) target.up -= 1;
    if (prev === -1) target.down -= 1;

    let mine: 1 | -1 | 0 = 0;
    if (prev === dir) {
      delete s.votes[key];
    } else {
      s.votes[key] = dir;
      mine = dir;
      if (dir === 1) target.up += 1;
      else target.down += 1;
    }
    return { up: target.up, down: target.down, mine };
  });
}

export function myVotes(): Promise<Record<string, 1 | -1>> {
  return tx((s) => s.votes);
}

/* ── moderation ───────────────────────────────────────────────────────── */

export function report(kind: string, on: string, reason: string): Promise<Report> {
  return tx((s) => {
    const r: Report = {
      id: "r" + Date.now().toString(36),
      kind,
      on,
      reason,
      count: 1,
      age: "just now",
      status: "open",
    };
    s.reports.unshift(r);
    return r;
  });
}

export function listReports(): Promise<Report[]> {
  return tx((s) => s.reports);
}

export function resolveReport(id: string): Promise<Report[]> {
  return tx((s) => {
    const r = s.reports.find((x) => x.id === id);
    if (r) r.status = "resolved";
    return s.reports;
  });
}

/* ── helpers the UI needs ─────────────────────────────────────────────── */

/** Authors are from the demo set; the signed-in visitor is "me" and is not. */
export function authorOf(by: string, session: Session): ForumUser {
  if (by === "me" && session)
    return { name: session.name, handle: session.handle, role: "member", rep: 1, state: "" };
  return forumUsers[by] ?? { name: by, handle: by, role: "member", rep: 0, state: "" };
}

export function ago(hours: number): string {
  if (hours < 1) return Math.max(1, Math.round(hours * 60)) + "m";
  if (hours < 24) return Math.round(hours) + "h";
  return Math.round(hours / 24) + "d";
}

/** Wipe the stored forum and start again from the seed. */
export function resetForum(): Promise<null> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
    setTimeout(() => resolve(null), LATENCY);
  });
}
