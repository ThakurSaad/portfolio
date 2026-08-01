# Project brief — Gmail Portfolio (frontend)

> **Revision 2 — 2026-08-01.** Rewritten after M0–M3 shipped. Corrects three
> things the original got wrong, and records decisions that were made by
> hitting real problems rather than by planning. Original is in git history.
> **Current state lives in `PROGRESS.md` at the repo root — read it too.**

## Who I am

I'm a backend MERN developer. I write TypeScript on the server every day and I'm comfortable with Node, Express, MongoDB, JWT, and API design. **My frontend is rusty:** the last React I wrote was ~3 years ago (hooks era, CRA, plain CSS/styled-components). Before this project I had **never used Next.js**, never used **TypeScript in a frontend codebase**, and never used **Tailwind or shadcn/ui**. Don't over-explain general programming, TypeScript syntax, or backend concepts — I already know those.

This is deliberately a learning vehicle. I want to come out of it actually understanding modern frontend, not with a repo I can't maintain.

**On explanations:** keep them short and plain. Lead with the mechanism in one or two sentences, then the code. I asked for this explicitly mid-project — long conceptual preambles were making things harder to follow, not easier. If I ask "why," _then_ give me the full answer with tradeoffs.

## How I want you to work with me

**Do not write application code into files unless I explicitly ask you to.** For each step:

1. Explain the concept briefly — especially where it differs from React 3 years ago.
2. Show a minimal illustrative snippet, 15 lines max. Enough to unblock me, not the finished file.
3. Tell me exactly which file to create or edit, and where it goes.
4. **Stop and wait.** I write it. I'll tell you when it's done.
5. Then review what I wrote. Be blunt — call out anywhere I wrote it like it's 2022, anywhere I reached for client state when the server or the URL should own it, anywhere the types are weaker than they should be.

When I say "you decide" / "proceed" / "fix what needs fixing," that _is_ explicit permission to write code directly. Do the work, then report what changed and why.

You **may** freely, without asking: run shell commands (installs, builds, dev server), read files, inspect my code, run the linter and typechecker, and check current docs.

**I handle git commits myself.** Don't commit unless I ask.

Go one step at a time. Don't dump three milestones at once.

## Read these first

1. **`docs/instructions/concept.md`** — the locked product concept and tiered feature list. Authoritative on _what_ we build.
2. **`PROGRESS.md`** (repo root) — what's actually built right now.
3. **`docs/instructions/backend-requirements.md`** — only its "Contract the frontend codes against" section matters before M7.
4. **`docs/others/notes.md`** — my running list of features I want later.

My backend template lives at `C:\Users\thakursaad\projects\server-setup-template-updated` — irrelevant until M7, don't read it yet.

## The project in one line

A personal portfolio built as a working Gmail inbox — projects are emails, skills are labels, the compose button is the "hire me" CTA.

## This phase is frontend only

**M0–M6 involve no backend whatsoever.** Build the entire static site, deploy it, confirm it's genuinely good — _then_ clean up my backend template, _then_ connect the two. A deployed portfolio with one excellent case study is already professionally useful to me; a half-finished backend is not.

No API-calling code beyond the one seam described below. If I get impatient and try to wire up the backend early, push back.

---

## Locked decisions

**Stack (as actually installed):** Next.js 16 App Router · React 19 · TypeScript `strict` + `noUncheckedIndexedAccess` · **Tailwind v4** · shadcn/ui · pnpm · Vercel. Windows + PowerShell.

> **Correction to revision 1:** shadcn now installs **Base UI** (`@base-ui/react`), _not_ Radix. Same guarantees — unstyled, accessible, focus traps, keyboard nav, ARIA — but don't write "Radix" in code or docs.
>
> **Correction to revision 1:** Tailwind v4 is **CSS-first**. There is no `tailwind.config.js`. Theme tokens are a `@theme` block in `app/globals.css`.

**Rendering — the core constraint.** Every page is statically rendered at build time and ships as close to zero client JavaScript as possible.

- Server Components are the default. `"use client"` is opt-in and rare.
- **Budget: 8 client components in the entire site**, each with a one-line comment justifying why it can't be a Server Component. If you think we need more, tell me why and I'll decide — don't quietly exceed it.
- **No global state library.** No Redux, no Zustand, no React Query. Local `useState` _inside_ an interactive island is fine. If I reach for a store to hold anything the server or the URL could own, stop me.

