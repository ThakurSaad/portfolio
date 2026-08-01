# Progress — Gmail Portfolio

Living status doc. The brief lives in `docs/instructions/kickoff-prompt.md`
(revision 2) and `docs/instructions/concept.md`. This file tracks _where we are_.

**Last updated:** 2026-08-01 — M3 done + full Gmail design pass. **M4 is next.**

---

## Stack as actually installed

| Thing           | Version / choice                                                      |
| --------------- | --------------------------------------------------------------------- |
| Next.js         | 16.2.12, App Router, Turbopack (now the default bundler)              |
| React           | 19.2.4                                                                |
| TypeScript      | 5.9.3, `strict` + `noUncheckedIndexedAccess`                          |
| Tailwind        | 4.3.3 — **CSS-first, there is no `tailwind.config.js`**               |
| shadcn/ui       | CLI 4.15.0, primitives are **Base UI** (`@base-ui/react`), not Radix  |
| Package manager | pnpm 11.13.0                                                          |
| Fonts           | Inter (chrome) + Roboto 400/500 + Roboto Mono, via `next/font/google` |

Quality gates: `pnpm typecheck`, `pnpm lint`, `pnpm build` — all pass.
`/` and `/_not-found` prerender `○ (Static)`; `/email/[slug]` prerenders 31 pages `● (SSG)`.

---

## Milestones

- [x] **M0** — scaffold, git init, shadcn, Gmail palette tokens, light/dark, fonts
- [x] **M1** — the shell: route group, chrome layout, sidebar, topbar, theme toggle
      (client #1), mobile drawer (client #2)
- [x] **M2** — `Email`/`Block`/`Label` types, 31 seed emails, inbox list rendering
- [x] **M3** — reading view: `[slug]` route + `generateStaticParams`, block renderer
      with exhaustiveness check, reading-view header, signature, one written case study
- [x] **Design pass** — full Gmail-fidelity refactor (see below)
- [ ] **M4** — labels → URL-based filtering ← **NEXT**
- [ ] **M5** — responsive, a11y, SEO, deploy to Vercel
- [ ] **M6** — remaining Tier 1 content → frontend complete
- [ ] M7 compose→backend · M8 chat · M9 owner inbox _(no backend work before M7)_

## Client component budget: **2 of 8 used**

1. `components/theme-toggle.tsx` — needs `onClick`; holds zero state.
2. `components/layout/mobile-sidebar-toggle.tsx` — holds `open` boolean; receives the
   server-rendered `<Sidebar/>` as children (correct island pattern).

Everything else — inbox tabs, toolbars, checkboxes, hover states — is a Server Component.
Tabs are links, checkboxes are native inputs, hover is pure CSS.

---

## Files that exist

```
app/
  layout.tsx                        root layout — fonts, metadata, anti-flash theme script
  globals.css                       Tailwind v4 @theme + Gmail tokens (light + dark)
  (inbox)/
    layout.tsx                      full-width topbar, then sidebar + white card <main>
    page.tsx                        toolbar + tabs + sorted row list
    email/[slug]/page.tsx           reading view; generateStaticParams, dynamicParams=false
components/
  layout/sidebar.tsx                Compose, nav rows (32px pills), unread counts
  layout/topbar.tsx                 hamburger, wordmark, search form, apps grid, avatar
  layout/mobile-sidebar-toggle.tsx  client #2
  theme-toggle.tsx                  client #1
  inbox/inbox-tabs.tsx              Primary / Promotions / Social
  inbox/list-toolbar.tsx            select-all, refresh, pagination
  inbox/email-row.tsx               checkbox, star, sender, subject+snippet, <time>
  email/block-renderer.tsx          discriminated-union switch + never check
  email/reading-toolbar.tsx         back, archive, delete, …, print
  email/signature.tsx               reusable sign-off
  ui/button.tsx                     shadcn, untouched
content/
  types.ts                          Block, Label, IsoDate, Email
  email.ts                          31 emails (1 written, 30 filler)
lib/
  emails.ts                         sortedEmails + formatEmailDate
  utils.ts                          shadcn cn()
public/hello.jpg                    case-study image
```

---

## Decisions made along the way

**Theming is `data-theme`, not a `.dark` class.** See kickoff rev 2 for the full
hydration-mismatch story. Rule: _anything differing between server and client must be
resolved by CSS or an inline script, never by React state during initial render._

**No OS-preference fallback.** Defaults to light until the visitor clicks. Safe to re-add
(one line in the inline script in `app/layout.tsx`) — deliberately dropped, not broken.

**Sidebar says "Inbox", not "Primary".** Primary/Promotions/Social are _tabs inside_ the
inbox pane, per `concept.md`. Built in `components/inbox/inbox-tabs.tsx`.

**Layout shape matches real Gmail:** the topbar spans the **full width** at the top and the
sidebar starts _below_ it (verified: header at `top:0` full width, sidebar at `top:64`).
The list/reading view floats as a **white rounded card** (`--gmail-card`, 16px radius) on the
`#f6f8fc` app background — the post-2022 Material 3 Gmail look.

**Dates are ISO + a template literal type.** `` IsoDate = `${number}-${number}-${number}` ``
makes `"Jul 20"` a compile error (verified by deliberately reintroducing it). `lib/emails.ts`
sorts reverse-chronologically — ISO sorts correctly as plain text. Rendered in
`<time dateTime>`; shows `"Jul 20"` this year, `"Jan 12, 2025"` for older.

**Never `font-bold`.** `next/font` loads Roboto **400 and 500 only**, so 700 gets synthesized
into a smeared fake bold. Gmail uses 500 for unread — use `font-medium`.

**One semantic `--gmail-accent` token** replaces the old `--gmail-blue` / `--gmail-blue-dark`
pair, so components never need a `dark:` variant for the accent colour.

---

## Open questions / deferred

**M4 — `searchParams` vs path routing. THE decision for this milestone.**
`searchParams` is a request-time API that opts a page into dynamic rendering, which
contradicts the static-rendering constraint. `layout.tsx` also never receives `searchParams`,
and layouts don't re-render on navigation — so the sidebar (which lives in the layout) can't
react to a query string at all. Intended resolution: path segments
(`app/label/[slug]/page.tsx` + `generateStaticParams()`), one prerendered file per label.
Tradeoff: query params compose for multiple simultaneous filters; path segments don't.
Third option: `cacheComponents: true` (PPR). **Not yet decided — decide at M4.**

**M4 — sidebar active-label highlight.** Same root cause as above. Options: a small client
component using `useSelectedLayoutSegment`, or restructuring. **Not yet decided.**

**Unscheduled — right-edge app-switcher rail.** Real Gmail has a slim vertical icon strip on
the far right (Calendar, Keep, Contacts). Contacts→About Me is Tier 1, so this is structural.
Deferred until we know which icons it needs.

**Mobile drawer slide animation — needs real-browser check.** Toggle logic verified; the
_animation_ can't be verified in the automation browser (it doesn't composite frames, so CSS
transitions freeze at their start value). Confirm in a real browser at M5.

