# Gmail Portfolio — Implementation Plan (M4 → M9)

**Written:** 2026-08-01. Verified against the repo source and against the Next.js
16.2.12 docs on nextjs.org (fetched, not recalled from training data).

This is the **handover document**. It is self-contained: a brand-new chat with zero
prior context can read this file plus `PROGRESS.md` and continue without losing anything.

---

## ⇢ START HERE (resuming in a new chat)

Read these, in this order:

| #   | File                                        | Why                                                 |
| --- | ------------------------------------------- | --------------------------------------------------- |
| 1   | **`plan.md`** (this file)                   | What to build next, in order, and why               |
| 2   | **`PROGRESS.md`** (repo root)               | What is built _today_ — the live state              |
| 3   | `docs/instructions/kickoff-prompt.md`       | The brief, revision 2 — constraints + working style |
| 4   | `docs/instructions/concept.md`              | Product concept, Tier 1/2/3 feature list            |
| 5   | `docs/others/notes.md`                      | User's wishlist of later features                   |
| 6   | `docs/instructions/backend-requirements.md` | Only matters from M7 onward                         |

Then **read the actual code before planning any change.** This plan was written against
verified source, not assumptions — keep that standard.

**Division of responsibility between the two living docs:**

- `plan.md` (this file) — _forward-looking._ Steps, decisions, rationale. Changes rarely.
- `PROGRESS.md` — _backward-looking._ What exists, what's done, open questions. **Update it
  at the end of every milestone**, and tick the milestone box in this file's table.

First action in a new chat: run `pnpm typecheck && pnpm lint && pnpm build` to confirm the
tree is green, and read the build route table to see what actually prerenders.

---

## The learning contract — read this before teaching anything

This project exists to **build a portfolio** _and_ to **teach modern frontend**. Both matter.
If a step ships working code but the user can't maintain it afterwards, that step failed.

The user is a **backend MERN expert** — Node, Express, MongoDB, JWT, TypeScript on the server
are all fluent. **Never explain those.** What's genuinely new to him: the App Router, Server
Components, the server/client boundary, Tailwind, and modern React data flow. His last React
was ~3 years ago: CRA, hooks, `useState` for everything, `useEffect` for data, CSS-in-JS.

**The teaching loop for every step, without exception:**

1. Explain the concept **briefly** — 2–4 sentences. Lead with the mechanism.
   Say explicitly _how it differs from the 2022 way_, because that contrast is where
   the understanding actually lands.
2. Show a snippet, **≤15 lines**. Enough to unblock, never the finished file.
3. Name the **exact file path** to create or edit.
4. **Stop. Wait.** He writes it. He will say when it's done.
5. **Review bluntly.** Call out anything written like it's 2022, anywhere he reached for
   client state when the server or the URL should own it, anywhere types are weaker than
   they could be.

He asked explicitly, mid-project, for **shorter and plainer** explanations. Long conceptual
preambles made things harder, not easier. Expand only when he asks "why" — then give the
real answer including tradeoffs.

**Do not write application code into files unless told.** But "you decide", "proceed", and
"fix what needs fixing" _are_ that permission — then do the work and report what changed.
**He commits manually. Never commit unless asked.**

Free without asking: shell commands, reads, builds, linter, typechecker, doc lookups.

### The through-line

Each milestone below has a **Learning objective**. They are sequenced deliberately:

| Milestone | The idea it teaches                                                            |
| --------- | ------------------------------------------------------------------------------ |
| M4        | The URL is the state store; the client/server boundary is a _value_ boundary   |
| M5        | Metadata and SEO artifacts are **file conventions that compile to routes**     |
| M6        | Model variants in the **type system**, not in parallel components              |
| M7        | React 19 form actions replace `onSubmit` + three `useState`s                   |
| M8        | Route-level code splitting isn't enough — `await import()` in a handler        |
| M9        | Containing a dynamic, authed area inside a static site (multiple root layouts) |

---

## Working constraints (non-negotiable, carried from the kickoff)

- **Client component budget: 8 total. 2 used.** Every new one needs a one-line justification
  comment. Projected final: **5 of 8**. Count them.
- Server Components are the default; `"use client"` is rare.
- No global state library. No Redux, Zustand, React Query.
- All content is typed `.ts` under `content/` — never a database.
- **Perf:** no route-specific client JS beyond framework baseline · Lighthouse mobile ≥98 ·
  LCP <1.2s Slow 4G · CLS ≈0 · fonts via `next/font` · every image `next/image` with explicit
  dimensions · **no new dependency without justifying bundle cost first.**
- **SEO:** per-route Metadata API, OG images, `sitemap.ts`, `robots.ts`, semantic HTML.
- **A11y:** keyboard nav, visible focus, landmarks, heading order, honest alt text,
  `prefers-reduced-motion`.
- **Gates:** `pnpm typecheck` + `pnpm lint` pass before any deploy.
- **No test suite in v1.** Prefer compile-time guarantees. Say so if a specific piece
  genuinely earns a test.
- **Depth beats breadth.** Tier 1 complete before Tier 2/3. Push back on scope creep.
- **No backend work before M7.**

### Known landmines (learned the hard way — do not re-derive)

- Theming is **`data-theme`**, never a `.dark` class.
- **Never let React state decide something the server can't know.** A hydration mismatch makes
  React discard the server HTML and re-render from the RSC payload — which once wiped the
  anti-flash script's work on `<html>`. Resolve server/client differences with **CSS or an
  inline script**, never React state during initial render.