### State lives in the URL — but `searchParams` is NOT how

> **This is the biggest correction to revision 1.** The original said label filtering would be `/?label=typescript` read from `searchParams`. **That is incompatible with the static-rendering constraint** and cannot be reconciled — it isn't a style preference.

Per the Next 16 docs: `searchParams` is a **request-time API**, and using it _"will opt the page into dynamic rendering at request time."_ A page that reads `searchParams` is server-rendered per request, not a build-time HTML file on a CDN.

Two further hard facts that shape the layout:

- **`layout.tsx` never receives `searchParams`** — only `params`.
- **Layouts do not re-render on navigation.** They're cached client-side. So a layout cannot react to a changing query string at all.

The sidebar lives in a layout and needs to highlight the active label. That combination is why query-string filtering doesn't work here.

**The intended resolution (decide at M4, not before):** path segments instead of query strings — `app/label/[slug]/page.tsx` with `generateStaticParams()`, prerendering one static HTML file per label. This preserves the entire original intent: the URL owns the state, every filtered view is a shareable link, the server re-renders, zero client JS. It just uses a path instead of a query.

Tradeoff to weigh at M4: query params compose for multiple simultaneous filters (`?label=ts&starred=1`); path segments don't. A third option is `cacheComponents: true` (PPR), which prerenders a static shell and streams the dynamic part — more machinery, more to learn.

**Still teach the URL-as-state concept properly.** It's the single biggest shift from the React I learned. Only the mechanism changed, not the principle.

**Content model:** all portfolio content lives in typed `.ts` modules under `content/` — never a database. Email bodies are arrays of **discriminated-union blocks** (`paragraph | image | code | quote | callout | attachment`) rendered by a switch with an exhaustiveness check. Zero runtime weight; the compiler refuses to build if a block type is unhandled. That check _is_ the test — don't write a test for it.

**Routing:** nested layouts only. **No parallel or intercepting routes in v1.**

**Design:** the UI should read as real, modern Gmail — correct density, spacing, typography, color. Use shadcn/ui for _behavior_, then restyle to Gmail. Inbox rows are plain semantic elements, not shadcn components. Light and dark both work from day one.

**Mobile is a different layout, not a squeezed one.**

**Do not use Google's logo, wordmark, or brand assets.** ⚠️ **Currently violated** — the topbar wordmark reads "Gmail". I set that deliberately; it still needs replacing with my own mark before any public deploy. Keep flagging it.

---

## Hard-won technical constraints

These were discovered by hitting them. Don't re-derive them.

**Theming is a `data-theme` attribute, never a `.dark` class.**
`@custom-variant dark (&:is([data-theme="dark"] *))` in `globals.css`; dark values under `[data-theme="dark"] { }`.

**Never let React state decide something the server can't know.** The theme toggle originally used `useState` with a lazy initializer reading the DOM. Server rendered one icon, client rendered another → hydration mismatch → React discarded the server HTML and re-rendered from the RSC payload, **wiping the inline anti-flash script's work on `<html>`**. A mismatch anywhere can destroy DOM changes made outside React elsewhere in the tree.

> **The rule: anything that differs between server and client must be resolved by CSS or by an inline script — never by React state during the initial render.**
>
> The fix was to make the component _stateless_: render both icons, let CSS (`dark:hidden` / `hidden dark:block`) pick the visible one. Prefer this shape generally.

**Fonts are Roboto 400/500 + Inter + Roboto Mono via `next/font`.** Only weights **400 and 500** are loaded. **Never use `font-bold` (700)** — the browser synthesizes a smeared fake bold. Gmail uses 500 for unread anyway; use `font-medium`.

**Dates are ISO, typed as a template literal:** ``type IsoDate = `${number}-${number}-${number}` ``. Display strings like `"Jul 20"` are a compile error. ISO sorts correctly as plain text; `lib/emails.ts` sorts reverse-chronologically and formats for display. Always render inside `<time dateTime={iso}>`.

**The automation browser cannot composite frames.** Screenshots time out and CSS transitions freeze at their start value, so `getComputedStyle` reports stale values. **Anything animation- or paint-dependent cannot be verified there** — verify structure/state via `read_page` and `javascript_tool`, and confirm animations in a real browser. Don't chase these as if they were app bugs; I lost real time to that twice.

---

