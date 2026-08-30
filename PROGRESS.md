# Progress — Gmail Portfolio

Living status doc. The brief lives in `docs/instructions/kickoff-prompt.md`
(revision 2) and `docs/instructions/concept.md`. This file tracks _where we are_.

**Last updated:** 2026-08-30 — **M5 code complete.** Responsive, a11y and SEO all shipped; 5e (content + deploy) is the only thing left.

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
`/` and `/_not-found` prerender `○ (Static)`; `/email/[slug]` prerenders 31 pages and
`/label/[label]` prerenders 15, both `● (SSG)`. `/robots.txt` and `/sitemap.xml` are
static too. **52/52 pages generated at build, zero dynamic routes.**

---

## Milestones

- [x] **M0** — scaffold, git init, shadcn, Gmail palette tokens, light/dark, fonts
- [x] **M1** — the shell: route group, chrome layout, sidebar, topbar, theme toggle
      (client #1), mobile drawer (client #2)
- [x] **M2** — `Email`/`Block`/`Label` types, 31 seed emails, inbox list rendering
- [x] **M3** — reading view: `[slug]` route + `generateStaticParams`, block renderer
      with exhaustiveness check, reading-view header, signature, one written case study
- [x] **Design pass** — full Gmail-fidelity refactor (see below)
- [x] **M4** — labels → URL-based filtering
  - [x] Decision: **path segments** `/label/[label]`, not `searchParams` (see plan.md Part 0)
  - [x] Label set: union narrowed **74 → 15** MERN labels; 31 emails **remapped** onto them
        (all kept; each label now has 2–4 emails so filtering is demonstrable)
  - [x] `lib/labels.ts` — `LABEL_SLUGS` (Record-guaranteed), `slugToLabel`, `labelsInUse`, `emailsByLabel`
  - [x] Route `app/(inbox)/label/[label]/page.tsx` + `generateStaticParams` (15 routes, SSG verified)
  - [x] Extract shared `components/inbox/email-list.tsx` — both pages use it
  - [x] `nav-row.tsx` (client #3) for active-state; sidebar rewired; Labels section populated
  - [x] Label chips on the reading view are `<Link>`s to `/label/[label]`
- [~] **M5** — responsive, a11y, SEO, deploy to Vercel ← **code done, content + deploy left**
  - [x] **5a** Mobile inbox row — two guarded branches (`flex md:hidden` / `hidden md:flex`),
        avatar-led 3-line layout under `md`, original single line above it
  - [x] **5b** Topbar overflowed at 390px — theme toggle and avatar rendered off-screen and
        were silently clipped by the layout's `overflow-hidden`. Fixed with `min-w-0` on the
        search form; wordmark now `hidden sm:inline`. Reading view already responsive.
  - [x] **5c** a11y — closed mobile drawer had **23 focusable elements** in the tab order at
        `left:-256`; fixed with `inert={!open}`. Hamburger given an accessible name.
        Deeper keyboard work (focus trap, Escape, skip link) **deliberately descoped** — see below.
  - [x] **5d** SEO — root title template + `metadataBase`, `generateMetadata` on all 46
        dynamic routes, `sitemap.ts` (47 URLs), `robots.ts`
  - [ ] **5e** wordmark, real content, resume PDF, deploy ← **NEXT** (real projects arriving 2026-08-31)
- [ ] **M6** — remaining Tier 1 content → frontend complete
- [ ] M7 compose→backend · M8 chat · M9 owner inbox _(no backend work before M7)_

## Client component budget: **3 of 8 used**

1. `components/theme-toggle.tsx` — needs `onClick`; holds zero state.
2. `components/layout/mobile-sidebar-toggle.tsx` — holds `open` boolean; receives the
   server-rendered `<Sidebar/>` as children (correct island pattern).
3. `components/layout/nav-row.tsx` — needs `usePathname()` for the active highlight; the
   cached layout never sees the pathname, and CSS cannot set `aria-current` (an attribute).
   Holds zero state; receives its lucide icon as `children`, so no icon code reaches the
   client bundle.

Everything else — inbox tabs, toolbars, checkboxes, hover states — is a Server Component.
Tabs are links, checkboxes are native inputs, hover is pure CSS.

---

## Files that exist

```
app/
  layout.tsx                        root layout — fonts, title template + metadataBase, anti-flash script
  sitemap.ts                        47 URLs (home + 31 emails + 15 labels), built from the same data
  robots.ts                         allow-all + sitemap pointer
  globals.css                       Tailwind v4 @theme + Gmail tokens (light + dark)
  (inbox)/
    layout.tsx                      full-width topbar, then sidebar + white card <main>
    page.tsx                        toolbar + tabs + sorted row list
    email/[slug]/page.tsx           reading view; generateStaticParams, dynamicParams=false
    label/[label]/page.tsx          label filter; 15 SSG routes, dynamicParams=false
components/
  layout/sidebar.tsx                Compose, nav rows (32px pills), unread counts, Labels
  layout/topbar.tsx                 hamburger, wordmark, search form, apps grid, avatar
  layout/mobile-sidebar-toggle.tsx  client #2
  layout/nav-row.tsx                client #3 — usePathname() active state + aria-current
  theme-toggle.tsx                  client #1
  inbox/inbox-tabs.tsx              Primary / Promotions / Social
  inbox/list-toolbar.tsx            select-all, refresh, pagination
  inbox/email-list.tsx              shared <ul> of rows — inbox and label pages both use it
  inbox/email-row.tsx               two guarded branches: phone (avatar + 3 lines) / md+ (one line)
  email/block-renderer.tsx          discriminated-union switch + never check
  email/reading-toolbar.tsx         back, archive, delete, …, print
  email/signature.tsx               reusable sign-off
  ui/button.tsx                     shadcn, untouched
content/
  types.ts                          Block, Label (15 members), IsoDate, Email
  email.ts                          31 emails (1 written, 30 filler), ISO dates, remapped to 15 labels
lib/
  site.ts                           SITE_URL — the ONE place the domain appears
  emails.ts                         sortedEmails + formatEmailDate
  labels.ts                         LABEL_SLUGS, slugToLabel, labelsInUse, emailsByLabel
  utils.ts                          shadcn cn()
public/hello.jpg                    case-study image
.vscode/settings.json               files.encoding=utf8 — stops the editor re-adding BOMs
```

> Note: `content/email.ts` is still singular; plan.md wants it renamed to `emails.ts`
> during the content pass. Not renamed yet — `lib/emails.ts` (the helper) already exists
> and is a different file.

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

**Label set: remapped, not culled.** The union had 74 labels, 59 used exactly once — which
would mean 59 single-email routes and a 72-row sidebar. Instead of deleting emails (which
would empty the inbox mid-build), the union was narrowed to **15 real MERN labels** and the
31 emails reassigned onto them, so each label owns 2–4 emails and filtering is demonstrable.
`lib/labels.ts` owns label↔slug conversion; `Record<Label, string>` makes a label without a
URL slug a compile error (verified: it refused to build while the union still had 74 members).

**`strict` does not catch a wrong-import that shares a prop.** The label chips were briefly
importing `Link` from **lucide-react** (the chain-link _icon_) instead of `next/link`. It
typechecked clean — lucide's props extend `SVGProps`, and SVG has an `href` attribute — so the
chips rendered as `<svg href="...">` and simply didn't navigate. Lesson: when a wrong import
still compiles, the two things share a structural prop; the compiler can't help, only clicking
it can.

**Narrow with `notFound()`, not `!`.** `slugToLabel()` returns `Label | undefined`. Because
`notFound()` returns `never`, `if (!label) notFound();` narrows the type for real, where the
non-null assertion only silenced it. Same pattern as the email page.

**A flex item will not shrink below its content unless you say so.** The topbar at 390px
had a header `scrollWidth` of 493 — the theme toggle and avatar rendered entirely
off-screen, and `overflow-hidden` on the `(inbox)` layout clipped them silently, so there
was no scrollbar to notice. Cause: `flex-1` controls how an item **grows**; a flex item
also defaults to `min-width: auto`, which refuses to shrink past its content.'s intrinsic
width. `min-w-0` on the search form is the whole fix. Same rule as `min-w-0` on a
truncating span — worth recognising on sight.

**Transforms hide pixels, not elements.** The mobile drawer was hidden with
`-translate-x-full`, which is paint-only: the subtree kept its box, its place in the
accessibility tree, and its place in the tab order. Measured: **23 focusable elements**
sitting at `left:-256`, reachable by Tab. `pointer-events-none` blocks the mouse, not the
keyboard. Fixed with React 19.'s `inert={!open}` — unfocusable and invisible to AT while
staying rendered and animatable, which `display:none` would not allow. Verified both
directions: `inert` present when closed (0 tabbable, `.focus()` refused), gone when open.

**Mobile is two guarded branches, not restyled desktop.** Every element must live inside
exactly one branch. A first attempt guarded the checkbox but not the star or the desktop
`<Link>`, so phones rendered the avatar block *and* the full desktop row stacked
underneath. Layout classes (`flex`, `h-10`) belong on each branch, not the shared `<li>` —
the two shapes disagree about height.

**`metadataBase` is what makes relative metadata URLs absolute.** Without it, an OG image
written as `/og.png` stays relative and every social preview breaks — Next warns at build
but does not fail. The domain now lives only in `lib/site.ts`, which also reads
`VERCEL_PROJECT_PRODUCTION_URL` at build time (no `NEXT_PUBLIC_` prefix — it is never
needed in the browser).

**`generateMetadata` is an addition, not a replacement.** A page file ends up exporting
`generateStaticParams`, `generateMetadata` and `default` side by side. The two functions
handle a bad slug differently on purpose: `generateMetadata` returns `{}` (no special
tags), the page calls `notFound()`. Editing the page component to `return {}` instead
fails Next.'s generated route validator — `Type '{}' is not assignable to
'AwaitedReactNode'` — which is the same species of compiler-enforced guarantee as
`Record<Label, string>`.

**`robots.txt` governs crawling, not indexing.** Its real job here is announcing the
sitemap at a fixed, guessable URL; the label pages are weakly linked (sidebar only, chips
hidden on mobile), so link-following alone under-discovers them. Blocking a URL there does
not keep it out of results — that is `metadata.robots`, which requires the page to be
crawlable to be read.

**The editor was writing UTF-8 BOMs.** `topbar.tsx`, `sidebar.tsx` and `(inbox)/page.tsx`
had a leading `EF BB BF`, two of them already committed, which showed up as a phantom
change to the first import line in every diff. Stripped, and `.vscode/settings.json` now
pins `files.encoding: utf8`. PowerShell.'s `Out-File`/`>`/`Set-Content` default to
BOM too — pass an explicit encoding when writing files from the terminal.

---

## Open questions / deferred

**M4 — `searchParams` vs path routing. ✅ DECIDED: path segments.**
`/label/[label]` + `generateStaticParams()` + `dynamicParams = false`, one prerendered file
per label. Rejected `searchParams` (forces dynamic rendering) and `cacheComponents`/PPR (no
dynamic hole to justify it). Full reasoning in `plan.md` Part 0. Escape hatch if multi-filter
is ever needed: build `/search` as the one deliberately-dynamic route.

**M4 — sidebar active-label highlight. ✅ DECIDED: one client island (`nav-row.tsx`, #3).**
Uses `usePathname()`. Must be client because the cached layout never sees the pathname, and
CSS can't set `aria-current="page"` (an attribute). Receives the server-rendered icon as
`children`, so lucide-react never enters the client bundle. **Built and shipped.**

**Unscheduled — right-edge app-switcher rail.** Real Gmail has a slim vertical icon strip on
the far right (Calendar, Keep, Contacts). Contacts→About Me is Tier 1, so this is structural.
Deferred until we know which icons it needs.

**Mobile drawer slide animation. ✅ VERIFIED (M5).** Confirmed in real Chrome via the browser
extension — the drawer slides `left:-256 → 0` on open and back on close, and `inert` flips
correctly in both directions. The old automation-browser caveat no longer applies: the
extension drives the real browser, so animations and computed styles read true.

**Sender voice.** `sender` mixes "who" (Client Work) and "what" (Personal Project). A voice
decision, not a bug.

**Checkboxes are decorative.** Row and select-all checkboxes are real, keyboard-accessible
`<input type="checkbox">` elements, but nothing is wired to selection yet.

**a11y depth — DECIDED at M5: descoped for now.** The user's call: "no need for too much
accessibility… advanced things like keyboard navigation is overkill at this stage." So the
bar is *works, responsive, nothing broken* — fix unreachable controls, invisible focusable
content and missing accessible names; skip focus traps, Escape handling, skip links and ARIA
dialog patterns. Note this relaxes the kickoff's "keyboard navigable throughout" line —
deliberate, revisit post-deploy. Still open if ever picked up: drawer focus management
(`@base-ui/react` Dialog gives trap + Escape + return-focus for free), a skip link, and
`aria-label` on the two unlabelled `<nav>` landmarks.

---

## Debt to clear before the M5 deploy (= 5e)

- **Topbar wordmark reads "Gmail"** — trademark exposure; needs the user's own mark.
  `hidden sm:inline` (5b) only hides it on phones; it is still there on desktop.
- **30 of 31 emails are fabricated filler.** Only `server-setup-template` has a written body,
  and it's realistic dummy prose the user intends to rewrite. **Real projects arriving
  2026-08-31.** Note the scope rule: one excellent case study deployed beats 31 fake ones.
- **Domain is a placeholder** — `lib/site.ts` says `https://thakursaad.dev`. One edit, but a
  wrong value silently breaks every canonical, OG URL and the sitemap. See notes.md item 5.
- **Print button** in the reading toolbar isn't wired — it's the resume download.
- **Reading view sender email** is hardcoded `portfolio@thakursaad.dev`.
- ~~`metadata.description` says "Generated by create next app"~~ — **cleared in 5d.**

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
bluntly.** Do not write application code into files unless asked. "you decide" / "fix what
needs fixing" _is_ that permission — but a vague "proceed with the project" means *continue
the teaching loop*, not go author files. When in doubt, teach the step and stop.
**Ship-first bar (set at M5):** working, responsive and not-broken beats exhaustive polish. **The user commits manually; don't
commit unless asked.** Keep explanations short and plain; expand only when asked "why".

Shell commands, reads, builds, linters, doc lookups are all free. Check current docs before
running CLI commands or teaching an API — versions drift.
