"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronDown, ChevronUp, Flag, MessageSquare, Eye } from "lucide-react";
import {
  forumCategories,
  forumGuidelines,
  forumHashtags,
  type Category,
  type Comment,
  type Thread,
} from "@/data/forum";
import {
  ago,
  authorOf,
  createComment,
  createThread,
  getSession,
  getThread,
  listThreads,
  myVotes,
  report,
  signIn,
  signOut,
  vote,
  type Session,
  type Sort,
} from "@/lib/forum-store";

const EASE = [0.16, 1, 0.3, 1] as const;
const nf = new Intl.NumberFormat("en-IN");

/* The forum proper: feed, thread view, composer, voting and reporting, all on
 * the localStorage store. Everything here calls the store the way it will call
 * the API, so the backend swap does not reach this file. */

export function ForumApp({
  category,
  onCategoryChange,
}: {
  category: string | null;
  onCategoryChange: (id: string | null) => void;
}) {
  const [session, setSession] = useState<Session>(null);
  const [sort, setSort] = useState<Sort>("hot");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [open, setOpen] = useState<{ thread: Thread; comments: Comment[] } | null>(null);
  const [votes, setVotes] = useState<Record<string, 1 | -1>>({});
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshFeed = useCallback(async () => {
    setBusy(true);
    const [rows, v] = await Promise.all([listThreads(category, sort), myVotes()]);
    setThreads(rows);
    setVotes(v);
    setBusy(false);
  }, [category, sort]);

  useEffect(() => {
    getSession().then(setSession);
  }, []);
  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  // A notice is a transient answer to an action ("Sign in to vote"), so it
  // should clear itself rather than sit there until the next click.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  const openThread = async (id: string) => {
    const got = await getThread(id);
    if (got.thread) setOpen({ thread: got.thread, comments: got.comments });
  };

  const castVote = async (kind: "thread" | "comment", id: string, dir: 1 | -1, threadId?: string) => {
    const res = await vote(kind, id, dir, threadId);
    if ("error" in res) return setNotice(res.error);
    setVotes((v) => {
      const next = { ...v };
      const key = kind + ":" + id;
      if (res.mine === 0) delete next[key];
      else next[key] = res.mine;
      return next;
    });
    await refreshFeed();
    if (open && (kind === "thread" ? id === open.thread.id : threadId === open.thread.id)) {
      await openThread(open.thread.id);
    }
  };

  const cat = category ? forumCategories.find((c) => c.id === category) : null;

  return (
    <section id="forum" className="bg-[#f6f9fd] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {open ? (
                <ThreadView
                  key="thread"
                  data={open}
                  session={session}
                  votes={votes}
                  onBack={() => setOpen(null)}
                  onVote={castVote}
                  onReply={async (text, parent) => {
                    const res = await createComment(open.thread.id, text, parent);
                    if ("error" in res) return setNotice(res.error);
                    await openThread(open.thread.id);
                  }}
                  onReport={async (kind, on) => {
                    await report(kind, on, "Reported by a reader");
                    setNotice("Reported. A moderator will look at it.");
                  }}
                />
              ) : (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-[19px] font-extrabold text-[#0a1e3f]">
                        {cat ? cat.name : "All discussions"}
                      </h2>
                      {cat && <p className="mt-0.5 text-[12.5px] text-[#5a7091]">{cat.blurb}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cat && (
                        <button
                          type="button"
                          onClick={() => onCategoryChange(null)}
                          className="rounded-full border border-[#dce4ef] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#5a7091] transition-colors hover:border-[#ff9933]"
                        >
                          Clear topic
                        </button>
                      )}
                      {(["hot", "new", "top"] as Sort[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSort(s)}
                          aria-pressed={sort === s}
                          className={
                            "rounded-full border px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
                            (sort === s
                              ? "border-transparent bg-[#0a1e3f] text-white"
                              : "border-[#dce4ef] bg-white text-[#5a7091] hover:border-[#ff9933]")
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Composer
                    session={session}
                    category={category ?? forumCategories[0].id}
                    onPost={async (input) => {
                      const res = await createThread(input);
                      if ("error" in res) return setNotice(res.error);
                      await refreshFeed();
                      setNotice("Posted.");
                    }}
                    onNeedSignIn={() => setNotice("Sign in to post.")}
                  />

                  <p className="mt-4 text-[12px] text-[#5a7091]" role="status" aria-live="polite">
                    {busy ? "Loading…" : `Showing ${threads.length} of ${threads.length} discussions`}
                  </p>

                  <ul className="mt-2 space-y-2.5">
                    {threads.map((t) => (
                      <ThreadRow
                        key={t.id}
                        thread={t}
                        session={session}
                        mine={votes["thread:" + t.id]}
                        onOpen={() => openThread(t.id)}
                        onVote={(dir) => castVote("thread", t.id, dir)}
                      />
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Sidebar session={session} onSignIn={setSession} onSignOut={() => signOut().then(() => setSession(null))} />
        </div>
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-[#dce4ef] bg-white px-5 py-2.5 text-[12.5px] font-semibold text-[#0a1e3f] shadow-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── feed row ─────────────────────────────────────────────────────────── */

function VoteBox({
  up,
  down,
  mine,
  onVote,
}: {
  up: number;
  down: number;
  mine?: 1 | -1;
  onVote: (dir: 1 | -1) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={() => onVote(1)}
        aria-label="Upvote"
        aria-pressed={mine === 1}
        className={
          "rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
          (mine === 1 ? "bg-[#fff4e6] text-[#e87d12]" : "text-[#94a3b8] hover:text-[#e87d12]")
        }
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <span className="text-[12px] font-bold tabular-nums text-[#0a1e3f]">{nf.format(up - down)}</span>
      <button
        type="button"
        onClick={() => onVote(-1)}
        aria-label="Downvote"
        aria-pressed={mine === -1}
        className={
          "rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12] " +
          (mine === -1 ? "bg-[#eef2f7] text-[#1b6ec2]" : "text-[#94a3b8] hover:text-[#1b6ec2]")
        }
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

function ThreadRow({
  thread,
  session,
  mine,
  onOpen,
  onVote,
}: {
  thread: Thread;
  session: Session;
  mine?: 1 | -1;
  onOpen: () => void;
  onVote: (dir: 1 | -1) => void;
}) {
  const a = authorOf(thread.by, session);
  const cat = forumCategories.find((c) => c.id === thread.cat);
  return (
    <li className="flex gap-3 rounded-xl border border-[#dce4ef] bg-white p-3.5">
      <VoteBox up={thread.up} down={thread.down} mine={mine} onVote={onVote} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px]">
          {thread.pinned && (
            <span className="rounded-full bg-[#fff4e6] px-2 py-0.5 font-bold uppercase tracking-wide text-[#c96608]">
              Pinned
            </span>
          )}
          {cat && (
            <span className="flex items-center gap-1.5 font-semibold text-[#5a7091]">
              <span className="h-2 w-2 rounded-full" style={{ background: cat.c }} />
              {cat.name}
            </span>
          )}
          <span className="text-[#94a3b8]">·</span>
          <span className="text-[#5a7091]">
            {a.name}
            {a.role === "verified" && <span className="ml-1 text-[#1b6ec2]">✓</span>}
          </span>
          <span className="text-[#94a3b8]">· {ago(thread.t)} ago</span>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-1 block text-left text-[15px] font-bold leading-snug text-[#0a1e3f] transition-colors hover:text-[#c96608] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
        >
          {thread.title}
        </button>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#22406e]">{thread.body}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#5a7091]">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {nf.format(thread.replies ?? thread.comments?.length ?? 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {nf.format(thread.views)}
          </span>
          {thread.tags?.map((t) => (
            <span key={t} className="text-[#c96608]">#{t}</span>
          ))}
        </div>
      </div>
    </li>
  );
}

/* ── thread view ──────────────────────────────────────────────────────── */

function ThreadView({
  data,
  session,
  votes,
  onBack,
  onVote,
  onReply,
  onReport,
}: {
  data: { thread: Thread; comments: Comment[] };
  session: Session;
  votes: Record<string, 1 | -1>;
  onBack: () => void;
  onVote: (kind: "thread" | "comment", id: string, dir: 1 | -1, threadId?: string) => void;
  onReply: (text: string, parent: string | null) => void;
  onReport: (kind: string, on: string) => void;
}) {
  const { thread, comments } = data;
  const a = authorOf(thread.by, session);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [text, setText] = useState("");

  // Comments are stored flat with a parent id; nest them once for rendering
  // rather than filtering the whole list at every level.
  const tree = useMemo(() => {
    const byParent = new Map<string | null, Comment[]>();
    comments.forEach((c) => {
      const k = c.parent;
      if (!byParent.has(k)) byParent.set(k, []);
      byParent.get(k)!.push(c);
    });
    return byParent;
  }, [comments]);

  const render = (parent: string | null, depth: number): React.ReactNode =>
    (tree.get(parent) ?? []).map((c) => {
      const ca = authorOf(c.by, session);
      return (
        <li key={c.id} style={{ marginLeft: depth ? 18 : 0 }}>
          <div className={"rounded-lg border border-[#e6eaf2] bg-white p-3 " + (depth ? "border-l-2 border-l-[#ffc27a]" : "")}>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-[#0a1e3f]">{ca.name}</span>
              {ca.role === "verified" && <span className="text-[#1b6ec2]">✓</span>}
              <span className="text-[#94a3b8]">· {ago(c.t)} ago</span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#22406e]">{c.text}</p>
            <div className="mt-2 flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => onVote("comment", c.id, 1, thread.id)}
                aria-pressed={votes["comment:" + c.id] === 1}
                className={votes["comment:" + c.id] === 1 ? "font-bold text-[#e87d12]" : "text-[#5a7091] hover:text-[#e87d12]"}
              >
                ▲ {c.up - c.down}
              </button>
              <button
                type="button"
                onClick={() => onVote("comment", c.id, -1, thread.id)}
                aria-pressed={votes["comment:" + c.id] === -1}
                className={votes["comment:" + c.id] === -1 ? "font-bold text-[#1b6ec2]" : "text-[#5a7091] hover:text-[#1b6ec2]"}
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="text-[#5a7091] hover:text-[#0a1e3f]"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => onReport("Comment", c.text.slice(0, 46))}
                className="flex items-center gap-1 text-[#94a3b8] hover:text-[#e11d48]"
              >
                <Flag className="h-3 w-3" /> Report
              </button>
            </div>

            {replyTo === c.id && (
              <ReplyBox
                session={session}
                value={text}
                onChange={setText}
                onSubmit={() => {
                  onReply(text, c.id);
                  setText("");
                  setReplyTo(null);
                }}
              />
            )}
          </div>
          {tree.has(c.id) && <ul className="mt-2 space-y-2">{render(c.id, depth + 1)}</ul>}
        </li>
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5a7091] transition-colors hover:text-[#0a1e3f]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All discussions
      </button>

      <article className="mt-3 rounded-xl border border-[#dce4ef] bg-white p-5">
        <div className="flex gap-4">
          <VoteBox
            up={thread.up}
            down={thread.down}
            mine={votes["thread:" + thread.id]}
            onVote={(d) => onVote("thread", thread.id, d)}
          />
          <div className="min-w-0">
            <h2 className="text-[20px] font-extrabold leading-snug text-[#0a1e3f]">{thread.title}</h2>
            <p className="mt-1 text-[11.5px] text-[#5a7091]">
              {a.name} · {a.handle} · {ago(thread.t)} ago · {nf.format(thread.views)} views
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#22406e]">{thread.body}</p>
            <button
              type="button"
              onClick={() => onReport("Thread", thread.title)}
              className="mt-3 flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-[#e11d48]"
            >
              <Flag className="h-3 w-3" /> Report this thread
            </button>
          </div>
        </div>
      </article>

      <h3 className="mt-5 text-[13px] font-bold text-[#0a1e3f]">
        {comments.length} {comments.length === 1 ? "reply" : "replies"}
      </h3>

      {replyTo === null && (
        <ReplyBox
          session={session}
          value={text}
          onChange={setText}
          onSubmit={() => {
            onReply(text, null);
            setText("");
          }}
        />
      )}

      <ul className="mt-3 space-y-2.5">{render(null, 0)}</ul>
    </motion.div>
  );
}

function ReplyBox({
  session,
  value,
  onChange,
  onSubmit,
}: {
  session: Session;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-2.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={session ? "Add your reply…" : "Sign in to reply"}
        className="w-full rounded-lg border border-[#dce4ef] bg-white p-2.5 text-[13px] text-[#0a1e3f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#ff9933]"
      />
      {/* "Post reply", not "Reply" — the toggle that opens this box is already
          called Reply, and two controls with the same name in the same thread is
          ambiguous to anyone tabbing through or listening to it. */}
      <button
        type="button"
        disabled={!value.trim()}
        onClick={onSubmit}
        className="mt-1.5 rounded-full bg-[#ff9933] px-4 py-1.5 text-[12px] font-bold text-white transition-opacity disabled:opacity-40"
      >
        Post reply
      </button>
    </div>
  );
}

/* ── composer ─────────────────────────────────────────────────────────── */

function Composer({
  session,
  category,
  onPost,
  onNeedSignIn,
}: {
  session: Session;
  category: string;
  onPost: (input: { cat: string; title: string; body: string }) => void;
  onNeedSignIn: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(category);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => setCat(category), [category]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => (session ? setOpen(true) : onNeedSignIn())}
        className="mt-4 w-full rounded-xl border border-dashed border-[#dce4ef] bg-white p-3.5 text-left text-[13px] text-[#94a3b8] transition-colors hover:border-[#ff9933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87d12]"
      >
        {session ? "Start a discussion…" : "Sign in to start a discussion"}
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-[#dce4ef] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-full border border-[#dce4ef] px-3 py-1.5 text-[12px] text-[#0a1e3f] outline-none focus:border-[#ff9933]"
        >
          {forumCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="A clear title"
        className="mt-2.5 w-full rounded-lg border border-[#dce4ef] px-3 py-2 text-[14px] font-semibold text-[#0a1e3f] outline-none placeholder:text-[#94a3b8] focus:border-[#ff9933]"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Make the claim, and say where it comes from."
        className="mt-2 w-full rounded-lg border border-[#dce4ef] p-2.5 text-[13px] text-[#0a1e3f] outline-none placeholder:text-[#94a3b8] focus:border-[#ff9933]"
      />
      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          disabled={!title.trim() || !body.trim()}
          onClick={() => {
            onPost({ cat, title: title.trim(), body: body.trim() });
            setTitle("");
            setBody("");
            setOpen(false);
          }}
          className="rounded-full bg-[#ff9933] px-5 py-2 text-[12.5px] font-bold text-white transition-opacity disabled:opacity-40"
        >
          Post
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] font-semibold text-[#5a7091] hover:text-[#0a1e3f]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── sidebar ──────────────────────────────────────────────────────────── */

function Sidebar({
  session,
  onSignIn,
  onSignOut,
}: {
  session: Session;
  onSignIn: (s: Session) => void;
  onSignOut: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-[#dce4ef] bg-white p-4">
        {session ? (
          <>
            <p className="text-[13px] font-bold text-[#0a1e3f]">{session.name}</p>
            <p className="mt-0.5 text-[11.5px] text-[#5a7091]">@{session.handle}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-3 w-full rounded-full border border-[#dce4ef] px-4 py-2 text-[12px] font-semibold text-[#5a7091] transition-colors hover:border-[#ff9933]"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h3 className="text-[13px] font-bold text-[#0a1e3f]">Join the discussion</h3>
            {/* No OTP is sent and no code is checked — there is no backend to
                check it against yet. The flow exists so the UI around it is
                built; signIn() becomes POST /auth/otp unchanged. */}
            <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
              Demo sign-in — nothing is sent anywhere, and your session lives only in this browser.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2.5 w-full rounded-lg border border-[#dce4ef] px-3 py-2 text-[13px] outline-none focus:border-[#ff9933]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="10-digit mobile"
              className="mt-2 w-full rounded-lg border border-[#dce4ef] px-3 py-2 text-[13px] outline-none focus:border-[#ff9933]"
            />
            <button
              type="button"
              disabled={phone.length !== 10 || !name.trim()}
              onClick={() => signIn(phone, name).then(onSignIn)}
              className="mt-2.5 w-full rounded-full bg-[#ff9933] px-4 py-2 text-[12.5px] font-bold text-white transition-opacity disabled:opacity-40"
            >
              Continue
            </button>
          </>
        )}
      </div>

      <div className="rounded-xl border border-[#dce4ef] bg-white p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">Trending</h3>
        <ul className="mt-2 space-y-1.5">
          {forumHashtags.slice(0, 6).map((h) => (
            <li key={h.tag} className="flex items-center justify-between text-[12px]">
              <span className="text-[#c96608]">#{h.tag}</span>
              <span className={h.change >= 0 ? "text-[#138808]" : "text-[#e11d48]"}>
                {h.change >= 0 ? "+" : ""}
                {h.change}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-[#dce4ef] bg-white p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">House rules</h3>
        <ul className="mt-2 space-y-2.5">
          {forumGuidelines.map(([t, d]) => (
            <li key={t}>
              <p className="text-[12px] font-bold text-[#0a1e3f]">{t}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#5a7091]">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
