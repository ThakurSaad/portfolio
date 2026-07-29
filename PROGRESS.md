# Progress — Gmail Portfolio

Living status doc. Authoritative plan lives in `C:\Users\thakursaad\Downloads\mds\kickoff-prompt.md`
and `concept.md`. This file only tracks *where we are*.

**Last updated:** 2026-07-29 (M2 done, starting M3)

---

## Stack as actually installed

| Thing | Version / choice |
|---|---|
| Next.js | 16.2.12, App Router, Turbopack (now the default bundler) |
| React | 19.2.4 |
| TypeScript | 5.9.3, `strict` + `noUncheckedIndexedAccess` |
| Tailwind | 4.3.3 — **CSS-first, there is no `tailwind.config.js`** |
| shadcn/ui | CLI 4.15.0, primitives are **Base UI** (`@base-ui/react`), not Radix |
| Package manager | pnpm 11.13.0 |
| Fonts | Inter (chrome) + Roboto (body) + Roboto Mono, via `next/font/google` |

Quality gates: `pnpm typecheck`, `pnpm lint`, `pnpm build` — all pass.
`/` and `/_not-found` both prerender as `○ (Static)`.

---

## Milestones

- [x] **M0** — scaffold, git init, shadcn, Gmail palette tokens, light/dark, fonts
- [x] **M1** — the shell: route group, chrome layout, sidebar, topbar, theme toggle
      (client #1), mobile drawer (client #2)
- [x] **M2** — `Email`/`Block`/`Label` types in `content/types.ts`, 31 seed emails in
      `content/email.ts`, inbox list rendering in `app/(inbox)/page.tsx`
- [ ] **M3** — reading view ← **IN PROGRESS**
  - [ ] Step 1 — `app/(inbox)/email/[slug]/page.tsx` + `generateStaticParams` (rows currently 404)
  - [ ] Step 2 — block renderer: discriminated-union switch with exhaustiveness check
  - [ ] Step 3 — reading-view header (sender, subject, date, labels, star) + body
  - [ ] Step 4 — signature component
  - [ ] Step 5 — write ONE complete real case study (replace placeholder bodies)
- [ ] **M4** — label filtering
- [ ] **M5** — responsive, a11y, SEO, deploy to Vercel
- [ ] **M6** — remaining Tier 1 content → frontend complete
- [ ] M7 compose→backend · M8 chat · M9 owner inbox *(no backend work before M7)*

## Client component budget: **2 of 8 used**

1. `components/theme-toggle.tsx` — needs `onClick`; holds zero state.
2. `components/layout/mobile-sidebar-toggle.tsx` — holds `open` boolean; receives the
   server-rendered `<Sidebar/>` as children (correct island pattern).

---

## Files that exist

```
app/
  layout.tsx              root layout — fonts, metadata, anti-flash theme script
  globals.css             Tailwind v4 @theme + Gmail palette tokens
  (inbox)/
    layout.tsx            Gmail chrome: sidebar + topbar + scrolling <main>
    page.tsx              placeholder, "Inbox coming in M2"
components/
  layout/sidebar.tsx
  layout/topbar.tsx
  theme-toggle.tsx        client component #1
  ui/button.tsx           shadcn, untouched
lib/utils.ts              shadcn cn()
```

---

## Decisions made along the way

**Theming is `data-theme`, not a `.dark` class.** `@custom-variant dark (&:is([data-theme="dark"] *))`
in `globals.css`, and the values live under `[data-theme="dark"] { }`.

**Why:** the toggle originally used `useState` with a lazy initializer that read the DOM.
Server rendered one icon, client rendered the other → hydration mismatch → React discarded
the server HTML and re-rendered from the RSC payload, wiping the inline script's work on
`<html>`. Fix was to make the toggle **stateless**: render both icons, let CSS
(`dark:hidden` / `hidden dark:block`) pick the visible one, so server and client output are
identical. General rule: *anything differing between server and client must be resolved by
CSS or an inline script, never by React state during initial render.*

**No OS-preference fallback.** Defaults to light until the visitor clicks the toggle.
Safe to re-add now that the hydration bug is gone (one line in the inline script in
`app/layout.tsx`) — deliberately dropped, not broken.

**Sidebar says "Inbox", not "Primary".** Per `concept.md`, Primary/Social/Promotions/Updates/
Forums are horizontal *tabs inside* the inbox pane, not sidebar entries. Those tabs get built
in M2 inside `app/(inbox)/page.tsx`.

---

## Open questions / deferred, with the milestone they land in

**M4 — `searchParams` vs path routing.** The kickoff says filtering reads `searchParams`,
but Next 16 docs are explicit: `searchParams` is a request-time API and *opts the page into
dynamic rendering*. That contradicts "every page statically rendered at build time".
Alternative that preserves the whole intent (URL owns state, shareable, zero client JS):
path segments — `app/label/[slug]/page.tsx` + `generateStaticParams()`, one prerendered HTML
file per label. Tradeoff: query params compose for multiple simultaneous filters, path
segments don't. **Not yet decided.**

**M4 — sidebar active-label highlight.** `layout.tsx` receives `params` but **never**
`searchParams`, and layouts don't re-render on navigation. The sidebar lives in the layout
and needs to know the active label. Options all cost something (`useSelectedLayoutSegment`
in a small client component, or restructuring). **Not yet decided.**

**Unscheduled — right-edge app-switcher rail.** Real Gmail has a slim vertical icon strip on
the far right (Calendar, Keep, Contacts). Contacts→About Me is Tier 1, so this is structural,
not decorative. Discussed, deliberately deferred until we know which icons it needs.

**Mobile drawer slide animation — needs real-browser check.** The toggle logic works
(open/close state + class flip verified). The slide *animation* could not be verified in the
automation browser: it doesn't composite frames (screenshots also fail), and CSS transitions
are driven by the paint loop, so any transition freezes at its start value there. The idiomatic
code (`translate-x-0`/`-translate-x-full` + `transition-transform`) is almost certainly correct;
confirm the slide in a real browser at M5. If it genuinely doesn't slide, fall back to a
@keyframes animation or accept a snap (remove `transition-transform`).

**Inbox-list polish (fold into M3 verification):**
- `sender` mixes "who" (Client Work) and "what" (Personal Project) — voice decision, not a bug
- Subject + snippet both `flex-1` split 50/50; real Gmail weights them differently

**Before deploy:**
- `metadata.description` in `app/layout.tsx` still says "Generated by create next app"
- Topbar wordmark currently reads "Gmail" — kickoff forbids Google branding, needs own mark
- `--gmail-blue-dark` / `--gmail-selected-dark` in `:root` are light-mode-only helper tokens
  with no dark counterpart; naming should be made consistent when they're first used

**Consent gates (do not ship without confirming these conversations happened):**
- Trash easter eggs quoting family/friends — exact wording OK'd, or rewritten as own memory
- Named references — colleagues must agree before appearing, even name-only

---

## How to work on this

From the kickoff, unchanged: **explain the concept → show a ≤15-line snippet → say which file →
stop and wait for the user to write it → then review bluntly.** Do not write application code
into files unless asked. Shell commands, reads, builds, linters, doc lookups are all free.

One step at a time. Check current docs before running CLI commands — versions drift.