- **Never `font-bold`.** Only Roboto 400/500 are loaded; 700 gets synthesized into smeared
  fake bold. Gmail uses 500 for unread — use `font-medium`.
- Dates are ISO, typed `` `${number}-${number}-${number}` ``. Render in `<time dateTime>`.
- **The automation browser cannot composite frames.** Screenshots time out; CSS transitions
  freeze at their start value so `getComputedStyle` lies. Anything animation- or
  paint-dependent **must** be checked in a real browser. This has cost real time twice.

---

## Part 0 — The M4 decision (researched, firm)

### What the Next.js 16.2.12 docs actually say

1. `searchParams` "is a **Request-time API** whose values cannot be known ahead of time.
   Using it will opt the page into **dynamic rendering** at request time."
2. "Layouts do not rerender on navigation, so they cannot access search params which would
   otherwise become stale." Layouts receive `children` and `params` **only**.
3. `cacheComponents: true` implements PPR as the App Router default — but also makes data
   fetching dynamic-by-default (you opt _into_ caching with `use cache`), changes `loading.js`
   semantics, and switches client navigation to React `<Activity>`.

The kickoff's revision-2 correction is **confirmed**, not merely plausible.

### Recommendation: path segments. Firm.

`app/(inbox)/label/[label]/page.tsx` + `generateStaticParams()` + `dynamicParams = false`.
One prerendered HTML file per label — exactly the pattern `/email/[slug]` already uses
successfully (it produces `● (SSG)`).

**Why, in order of weight:**

1. **It's the only option that satisfies the hard constraint.** Query params don't fail on
   style — they fail on the quoted sentence above. Every page reading `searchParams` becomes
   `ƒ (Dynamic)` in the build table. That's the constraint the whole project is organised around.
2. **The composability tradeoff is theoretical here.** Path segments can't express
   `?label=ts&starred=1`. But Tier 1 has exactly **one** filter dimension — and real Gmail
   doesn't compose either: its label view is a path (`#label/react`), Starred is a separate
   folder, and combining them happens in the **search box** (`label:react is:starred`).
   Modelling Gmail's actual information architecture _removes_ the tradeoff rather than paying it.
3. **There's a clean escape hatch.** If composition is ever genuinely needed, build `/search`
   as **one deliberately-dynamic route** that reads `searchParams`. That contains dynamism to
   a single leaf that _should_ be dynamic, and leaves inbox, label, and reading routes fully
   static. Better architecture than making everything dynamic for a hypothetical.