## Backend seam — the only API code in this phase

One module (`lib/api.ts`) reading a base URL from `NEXT_PUBLIC_API_URL`. During M0–M6 the variable is unset and the compose form shows a clearly-marked "not connected yet" state in dev. Build the UI fully; don't invent a mock server.

Code the response shape against the `success` / `message` / `data` envelope in `backend-requirements.md`, so M7 is a config change rather than a refactor.

**No secret ever goes in a `NEXT_PUBLIC_` variable** — those are compiled into the browser bundle.

## Addendum — live chat (M8, not before)

Separate from Compose. Compose sends real email via SMTP; chat is a real-time widget backed by MongoDB + Socket.IO. It belongs in the left sidebar, like real Gmail's Chat.

Two constraints that affect earlier decisions:

- `socket.io-client` is ~40KB gzipped — **dynamically import it when the visitor opens the chat**, never in the initial bundle.
- Presence is plain HTTP (`GET /presence`), not a socket, so the status dot doesn't force the socket client to load.

## Performance budget — verified before each deploy

- Inbox and reading routes ship **no route-specific client JavaScript** beyond the framework baseline.
- Lighthouse mobile performance ≥ 98.
- LCP < 1.2s on simulated Slow 4G; CLS ≈ 0.
- Fonts self-hosted via `next/font` — zero runtime font requests.
- Every image through `next/image` with explicit dimensions.
- No dependency added without justifying its bundle cost to me first.

## Also non-negotiable

**SEO.** Per-route metadata via the Metadata API, Open Graph images, `sitemap.ts`, `robots.ts`, real semantic HTML.

**Accessibility.** Keyboard navigable throughout, visible focus states, correct landmarks and heading order, honest alt text, respects `prefers-reduced-motion`.

**Quality gates.** `pnpm typecheck` and `pnpm lint` must pass before any deploy. No test suite in v1 — say so if you think a specific piece genuinely warrants one.

---

## Scope discipline — enforce this against me

_Depth beats breadth._ **Primary + exactly one fully-written case study, end to end, deployed, before anything else.** No empty folders. No Tier 2 or Tier 3 until Tier 1 is genuinely complete. If I get excited and jump to the Trash easter eggs or the Spam folder, push back.

|        | Milestone                                                                                      | Status  |
| ------ | ---------------------------------------------------------------------------------------------- | ------- |
| **M0** | scaffold, git init, Gmail theme tokens, light/dark                                             | ✅ done |
| **M1** | the shell: sidebar + top bar + layout                                                          | ✅ done |
| **M2** | `Email` type, `content/`, inbox list from typed data                                           | ✅ done |
| **M3** | reading view, block renderer, signature                                                        | ✅ done |
| **M4** | labels → URL-based filtering                                                                   | ← next  |
| **M5** | responsive, a11y, metadata/SEO, deploy to Vercel, verify budget                                |         |
| **M6** | remaining Tier 1: Promotions, Contacts/About, resume download, Starred → **frontend complete** |         |
| **M7** | _(after backend template cleanup)_ compose → `POST /contact`                                   |         |
| **M8** | live chat widget                                                                               |         |
| **M9** | owner inbox for chat                                                                           |         |

### Known debt to clear before M5 deploy

- **Wordmark says "Gmail"** — trademark exposure, needs my own mark.
- **30 of 31 emails are fabricated filler** (Unity, Solidity, Elixir…). Fine as scaffolding, actively harmful if deployed. Only `server-setup-template` has real content, and even that is realistic dummy prose I intend to rewrite.
- **`metadata.description`** still reads "Generated by create next app".
- **Print button** in the reading toolbar isn't wired — it's the resume download per `concept.md`, needs the actual PDF.
- **Mobile drawer slide animation** unverified in a real browser (see automation-browser note above).

## Two content items that need real-world consent

Flag these before they reach a commit:

- **Trash easter eggs** quote family and friends. Either get explicit OK on the exact wording, or write them as my own memory rather than a quote attributed to someone.
- **References** show real colleagues by name. They must agree before appearing on a public site, even name-only.

Don't let me ship either without confirming I've had those conversations.

## One more thing

Your training data may predate the current versions of Next.js, Tailwind, and the shadcn CLI. **Check the current official docs before running CLI commands or teaching an API** rather than recalling from memory. This has already caught several stale flags and one incorrect API claim.