**Sender voice.** `sender` mixes "who" (Client Work) and "what" (Personal Project). A voice
decision, not a bug.

**Checkboxes are decorative.** Row and select-all checkboxes are real, keyboard-accessible
`<input type="checkbox">` elements, but nothing is wired to selection yet.

---

## Debt to clear before the M5 deploy

- **Topbar wordmark reads "Gmail"** — trademark exposure; needs the user's own mark.
- **30 of 31 emails are fabricated filler.** Only `server-setup-template` has a written body,
  and it's realistic dummy prose the user intends to rewrite.
- **`metadata.description`** still says "Generated by create next app".
- **Print button** in the reading toolbar isn't wired — it's the resume download.
- **Reading view sender email** is hardcoded `portfolio@thakursaad.dev`.

## Consent gates (do not ship without confirming these conversations happened)

- Trash easter eggs quoting family/friends — exact wording OK'd, or rewritten as own memory
- Named references — colleagues must agree before appearing, even name-only

## Features the user wants later (from `docs/others/notes.md`)

- Gmail's unread behaviour: "new" badge on first visit, bold until opened; per-folder unread
  counts in the sidebar (counts are currently rendered from real data already).
- Project categories by role: backend built, backend collaborated, project lead, project manager.

---

## How to work on this

**Explain briefly → show a ≤15-line snippet → say which file → stop and wait → then review
bluntly.** Do not write application code into files unless asked — but "you decide" /
"proceed" / "fix what needs fixing" _is_ that permission. **The user commits manually; don't
commit unless asked.** Keep explanations short and plain; expand only when asked "why".

Shell commands, reads, builds, linters, doc lookups are all free. Check current docs before
running CLI commands or teaching an API — versions drift.
