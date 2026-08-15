"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowDown, ArrowRight, Mail, MapPin, Phone, Check } from "lucide-react";
import { Typewriter } from "@/components/motion/Typewriter";
import { contactData } from "@/data/contact";

/* Reference palette: navy hero #0A1E3F, heading #1B3A6B, body #1F2A44,
   muted #54617C, saffron #E67300, panel #F2F5FA. Sharp 3px shapes. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════ hero ═══════════════ */

export function ContactHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { hero } = contactData;

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0A1E3F] pt-28 sm:pt-32">
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-12 text-center sm:px-6 sm:pb-14">
        <motion.span
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD9AE]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#E67300]" />
          {hero.kicker}
        </motion.span>

        <h1
          className="mt-4 text-[2.5rem] font-extrabold leading-[1.22] tracking-[1px] sm:text-[3.75rem] lg:text-[4.5rem] text-white"
          aria-label={hero.title}
        >
          {hero.title.split("").map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.045, ease: EASE }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-4 text-[15px] leading-loose text-[#C9D6EA] sm:text-base"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.a
          href="#enquiry"
          className="mt-7 inline-flex h-10 w-10 items-center justify-center border border-white/30 text-white"
          style={{ borderRadius: 3 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.12)" }}
          aria-label="Scroll to the enquiry form"
        >
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </div>

      <motion.div
        className="relative z-0 w-full"
        initial={{ opacity: 0, y: 26 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
      >
        <img
          src="/images/pa/hero-crowd-clean.png"
          alt=""
          aria-hidden
          className="block h-auto w-full select-none opacity-70"
          width={2561}
          height={218}
          style={{
            WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 30%)",
            maskImage: "linear-gradient(180deg, transparent 0, #000 30%)",
          }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════ enquiry ═══════════════ */

type Errors = { email?: string; phone?: string };

function Field({
  id,
  label,
  required,
  error,
  children,
  delay,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <label htmlFor={id} className="block text-[11px] font-bold tracking-[0.16em] text-[#54617C]">
        {label}
        {required && <span className="ml-1 text-[#E67300]">*</span>}
      </label>
      {children}
      {/* Reserve the error row so validation messages never nudge the layout. */}
      <span className="mt-1 block min-h-[16px] text-[12px] font-medium text-[#C0392B]">
        {error ?? ""}
      </span>
    </motion.div>
  );
}

const inputCls =
  "mt-1.5 w-full border border-[#14213D]/15 bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A44] outline-none transition-colors placeholder:text-[#9AA6BC] focus:border-[#E67300] focus:ring-2 focus:ring-[#E67300]/20";

export function ContactEnquiry() {
  const { enquiry, offices, mail, phone, form, success } = contactData;
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = "Enter a valid email address.";
    if (values.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(values.phone.trim()))
      e.phone = "Enter a valid phone number.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    // No enquiry endpoint exists yet — this confirms locally and holds the
    // values. Wiring it to the backend is a one-line swap here.
    setSent(true);
  };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setSent(false);
  };

  return (
    <section id="enquiry" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.span
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A85200]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.55 }}
        >
          <span className="h-px w-7 bg-[#E67300]" />
          {enquiry.kicker}
        </motion.span>

        <motion.h2
          className="mt-3 text-3xl font-bold leading-[1.2] text-[#1B3A6B] sm:text-[2.8rem]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Typewriter text={enquiry.title} />
        </motion.h2>

        <motion.p
          className="mt-3 max-w-2xl text-[15px] leading-loose text-[#1F2A44]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {enquiry.body}
        </motion.p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14">
          {/* contact rails */}
          <div className="space-y-6">
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center bg-[#F2F5FA] text-[#E67300]"
                style={{ borderRadius: 3 }}
              >
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1B3A6B]">Address</h3>
                {offices.map((o) => (
                  <div key={o.label} className="mt-3">
                    <span className="block text-[11px] font-bold tracking-[0.16em] text-[#A85200]">
                      {o.label}
                    </span>
                    <address className="mt-1 not-italic text-sm leading-relaxed text-[#54617C]">
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                  </div>
                ))}
              </div>
            </motion.div>

            {[
              { icon: <Mail className="h-5 w-5" />, title: "Mail", value: mail, href: `mailto:${mail}` },
              { icon: <Phone className="h-5 w-5" />, title: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
            ].map((row, i) => (
              <motion.div
                key={row.title}
                className="flex gap-4"
                initial={{ opacity: 0, x: -22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center bg-[#F2F5FA] text-[#E67300]"
                  style={{ borderRadius: 3 }}
                >
                  {row.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#1B3A6B]">{row.title}</h3>
                  <a
                    href={row.href}
                    className="mt-1 inline-block text-[15px] text-[#54617C] underline-offset-4 transition-colors hover:text-[#E67300] hover:underline"
                  >
                    {row.value}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* form */}
          <div
            className="relative border border-[#14213D]/10 bg-[#F2F5FA] p-6 sm:p-8"
            style={{ borderRadius: 3 }}
          >
            {/* Deliberately NOT AnimatePresence mode="wait" here. That mode holds
                the outgoing child until its exit animation finishes — and if the
                browser throttles animations (a background tab, reduced power
                mode) the confirmation can be left unmounted while the faded form
                sits there. A submit confirmation is the one transition a user
                must never miss, so the swap is immediate and only the incoming
                panel animates. */}
            {sent ? (
              <motion.div
                  className="flex min-h-[380px] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <motion.span
                    className="grid h-14 w-14 place-items-center bg-[#E67300] text-white"
                    style={{ borderRadius: 3 }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  >
                    <Check className="h-7 w-7" />
                  </motion.span>
                  <h3 className="mt-5 text-2xl font-bold text-[#1B3A6B]">{success.title}</h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-loose text-[#54617C]">{success.body}</p>
                  <button
                    onClick={reset}
                    className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold tracking-[1px] text-[#E67300] transition-colors hover:text-[#A85200]"
                  >
                    {success.again}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <Field id="c-name" label={form.fields.name.label} delay={0}>
                    <input
                      id="c-name"
                      type="text"
                      className={inputCls}
                      style={{ borderRadius: 3 }}
                      placeholder={form.fields.name.placeholder}
                      value={values.name}
                      onChange={set("name")}
                    />
                  </Field>

                  <Field id="c-email" label={form.fields.email.label} required error={errors.email} delay={0.06}>
                    <input
                      id="c-email"
                      type="email"
                      className={inputCls}
                      style={{ borderRadius: 3 }}
                      placeholder={form.fields.email.placeholder}
                      value={values.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "c-email-err" : undefined}
                    />
                  </Field>

                  <Field id="c-phone" label={form.fields.phone.label} error={errors.phone} delay={0.12}>
                    <input
                      id="c-phone"
                      type="tel"
                      className={inputCls}
                      style={{ borderRadius: 3 }}
                      placeholder={form.fields.phone.placeholder}
                      value={values.phone}
                      onChange={set("phone")}
                      aria-invalid={!!errors.phone}
                    />
                  </Field>

                  <Field id="c-message" label={form.fields.message.label} delay={0.18}>
                    <textarea
                      id="c-message"
                      rows={5}
                      className={`${inputCls} resize-y`}
                      style={{ borderRadius: 3 }}
                      placeholder={form.fields.message.placeholder}
                      value={values.message}
                      onChange={set("message")}
                    />
                  </Field>

                  <motion.button
                    type="submit"
                    className="group relative mt-2 inline-flex items-center gap-2 overflow-hidden bg-[#E67300] px-7 py-3 text-[13px] font-bold tracking-[1.5px] text-white"
                    style={{ borderRadius: 3 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.35) 50%, transparent 62%)",
                        backgroundSize: "220% 100%",
                      }}
                      animate={{ backgroundPosition: ["-120% 0%", "220% 0%"] }}
                      transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                    />
                    {form.submit}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>

                  <p className="pt-2 text-[12px] text-[#54617C]">{form.note}</p>
                </motion.form>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
