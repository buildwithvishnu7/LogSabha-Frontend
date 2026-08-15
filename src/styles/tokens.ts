// Shared design tokens for the marketing pages.
//
// These exist because a design review found the pages had drifted: four
// different hero sizes (58/72/84/88px), six different section rhythms, and
// stray border radii. Anything that should look the same on every page belongs
// here, so the next page starts consistent instead of being normalised later.
//
// Tailwind scans this file, so the class strings below are generated normally.

/** Hero title, SHORT all-caps label (SERVICES, CONTACT US, …) — 40 / 60 / 72px */
// leading must clear the font ink box (~1.21em) or a title that wraps to two
// lines on mobile overlaps itself — measured 5px of collision at leading-1.08.
export const HERO_DISPLAY =
  "text-[2.5rem] font-extrabold leading-[1.22] tracking-[1px] sm:text-[3.75rem] lg:text-[4.5rem]";

/** Hero title, FULL SENTENCE (long editorial headlines) — 32 / 44 / 56px.
 *  A sentence set at display size wraps to three lines and stops reading as a
 *  title, which is why long-form pages get their own smaller tier. */
export const HERO_HEADLINE =
  "text-[2rem] font-extrabold leading-[1.25] sm:text-[2.75rem] lg:text-[3.5rem]";

/** Hero standfirst under the title */
export const HERO_SUB = "text-[15px] leading-loose sm:text-base";

/** Section heading — 24 / 38px */
export const H2 = "text-2xl font-bold leading-[1.25] sm:text-[2.4rem]";

/** Sub-heading inside a section */
export const H3 = "text-lg font-bold leading-snug sm:text-xl";

/** Section vertical rhythm — 56 / 80px */
export const SECTION_Y = "py-14 sm:py-20";

/** Body copy — 15px on a 2.0 ratio, which Devanagari matras need */
export const BODY = "text-[15px] leading-loose";

/** Every shape on the site is sharp, not pill-rounded */
export const RADIUS = 3;
