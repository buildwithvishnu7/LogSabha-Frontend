"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { constituencies, constituencyCoverage, constituencyPending } from "@/data/constituencies";
import { lsParty } from "@/data/lok-sabha-2024";

/* The constituency record.
 *
 * This table shows a verified subset — 77 of 543 seats — and says so at the top
 * rather than in a footnote. A partial dataset presented as complete is worse
 * than no dataset: a reader who searches for a missing seat and finds nothing
 * concludes the seat does not exist. */

const nf = new Intl.NumberFormat("en-IN");

export function ConstituencyTable() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("All");
  const [party, setParty] = useState("All");

  const states = useMemo(
    () => ["All", ...Array.from(new Set(constituencies.map((c) => c.s))).sort()],
    [],
  );
  const parties = useMemo(
    () => ["All", ...Array.from(new Set(constituencies.map((c) => c.p))).sort()],
    [],
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return constituencies
      .filter((c) => (state === "All" || c.s === state) && (party === "All" || c.p === party))
      .filter(
        (c) =>
          !needle ||
          c.c.toLowerCase().includes(needle) ||
          c.w.toLowerCase().includes(needle) ||
          c.s.toLowerCase().includes(needle),
      )
      .sort((a, b) => (b.m ?? -1) - (a.m ?? -1));
  }, [q, state, party]);

  const pct = Math.round((constituencyCoverage.loaded / constituencyCoverage.houseSize) * 100);

  return (
    <section id="database" className="bg-white py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        <div className="max-w-[70ch]">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e87d12]">
            The record
          </span>
          <h2 className="mt-2 text-[clamp(22px,2.6vw,36px)] font-extrabold tracking-tight text-[#0a1e3f]">
            Constituency by constituency
          </h2>
        </div>

        {/* Coverage stated up front, not buried. */}
        <div className="mt-5 rounded-xl border border-[#ffe4c4] bg-[#fff8f0] p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-[13px] font-semibold text-[#0a1e3f]">
              {constituencyCoverage.loaded} of {constituencyCoverage.houseSize} seats loaded
              <span className="ml-2 font-normal text-[#5a7091]">
                ({pct}% of the House, across {constituencyCoverage.statesCovered} states)
              </span>
            </p>
            <p className="text-[12px] text-[#5a7091]">
              {constituencyCoverage.withFirmMargin} rows carry a firm winning margin. The rest show
              the seat and the member, and leave the margin blank until the ECI feed supplies it.
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ffe4c4]">
            <motion.span
              className="block h-full rounded-full bg-[#ff9933]"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex-1 min-w-[220px]">
            <span className="sr-only">Search constituency, member or state</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a constituency, member or state…"
              className="w-full rounded-full border border-[#dce4ef] bg-white px-4 py-2.5 text-[13px] text-[#0a1e3f] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#ff9933]"
            />
          </label>
          <Select label="State" value={state} onChange={setState} options={states} />
          <Select label="Party" value={party} onChange={setParty} options={parties} />
        </div>

        <p className="mt-3 text-[12px] text-[#5a7091]" role="status" aria-live="polite">
          {rows.length} {rows.length === 1 ? "seat" : "seats"} shown
        </p>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[#dce4ef]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f6f9fd] text-[10px] font-bold uppercase tracking-wide text-[#5a7091]">
                <Th>Constituency</Th>
                <Th>State</Th>
                <Th>Member</Th>
                <Th>Party</Th>
                <Th className="text-right">Margin</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-[#e6eaf2] text-[13px] hover:bg-[#f6f9fd]">
                  <td className="px-3 py-2.5 font-semibold text-[#0a1e3f]">
                    {c.c}
                    {c.note && (
                      <span className="ml-2 rounded-full bg-[#fff4e6] px-2 py-0.5 text-[10px] font-semibold text-[#c96608]">
                        {c.note}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[#5a7091]">{c.s}</td>
                  <td className="px-3 py-2.5 text-[#22406e]">{c.w}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[#22406e]">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: lsParty[c.p]?.c ?? "#94a3b8" }}
                      />
                      {c.p}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {c.m == null ? (
                      <span className="text-[11px] italic text-[#94a3b8]">awaiting feed</span>
                    ) : (
                      <span className="font-semibold text-[#0a1e3f]">{nf.format(c.m)}</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-[13px] text-[#5a7091]">
                    No seat in the loaded subset matches that. It may still be one of the{" "}
                    {constituencyCoverage.houseSize - constituencyCoverage.loaded} seats not yet
                    loaded here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 max-w-[74ch]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5a7091]">
            Not loaded here
          </h3>
          <ul className="mt-2 space-y-1">
            {constituencyPending.map((p) => (
              <li
                key={p}
                className="border-l-2 border-[#ff9933] pl-3 text-[12.5px] leading-relaxed text-[#5a7091]"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-[#94a3b8]">Source: {constituencyCoverage.source}</p>
        </div>
      </div>
    </section>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 ${className}`}>{children}</th>;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-[#5a7091]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-[#dce4ef] bg-white px-3 py-2 text-[12px] text-[#0a1e3f] outline-none transition-colors focus:border-[#ff9933]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