4. **`cacheComponents`/PPR is rejected — for M4 and probably forever here.** PPR solves
   "static shell with a dynamic hole." This app has **no dynamic hole**: every byte is a typed
   TS module known at build time. Enabling it would flip the whole app's default to dynamic,
   require auditing every component for `use cache`, change `loading.js`, and enable
   `<Activity>` state preservation that changes dialog/dropdown behaviour on navigation. Large,
   risky, whole-app migration for zero benefit. (M8's chat is a client island, so even that
   doesn't qualify.)

**Honest costs:** no multi-filter URLs (accepted). Route count grows with labels — ~10 after
the content cull, but **74 today**, which is itself an argument for culling first. Adding a
label needs a rebuild (irrelevant; every deploy is a rebuild).

### The sidebar active-state problem — exact solution

**It costs exactly one client component. Budget 2/8 → 3/8.**

New: `components/layout/nav-row.tsx`, `"use client"`, using `usePathname()`.

Why it must be client, and why the alternatives lose:

- The sidebar renders in `app/(inbox)/layout.tsx`, which is client-cached and will never see
  the pathname. Not fixable server-side.
- **CSS-only is impossible — for a11y reasons, not styling.** You could emit a per-page
  `<style>` targeting `[data-nav="label/react"]` and get the highlight with zero JS. But the
  active row must carry **`aria-current="page"`** in the DOM, and CSS cannot set attributes.
  A11y is non-negotiable, so this is dead. Say it out loud rather than discovering it in an audit.
- **Moving `<Sidebar/>` into every page** would work with zero client JS (a page knows its own
  identity and can pass `activeHref` down). Rejected: it re-serialises the entire sidebar into
  the RSC payload of ~45 routes and destroys the layout cache, so every client navigation
  re-downloads it. Worse for the perf budget than one tiny island.

**The shape that keeps the cost at ~1KB — a leaf island receiving server-rendered `children`:**

```tsx
// components/layout/nav-row.tsx — client #3
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavRow({ href, exact = false, children }: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={/* … */}
    >
      {children}
    </Link>
  );
}
```

Called from the **server** `Sidebar` as
`<NavRow href="/" exact><Inbox size={20}/><span>Inbox</span></NavRow>`.

Because `<Inbox/>` is created on the _server_, **lucide-react never enters the client bundle** —
only `NavRow`'s ~15 lines do. Same island pattern `mobile-sidebar-toggle.tsx` already uses
correctly. **This is the single best teaching moment in M4:** the client/server boundary is a
_value_ boundary, not a subtree boundary.

Two details that will bite:

- The sidebar currently switches the icon's `fill` when active. The icon is now server-rendered,
  so the client can't change its props. Style from the parent instead:
  `[&[aria-current=page]_svg]:fill-current`. CSS `fill` overrides lucide's `fill="none"`
  presentation attribute, so this works.
- Match rules, get them explicit before writing: `/` → Inbox (`exact`); `/email/<slug>` → Inbox
  also active (reading a project is still Inbox context, so Inbox needs a second prefix href to
  match); `/label/react` → only that label row.

---

## Part 1 — Code audit findings (all verified against source)

Not in `PROGRESS.md`; these change the plan.

**Blocking / correctness**

1. **`/important` is a dead link → verified HTTP 404.** `components/layout/sidebar.tsx:16`
   links to `/important`; no such route exists. A 404 in the primary nav cannot ship.
   → **M4** neutralise, **M6** build.
2. **`c#` cannot be a URL path segment.** `content/types.ts:17` has label `"c#"`; `#` starts a
   fragment, so `/label/c#` silently breaks. `socket.io` (line 68) and `react-native` are legal
   but need deliberate slugs. Forces a `Label → slug` map. → **M4**.
3. **`--gmail-blue` has no dark override but is still used.** Verified: zero occurrences inside
   the `[data-theme="dark"]` block, yet `components/email/signature.tsx:9` uses
   `text-[var(--gmail-blue)]`. In dark mode that renders `#1a73e8` on `#1e1f20` — a real
   contrast failure. `PROGRESS.md` claims `--gmail-accent` replaced the pair; the replacement is
   **incomplete**. → **M5** a11y, or fix immediately (one token).
4. **`inbox-tabs.tsx:41` sets `aria-current="page"` unconditionally** on every `Link`. Harmless
   only because Promotions/Social are `href="#"` today. The moment M6 makes them real, three
   tabs claim to be current. → fix in **M4** while nearby.
5. **Stars and checkboxes are interactive lies.** `email-row.tsx`, `list-toolbar.tsx` and the
   reading view render `<button aria-pressed>` and `<input type="checkbox">` that do nothing. A
   keyboard user tabs ~90 dead controls on the inbox, and `aria-pressed` announces a toggle that
   can't toggle. Decide per control: non-focusable `<span>` (stars — they _display_ "best work"),
   or delete (row checkboxes). → **M5**.
6. **`h-screen` at `app/(inbox)/layout.tsx:13`.** `100vh` on mobile Safari/Chrome includes the
   collapsible URL bar, clipping the card. Use `h-dvh`. Also the scroll container is the inner
   card `<div>`, not the document — which disables mobile address-bar collapse and
   pull-to-refresh. Confirm that's intentional. → **M5**.

**Hygiene**

7. `README.md` is still create-next-app boilerplate.
8. `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — unused CNA leftovers
   shipping to the CDN (verified present).
9. `next.config.ts` commits `allowedDevOrigins: ["10.10.28.190"]` — a LAN IP in the repo.
10. `content/email.ts` (singular) exports `emails` (plural). Rename while rewriting content.
11. `formatEmailDate(iso, now = new Date())` reads the clock at render time — correct at build,
    but the "Jul 20" vs "Jul 20, 2025" boundary shifts silently at New Year without a rebuild.
    Not a bug; know it exists.
12. **The search form does nothing.** `topbar.tsx` is `<form method="get" action="/">` with
    `name="q"`, and `app/(inbox)/page.tsx` ignores it. A prominent focusable control that
    silently no-ops — and exactly the feature that _would_ need `searchParams`. → decide in **M6.8**.

---

## Part 2 — Pre-deploy debt: milestone assignment

| Debt                                                        | Assigned                   | Reasoning                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **30 fabricated filler emails**                             | **M4.0** _(moved earlier)_ | Not cosmetic — it's an **input to M4's design**. `generateStaticParams()` reads the label set: today that's **74 labels** across 31 emails, ~60 appearing exactly once. Building against fabricated data means prerendering 60 near-empty routes and a 74-row sidebar, then redoing it in M5. Cull first. |
| **Wordmark reads "Gmail"**                                  | **M5.1**                   | Blocks public deploy. Also feeds metadata title, OG image, favicon — do it once _before_ those are authored.                                                                                                                                                                                              |
| **`metadata.description` = "Generated by create next app"** | **M5.5**                   | Part of the metadata sweep.                                                                                                                                                                                                                                                                               |
| **Print button unwired (= resume download)**                | **M6.6**                   | Genuinely blocked on the PDF existing. Zero-JS implementation available.                                                                                                                                                                                                                                  |
| **Hardcoded `portfolio@thakursaad.dev`**                    | **M6.7**                   | Content-model gap (`Email` has no `senderEmail`) tangled with the unresolved sender-voice question. One decision, make it once.                                                                                                                                                                           |
| **Mobile drawer animation unverified**                      | **M5.2**                   | Needs a real browser. Batch with `prefers-reduced-motion` work.                                                                                                                                                                                                                                           |
| `/important` 404                                            | **M4.7**                   | Nav integrity.                                                                                                                                                                                                                                                                                            |
| `--gmail-blue` dark contrast                                | **M5.4**                   | A11y.                                                                                                                                                                                                                                                                                                     |
| Fake interactive controls                                   | **M5.4**                   | A11y.                                                                                                                                                                                                                                                                                                     |
| README / unused CNA assets                                  | **M5.8**                   | Deploy hygiene.                                                                                                                                                                                                                                                                                           |

---

## M4 — Labels → URL-based filtering

**Goal.** `/label/<slug>` is a real, shareable, statically-prerendered URL showing only the
projects using that skill; the sidebar lists real labels and highlights the active one; label
chips navigate there. Zero route-specific client JS beyond one 15-line nav island.

**Learning objective.** _The URL is the state store._ Three years ago this was
`const [activeLabel, setActiveLabel] = useState(null)` plus `emails.filter(...)` in the browser
— invisible to the address bar, unshareable, unindexable. Now filtering happens **once, at build
time**, and the router is the state container. Sub-lessons: `generateStaticParams` is
`getStaticPaths` reborn; `dynamicParams = false` turns unknown params into 404s instead of
on-demand renders; and **the client/server boundary is a value boundary** — a client component
can render server-created elements passed as `children` without that code reaching the browser.

### Steps

**M4.0 — Content cull.** Delete the 30 filler emails; keep `server-setup-template`. Add real
projects only as they're actually written. Rename `content/email.ts` → `content/emails.ts` and
update importers.
_Files:_ `content/email.ts` → `content/emails.ts`, `lib/emails.ts`, `app/(inbox)/email/[slug]/page.tsx`, `components/layout/sidebar.tsx`.
_Note:_ the build drops from 31 SSG pages to however many real projects exist. **That is the
correct number.** Depth beats breadth.

**M4.1 — Narrow the `Label` union.** With filler gone, most of the 74 labels are unreferenced.
Delete them. The compiler won't flag extra union members, so this is a manual read-through — but
afterwards `Record<Label, string>` becomes maintainable rather than absurd.
_File:_ `content/types.ts`.

**M4.2 — `lib/labels.ts`.** Three exports:

- `LABEL_SLUGS: Record<Label, string>` — **explicit, not derived.** Because it's a `Record` over
  the union, **adding a label without a slug is a compile error.** Same philosophy as the block
  renderer's `never` check: the compiler is the test. Handles `"c#" → "csharp"`,
  `"socket.io" → "socket-io"`.
- `slugToLabel(slug): Label | undefined` — reverse map built once at module scope.
- `emailsByLabel(label)` reusing `sortedEmails` so ordering stays consistent, plus
  `labelsInUse()` with counts for the sidebar.
  _File (new):_ `lib/labels.ts`.

**M4.3 — The route.** `app/(inbox)/label/[label]/page.tsx` with `dynamicParams = false`,
`generateStaticParams()` returning `labelsInUse().map(l => ({ label: LABEL_SLUGS[l] }))`, body
awaits `params`, calls `slugToLabel`, `notFound()`s on miss. Mirror
`app/(inbox)/email/[slug]/page.tsx` — already the correct pattern.

**M4.4 — Extract the shared list.** Inbox and label pages render the same thing with a different
array and header. Pull `<ListToolbar> + <ul>` into `components/inbox/email-list.tsx` (Server
Component; props `emails: Email[]`, `heading: string`). Inbox keeps `<InboxTabs/>` above it; the
label page renders a label header instead (tabs are meaningless under a label filter).

**M4.5 — `generateMetadata` on the label route.** Six lines returning
``{ title: `${label} — Inbox` }``. Teaches the async/dynamic variant of the Metadata API next
to the static `metadata` object in `app/layout.tsx`, and it's free because
`generateStaticParams` already ran.

**M4.6 — `components/layout/nav-row.tsx` (client #3).** As specified in Part 0. Include the
budget justification comment:
`// Client: usePathname() — a cached layout can never know the active route.`

**M4.7 — Rewire the sidebar.** Replace the `href === "#" ? <a> : <Link>` branching with
`NavRow`; delete the `const isActive = href === "/"` hack and its stale comment; populate the
Labels section (currently an empty stub) from `labelsInUse()`; **remove/disable `/important`**
until M6. Keep `Starred`/`Sent`/`Drafts` as non-navigable rows — but **non-focusable**, not
`<a href="#">`.

**M4.8 — Label chips become links.** In `app/(inbox)/email/[slug]/page.tsx` the chips are inert
`<span>`s. Make them ``<Link href={`/label/${LABEL_SLUGS[label]}`}>``. This is `concept.md`'s
"labels are the connective tissue" becoming real. Optionally also on inbox rows — Gmail does;
skip if the row gets crowded.

### Acceptance criteria

- `pnpm build` lists `/label/[label]` as `● (SSG)`, one entry per in-use label, and **no route
  marked `ƒ (Dynamic)`**.
- `pnpm typecheck` + `pnpm lint` pass.
- Adding a `Label` member without a `LABEL_SLUGS` entry is a **type error**.
- `/ → /label/react → /email/x` highlights Inbox, then `react`, then Inbox — with
  `aria-current="page"` on exactly one row at a time.
- No new route-specific client chunk beyond the nav island.
- **Client components: 3 of 8.**

### Risks

- **`c#` in a URL.** Don't skip M4.2; a naive `` `/label/${label}` `` ships a broken link.
- **`dynamicParams = false` + a typo'd slug = a silent 404**, not a build error. The
  `Record<Label, string>` map prevents this — don't replace it with a `slugify()` that could collide.
- **74 sidebar `<Link>`s would be a real perf problem.** Next 16 `prefetch="auto"` prefetches the
  full route for static routes on viewport entry in production. Post-cull (~10 labels) it's fine
  and beneficial. Past ~20, put overflow behind Gmail's "More" and/or `prefetch={false}`.
- **`generateStaticParams` runs on navigation during `next dev`.** Dev won't tell you whether the
  route actually prerendered — `pnpm build` is the only honest check.

### Test recommendation

Still **no test suite**. The only defensible candidate is the active-match logic
(`/` vs `/email/x` vs `/label/x`). Prefer the compile-time guarantee for slugs. Keep the match
logic to ~4 lines inside `nav-row.tsx` and verify by clicking; if it grows past that, extract to
`lib/nav.ts` and _then_ it earns one test file — say so at that point, not pre-emptively.

---

## M5 — Responsive, a11y, SEO, deploy, verify budget

**Goal.** Genuinely good on a phone, genuinely usable by keyboard and screen reader, correctly
described to crawlers and social cards, live on Vercel, and **measured** against the budget
rather than assumed to meet it.

**Learning objective.** Metadata as a **server API**, not a component — `react-helmet` and
`<Head>` are gone. `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` are **file conventions that
compile to routes**, which is genuinely new versus 2022. Plus `next/font` self-hosting vs
`<link rel=stylesheet>`, and Tailwind v4's CSS-first responsive model.

### Steps

**M5.1 — Wordmark.** Replace "Gmail" in `topbar.tsx` with the user's own mark. Rename
`aria-label="Google apps"`. Honest legal read: replicating Gmail's _layout_ for an obvious
personal portfolio is trade-dress territory and low risk; shipping the actual **wordmark** is
straightforward trademark exposure. The wordmark is the part that must go.
_Files:_ `components/layout/topbar.tsx`, `app/favicon.ico`.

**M5.2 — Real-browser pass.** Open in actual Chrome — **not** the automation browser. Verify the
mobile drawer slide, row hover shadows, theme-toggle flip with no flash. Add
`@media (prefers-reduced-motion: reduce)` for the drawer transform and row transitions.

**M5.3 — Responsive.** Audit at 360 / 414 / 768 / 1024 / 1440. Known: `h-screen` → `h-dvh`;
`email-row.tsx` pins sender to `w-[180px]`, wrong at 360px — real Gmail mobile stacks
sender-above-subject in a two-line row with a bigger touch target. This is the _"mobile is a
different layout, not a squeezed one"_ clause. Also check the reading view's `px-4 md:px-16` and
`md:pl-14`.

**M5.4 — A11y sweep.**

- Global `:focus-visible` ring in `globals.css` — currently only the row `<Link>` has one; every
  icon button in topbar/list-toolbar/reading-toolbar has none.
- Resolve the fake controls (finding 5).
- Fix `--gmail-blue` → `--gmail-accent` in `signature.tsx`; delete `--gmail-blue`,
  `--gmail-blue-dark`, `--gmail-selected-dark` if unused.
- Landmarks + heading order: one `<h1>` per route, `<nav>`s labelled.
- **Keyboard-walk the whole site with the mouse unplugged.**

**M5.5 — Metadata.** `app/layout.tsx`: real `description`,
`metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")`,
`title: { default, template: "%s — <name>" }`, `openGraph`, `twitter`. Then `generateMetadata`
on the email route using subject + snippet.
_Landmine:_ without `metadataBase`, Next warns at build and emits `localhost` URLs into OG tags.

**M5.6 — OG images.** `app/opengraph-image.tsx` (site-wide) and
`app/(inbox)/email/[slug]/opengraph-image.tsx` (per project — statically generated because
`generateStaticParams` exists on that segment). `ImageResponse` from `next/og`,
`export const size = { width: 1200, height: 630 }`, `alt`, `contentType`.
_Landmine:_ `ImageResponse` needs **raw font bytes** via `readFile`. **`next/font/google` fonts
are not available as a readable `.ttf`** — commit one (e.g. `assets/Roboto-Medium.ttf`) or fetch
at build. It does _not_ ship to the browser, so no client-budget cost, but people miss this.
Design the card as a Gmail row. `next/og` runs Satori: **flexbox only — `display: grid` will not
work** — no CSS variables, no Tailwind. Also a **500KB hard bundle cap** covering JSX + CSS +
fonts + images combined, and only `ttf` / `otf` / `woff` fonts (prefer `ttf`/`otf` for parse speed).

**M5.7 — `sitemap.ts` + `robots.ts`.** `app/sitemap.ts` returning `MetadataRoute.Sitemap` from
`sortedEmails` + `labelsInUse()` + static routes, using each email's `date` as `lastModified`
(the `IsoDate` type is directly assignable). `app/robots.ts` returning `MetadataRoute.Robots`
with `sitemap:` pointing at the deployed origin.

**M5.8 — Hygiene.** Rewrite `README.md`. Delete unused `public/*.svg`. Decide on
`allowedDevOrigins`.

**M5.9 — Deploy.** Vercel, pnpm auto-detected. Set `NEXT_PUBLIC_SITE_URL`. **Do not** set
`NEXT_PUBLIC_API_URL` — unset through M6 by design.

**M5.10 — Verify the budget, don't assume it.** Lighthouse mobile in real Chrome **against the
deployed URL** — localhost has no network shaping and no CDN, so the number is meaningless.
Confirm ≥98, LCP <1.2s Slow 4G, CLS ≈0. Read the build route table: everything `○` or `●`,
nothing `ƒ`. Check First Load JS is framework baseline + the nav island only. **If a number
misses, fix it before M6. This is the gate.**

### Acceptance criteria

- Live URL. Lighthouse mobile Performance ≥98 **and Accessibility 100**.
- `/sitemap.xml` and `/robots.txt` correct on the deployed site.
- OG cards render in a validator for `/` and one `/email/<slug>`.
- **No Google wordmark, logo, or brand asset** anywhere in repo or rendered page.
- Full keyboard traversal, visible focus on every focusable element, **no focusable element that
  does nothing**.
- Client components still **3 of 8**.

---

## M6 — Remaining Tier 1 → frontend complete

**Goal.** Promotions, Contacts/About, resume download, Starred, Skills, and the Compose UI shell.
After this the frontend is feature-complete and only the backend is missing.

**Learning objective.** _Model variants in the type system, not in components._ Instead of a
`TestimonialCard` parallel to `EmailRow`, add a discriminated `category` to `Email` and let one
renderer serve every tab — the compiler then **forces every existing email to be categorised**.
Same lever as the block renderer's `never` check, one level up. Second lesson: **a file download
needs zero JavaScript.**

### Steps

**M6.1 — `category` on `Email`.** `category: "primary" | "promotions" | "social"`, **required**.
Every existing email becomes a type error until categorised — that's the point. Add
`emailsByCategory()` to `lib/emails.ts`.

**M6.2 — Promotions + Social routes, real tabs.** `app/(inbox)/promotions/page.tsx` and
`app/(inbox)/social/page.tsx`, both reusing `email-list.tsx` from M4.4. Convert `inbox-tabs.tsx`
to real `NavRow`s (reuses client #3 — **no new budget cost**) and **fix the unconditional
`aria-current`**. Author testimonials/certs as emails: sender = issuing body, subject =
"You've earned it: …", per `concept.md`.

**M6.3 — Starred.** `app/(inbox)/starred/page.tsx` — same list filtered on `starred`. Ten minutes
because M4.4 did the extraction. Enable the sidebar row.

**M6.4 — Skills / Important.** `content/skills.ts` with `Skill` (`label`, `proficiency`, `years`,
`story`), and `app/(inbox)/important/page.tsx` rendering them as flagged rows. Each links to
`` `/label/${LABEL_SLUGS[skill.label]}` `` — where M4's `lib/labels.ts` pays off and the
connective-tissue idea closes the loop. Re-enable the sidebar `/important` link.

**M6.5 — Contacts / About.** `app/(inbox)/contacts/page.tsx`. Entry point: make the topbar
apps-grid button a `<Link href="/contacts">`. **Recommendation: do not build the right-edge
app-switcher rail** (the "unscheduled" item in `PROGRESS.md`). It's Tier 2 chrome and the
apps-grid link gives Contacts a home today. Revisit when Calendar/Meet exist.

**M6.6 — Resume download.** Put the PDF at `public/<name>-resume.pdf` and change
`reading-toolbar.tsx` from `<button aria-label="Print">` to
`<a href="/<name>-resume.pdf" download aria-label="Download resume (PDF)">`. **Zero client JS,
zero budget cost — do not reach for `window.print()`.** Note the PDF's size against the budget.

**M6.7 — Sender voice + `senderEmail` + role.** Resolve the open question: `sender` mixes "who"
(Client Work) with "what" (Personal Project). Pick one axis. Add `senderEmail` to `Email`,
replacing the hardcoded address. **Also schedule `notes.md` item 2 here** — the role taxonomy
(backend built / collaborated / project lead / PM) is naturally a `role` field rendered as a
Gmail chip. Cheap, and a genuinely good differentiator for a backend dev.

**M6.8 — Decide the search box.** Pick one, don't ship a control that lies: (i) delete it;
(ii) keep visually, non-submitting and non-focusable; (iii) build `/search` as **the one
deliberately-dynamic route** reading `searchParams` — which also restores the multi-filter
capability path routing gave up. **Recommend (iii)** if there's appetite, (ii) otherwise. If
(iii): one `ƒ (Dynamic)` row in the build table is **fine and correct** — it's the Part-0 escape
hatch, not a violation.

**M6.9 — Compose UI shell (client #4).** _Scope note: the kickoff table puts compose under M7,
but also says "build the UI fully" during M0–M6. Resolving that: **UI here, wiring in M7**._
`components/compose/compose-window.tsx`, `"use client"`, React 19 `useActionState` with
`<form action={…}>`. Fields per the backend contract: `name`, `email`, `subject`, `message`, plus
honeypot. With `NEXT_PUBLIC_API_URL` unset it renders "not connected yet". **No mock server.**

**M6.10 — Reference cards (consent-gated).** Build only the visible half: name, relationship,
photo — **no contact details, not even behind a conditional** (View Source defeats hiding). The
request form is M7. **Do not commit real names until the user confirms he has had those
conversations.**

### Acceptance criteria

- Every Tier 1 bullet in `concept.md` has a real route with real content — no empty folders, no
  `href="#"` in the nav.
- All routes `○`/`●`, except `/search` if option (iii).
- **Client components: 4 of 8.**
- Adding an email without `category` is a type error.
- Lighthouse mobile still ≥98 after content grows.

### Risks

- Compose is the first client component with real state. **The theme-toggle lesson applies:**
  nothing in the initial render may differ between server and client. Render the empty form
  identically on both; let `useActionState`'s pending/result states appear only after interaction.
- **Scope creep is most likely here.** Trash easter eggs, Spam, Purchases, Drafts, storage meter,
  ⋮ menu are all Tier 2/3. Push back.

---

## M7 — Backend cleanup + compose → `POST /contact`

**Goal.** Fork and reduce the template per `backend-requirements.md`; `/contact` works end to end;
the frontend change is a **config change, not a refactor**.

**Learning objective.** React 19's `useActionState` + `<form action>` replaces `onSubmit` + three
`useState`s for pending/error/success — **pending state comes from the framework, and the form
works before hydration.** Plus typing a fetch wrapper against a shared envelope so the compiler
catches contract drift.

### Steps

**M7.1 — Fork and delete-down.** Per the audit table: delete `admin/`, `user/`, `review/`,
`feedback/`, `manage/`, `notification/`, `chat/`, `fileUploader`, Stripe. Reduce `auth/` to
`login` / `refresh-token` / `change-password`. **The user is an expert here — hand him the
checklist, not a tutorial.**

**M7.2 — `POST /contact`.** Zod discriminated union on `kind` (`"compose"` | `"reference"`),
honeypot must be empty, rate limiter on. **Persist before send. Return 202 immediately, send
outside the request cycle. `Reply-To` for the visitor; `From` stays the service address** —
these three are called out because getting them wrong is invisible until it matters.

**M7.3 — `lib/api.ts` (the seam).** Base URL from `NEXT_PUBLIC_API_URL`, typed
`ApiEnvelope<T> = { success: boolean; message: string; data: T }` matching
`sendResponse`/`globalErrorHandler`, and `postContact()` narrowing errors.
**No secret in a `NEXT_PUBLIC_` variable** — those compile into the browser bundle.

**M7.4 — Wire compose.** Point the action at `postContact`. Handle 202, 429, and network failure
**distinctly** — a recruiter hitting a silent failure is a lost lead.

**M7.5 — Reference request form.** Same client component, different `kind` and fields
(`organization`, `referenceSlug`). **Reuse `compose-window.tsx` generically rather than adding
client #5.**

**M7.6 — CORS + deploy.** Allow-list the Vercel production domain (plus previews if wanted). Set
`NEXT_PUBLIC_API_URL` in Vercel, redeploy.

### Acceptance criteria

- A compose submission lands in the real Gmail inbox with a working Reply.
- Response is not gated on the SMTP handshake.
- **Client components: 4 of 8.**
- Rate limit demonstrably triggers.

### Risks

- CORS misconfiguration is the classic first-deploy failure; preview deployments rotate subdomains.
- Personal Gmail SMTP caps ~500/day and lands in corporate spam filters. Fine for v1; a dedicated
  sending domain is a config change later.

---

## M8 — Live chat widget

**Goal.** A Gmail-style chat panel in the sidebar with honest presence, adding **zero** bytes to
the initial bundle until opened.

**Learning objective.** Route-level code splitting isn't enough — `await import()` **inside an
event handler** is how you keep a 40KB dependency out of the initial payload. And why a presence
check must _not_ be a Server Component fetch.

### Steps

**M8.1 — Backend chat.** Conversation + Message models, anonymous socket handshake
(`{ auth: { visitorId } }`), owner handshake by JWT, **`from` derived from the connection, never
from the payload**, `GET /presence`, message length cap, retention job.

**M8.2 — `components/chat/chat-widget.tsx` (client #5).** Collapsed by default. Socket client
loaded **only on open**: `const { io } = await import("socket.io-client");` — not at module
scope, not a top-level import. **Verify in the Network tab that no socket chunk loads until the click.**

**M8.3 — Presence dot.** `GET /presence` over plain HTTP **from the client**, not a Server
Component. _This is the landmine:_ fetching presence in a Server Component makes that page
dynamic and silently destroys the static guarantee for the entire layout. Fetch in `useEffect` or
on first interaction. **Reserve the dot's box in the initial HTML** so it doesn't shift layout —
CLS is in the budget.

**M8.4 — Offline path.** When `online: false`, require an email before accepting a message. A
recruiter typing at 2am into silence is worse than no chat at all.

**M8.5 — Content safety.** Render bodies as **text**. Never `dangerouslySetInnerHTML`.

### Acceptance criteria

- Initial bundle unchanged vs M7; socket chunk appears **only after** opening the widget.
- CLS still ≈0.
- **Client components: 5 of 8.**
- The dot never claims "online" when the owner socket is disconnected.

### Risks

- **Hosting.** WebSockets need a persistent process. Serverless is out; free tiers that sleep make
  the chat look broken on the _first_ message — the worst possible time. **A decision, not a detail.**
- Reconnect/backoff and surviving a laptop sleep are the actual hard parts, not the UI.

---

## M9 — Owner inbox for chat

**Goal.** A way for the owner to read and reply. `backend-requirements.md` explicitly warns this
is "the hidden half" — most of the work, easy to miss when planning.

### Recommendation: split it, ship the cheap half first.

**M9a — Email/Telegram bridge (build this).** Every new visitor message triggers a notification
with the body and a reply link. **Zero new UI, zero new auth surface on the public site**, and it
makes chat useful immediately. `backend-requirements.md` offers this explicitly. Take it.

**M9b — Owner inbox UI (optional, only if M9a proves insufficient).** If built:

- **Separate route group with its own root layout**: `app/(owner)/owner/…`. A route group with no
  `layout.tsx` above it becomes its own root layout, which means (i) its inevitable dynamic
  rendering **cannot leak** into the static portfolio, and (ii) navigating between the two
  triggers a full page load — which is **correct**; they're different apps.
- `disallow: "/owner"` in `robots.ts`; exclude from `sitemap.ts`.
- Login form + JWT in an **httpOnly cookie. Never `localStorage`.**
- It will need `useState`/polling. Fine — but **state it explicitly and count it** rather than
  letting the 8-component budget quietly become meaningless.

**Learning objective.** Containing a dynamic, authenticated area inside a statically-rendered
site — multiple root layouts, route groups, and why the full page load between them is a feature.

### Risk

This is where "portfolio" and "product" diverge. A half-built owner inbox is worse than none, and
it's **invisible to every recruiter who visits.** Treat M9b as genuinely optional.

---

## Part 3 — Flags: unscheduled, mis-tiered, risky

### Document contradictions worth correcting

1. **Starred.** `concept.md` says Tier 2; the kickoff's M6 row says "remaining Tier 1."
   Scheduled M6.3 (ten minutes after M4.4) — but the docs disagree; fix one.
2. **References.** `concept.md` lists the reference system as **Tier 1**, but the request flow
   depends on `POST /contact` = **M7**. A Tier 1 item structurally cannot complete before a
   Tier 2-era milestone. Split: cards M6.10, request form M7.5. Worth correcting in `concept.md`.
3. **Compose.** Tier 1 in `concept.md`, M7 in the kickoff table, "build the UI fully" in the
   M0–M6 text. Resolved as M6.9 (UI) + M7.4 (wiring).

### `notes.md` item 1 — unread/"new" behaviour. **The risky one.**

A "new" badge on first visit, bold until opened, clearing only after opening that specific email,
and sidebar counts that decrement. That is **per-visitor mutable state**, fundamentally at odds
with "everything statically rendered" and "no global state library." It can only live in
`localStorage`.

And it is **precisely the shape of bug that already cost real time on this project.** If React
reads `localStorage` during initial render to decide whether a row is bold, the server renders one
thing, the client another, hydration mismatches, and React discards the server HTML — the exact
failure documented in the theme-toggle story, which also wiped the anti-flash script's work on
`<html>`.

If built, it must follow the theme-toggle pattern exactly:

- an inline script in `app/layout.tsx` reads `localStorage` **before paint** and sets an attribute
  (e.g. `data-read="a,b,c"`) on `<html>`;
- **CSS** decides which rows are bold, via an attribute selector — **no React state during initial
  render**;
- one client component writes to `localStorage` on open (client #6).

Also: sidebar counts currently derive from `email.read`, a build-time constant. Per-visitor counts
mean the number in the server HTML is wrong for every returning visitor until the script corrects
it — a visible flicker unless CSS-driven too.

**Recommendation: Tier 3, post-launch, explicitly out of scope for M4–M9.** Genuinely interesting,
and genuinely the highest-risk item in the wishlist. Do not let it in before the site is deployed
and good.

### `notes.md` item 2 — role categories

Backend built / collaborated / lead / PM. Low risk, high value for this user, just another field
on `Email`. **Pulled forward into M6.7** rather than left as "later."

### Deliberately not scheduled

- **Right-edge app-switcher rail** — don't build it; the apps-grid link gives Contacts a home, and
  the rail can't be designed until Calendar/Meet exist.
- **Account switcher / recruiter-vs-peer view** (`concept.md` Deferred) — no cheap implementation:
  either two full sets of static routes, or client state re-rendering content (a bundle-size
  cliff). If ever, do `/r/…` and `/e/…` route prefixes, statically.
- **Trash easter eggs, Spam, Purchases, Drafts, Snooze, Updates, Forums, Sent, storage meter,
  ⋮ menu, drag-and-drop, live GitHub unread count** — all Tier 2/3. The storage meter is the
  cheapest genuinely-charming one if something Tier 2 gets built early.

### Consent gates — do not let these reach a commit unconfirmed

- **Trash easter eggs** quoting family and friends: exact wording OK'd, or rewritten as the user's
  own memory ("You (Note to self)").
- **Named references:** colleagues must agree before appearing on a public site, **even name-only**.

### Testing

No test suite in v1, and nothing in M4–M9 changes that. Both candidates were considered and
rejected in favour of compile-time guarantees: `Record<Label, string>` makes a missing slug a type
error; the existing `never` check makes an unhandled block a type error. The one honest exception
is the nav active-match logic **if** it grows past ~4 lines — then extract to `lib/nav.ts` and
write one test file, not a testing infrastructure.

### Client component budget, projected

| #   | Component                    | Milestone | Justification                                                  |
| --- | ---------------------------- | --------- | -------------------------------------------------------------- |
| 1   | `theme-toggle.tsx`           | ✅ done   | needs `onClick`; stateless by design                           |
| 2   | `mobile-sidebar-toggle.tsx`  | ✅ done   | holds `open`; receives server `<Sidebar/>` as children         |
| 3   | `layout/nav-row.tsx`         | M4        | `usePathname()` — a cached layout cannot know the active route |
| 4   | `compose/compose-window.tsx` | M6/M7     | form state; serves both compose and reference kinds            |
| 5   | `chat/chat-widget.tsx`       | M8        | socket lifecycle + dynamic `import()`                          |
| —   | _reserve ×3_                 |           |                                                                |

**5 of 8 at full scope.** Comfortable. The two things most likely to consume the reserve are the
`notes.md` unread behaviour (client #6) and an owner-inbox UI (M9b) — **both of which this plan
recommends deferring or skipping.**

---

## Milestone tracker

Tick these as they complete, and update `PROGRESS.md` at the end of each.

- [x] **M0** scaffold, tokens, fonts, light/dark
- [x] **M1** shell — layout, sidebar, topbar, theme toggle, mobile drawer
- [x] **M2** types, content, inbox list
- [x] **M3** reading view, block renderer, signature, one case study
- [x] **Design pass** — full Gmail-fidelity refactor
- [ ] **M4** labels → URL filtering
- [ ] **M5** responsive, a11y, SEO, deploy, verify budget
- [ ] **M6** remaining Tier 1 → frontend complete
- [ ] **M7** backend cleanup + compose → `POST /contact`
- [ ] **M8** live chat widget
- [ ] **M9a** chat notification bridge · **M9b** owner inbox _(optional)_
