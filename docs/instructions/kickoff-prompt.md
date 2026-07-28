# Project kickoff — Gmail Portfolio (frontend)

## Who I am

I'm a backend MERN developer. I write TypeScript on the server every day and I'm comfortable with Node, Express, MongoDB, JWT, and API design. **My frontend is rusty:** the last React I wrote was ~3 years ago (hooks era, CRA, plain CSS/styled-components). I have **never used Next.js**, never used **TypeScript in a frontend codebase**, and never used **Tailwind or shadcn/ui**. Assume I know nothing about the App Router, Server Components, or modern React data flow — but don't over-explain general programming, TypeScript syntax, or backend concepts. I already know those.

This is deliberately a learning vehicle. I want to come out of it actually understanding modern frontend, not with a repo I can't maintain.

## How I want you to work with me — read this carefully

**Do not write application code into files unless I explicitly ask you to.** For each step:

1. Explain the concept and *why* it works this way — especially where it differs from React 3 years ago.
2. Show a minimal illustrative snippet, 15 lines max. Enough to unblock me, not the finished file.
3. Tell me exactly which file to create or edit, and where it goes.
4. **Stop and wait.** I write it. I'll tell you when it's done.
5. Then review what I wrote. Be blunt — call out anywhere I wrote it like it's 2022, anywhere I reached for client state when the server or the URL should own it, anywhere the types are weaker than they should be.

You **may** freely, without asking: run shell commands (scaffolding, installs, builds, dev server), read files, inspect my code, run the linter and typechecker, and check current docs.

Go one step at a time. Don't dump three milestones at once. When I ask "why," give me the real answer including tradeoffs — I'd rather understand the mechanism than memorize a rule.

## Read these first

1. **`C:\Users\thakursaad\Downloads\mds\concept.md`** — the locked product concept, with a tiered feature list. Authoritative on *what* we build.
2. **`C:\Users\thakursaad\Downloads\mds\backend-requirements.md`** — the backend plan. **For now you only need its "Contract the frontend codes against" section.** The backend does not exist yet and is not part of this phase.

My existing backend template lives at `C:\Users\thakursaad\projects\server-setup-template-updated` — irrelevant until M7, don't read it yet.

## The project in one line

A personal portfolio built as a working Gmail inbox — projects are emails, skills are labels, the compose button is the "hire me" CTA.

## This phase is frontend only

**Milestones M0–M6 involve no backend whatsoever.** The plan is: build the entire static site, deploy it, confirm it's genuinely good — *then* clean up my backend template, *then* connect the two. A deployed portfolio with one excellent case study is already professionally useful to me; a half-finished backend is not.

So during M0–M6 you write **no API-calling code** beyond one empty seam (described under Backend seam below). If I get impatient and try to wire up the backend early, push back.

## Locked decisions — do not relitigate these

**Stack:** Next.js (latest stable, App Router) · TypeScript in `strict` mode · Tailwind CSS · shadcn/ui · **pnpm** · deployed on Vercel.

**Location:** create the frontend at `C:\Users\thakursaad\projects\gmail-portfolio`. Fresh git repo. Windows + PowerShell.

**Rendering — the core constraint.** Every page is statically rendered at build time and ships as close to zero client JavaScript as possible.

- Server Components are the default. `"use client"` is opt-in and rare.
- **Budget: 8 client components in the entire site**, each with a one-line comment justifying why it can't be a Server Component. Expected: theme toggle, mobile sidebar toggle, search input, ⋮ menu, compose dialog, chat launcher, chat panel. If you think we need more, tell me why and I'll decide — don't quietly exceed it.
- **State lives in the URL, not in React.** Label filtering is `/?label=typescript`, read from `searchParams` and re-rendered on the server — no `useState`, no client-side filtering, and every filtered view is a shareable link. This is the single biggest shift from the React I learned; teach it properly the first time it comes up.
- **No global state library.** No Redux, no Zustand, no React Query. Local `useState` *inside* an interactive island is fine — the chat panel will need it. But if I reach for a store to hold anything the server or the URL could own, stop me.

**Content model:** all portfolio content lives in typed `.ts` modules under `content/` — never in a database. Email bodies are arrays of **discriminated-union blocks** (`paragraph | image | code | quote | callout | attachment`) rendered by a switch with exhaustiveness checking. This is deliberate: it's the most useful TypeScript pattern I could learn, and it costs zero runtime weight. If authoring long prose becomes genuinely painful later we'll revisit MDX — not before.

**Routing:** nested layouts only. The sidebar and top bar live in a `layout.tsx` that persists across navigation and never re-renders — Gmail's UI is literally a tree of nested layouts, which is exactly the shape of the App Router. **No parallel or intercepting routes in v1**; right tool eventually, not worth the complexity while I'm learning the basics.

**Design:** the UI should read as real, modern Gmail — correct density, spacing, typography, color. Use shadcn/ui for **behavior** (it's Radix underneath: focus traps, keyboard nav, ARIA), then restyle it to Gmail. Don't accept shadcn's default visual identity. Inbox rows are plain semantic elements, not shadcn components. Light and dark mode both work from day one.

**Do not use Google's logo, wordmark, or brand assets.** Recreating the layout is fine; the branding isn't mine to ship. My own mark goes in that slot.

**Mobile is a different layout, not a squeezed one.** Gmail on mobile drops the persistent sidebar, shows list-only, and opens messages full-screen. Plan for that rather than shrinking the desktop layout.

## Addendum to the concept doc — live chat

The concept doc predates this decision and doesn't mention it: there will eventually be a **live chat** (anonymous visitor → me), separate from Compose. Compose sends a real email to my Gmail via SMTP; chat is a real-time widget backed by MongoDB and Socket.IO.

It fits the metaphor natively — real Gmail has Chat in the left sidebar, so it belongs there rather than as a bolted-on bubble.

**Not built until M8.** But two constraints affect earlier decisions, so know them now:

- `socket.io-client` is ~40KB gzipped. It must be **dynamically imported when the visitor opens the chat**, never in the initial bundle. Done right, the feature costs the inbox page nothing.
- Presence is fetched over plain HTTP (`GET /presence`), not a socket — the widget shows my online status *before* anyone opens the chat, and opening a WebSocket just to render a status dot would defeat the lazy loading.

## Backend seam — the only API code in this phase

Create one module (`lib/api.ts`) that reads a base URL from `NEXT_PUBLIC_API_URL` and centralizes fetch calls. During M0–M6 the variable is unset and the compose form shows a clearly-marked "not connected yet" state in dev. Build the UI fully; just don't invent a mock server.

Code the response shape against the envelope documented in `backend-requirements.md` (`success` / `message` / `data`), so M7 is a config change rather than a refactor.

**No secret ever goes in a `NEXT_PUBLIC_` variable** — those are compiled into the browser bundle. That rule is exactly why SMTP config stays on the backend.

## Performance budget — acceptance criteria, verified before each deploy

- Inbox and reading routes ship **no route-specific client JavaScript** beyond the framework baseline.
- Lighthouse mobile performance ≥ 98.
- LCP < 1.2s on simulated Slow 4G; CLS ≈ 0.
- Fonts self-hosted via `next/font` — zero runtime font requests.
- Every image through `next/image` with explicit dimensions.
- No dependency added without justifying its bundle cost to me first.

## Also non-negotiable

**SEO.** This is a portfolio — being findable is the point. Per-route metadata via the Metadata API, Open Graph images (recruiters paste links into Slack), `sitemap.ts`, `robots.ts`, and real semantic HTML. Cheap to do, and it's most of why the site exists.

**Accessibility.** Keyboard navigable throughout, visible focus states, correct landmarks and heading order, honest alt text, respects `prefers-reduced-motion`. Radix gives most of this free if I don't fight it.

**Quality gates.** `pnpm typecheck` and lint must pass before any deploy. No test suite in v1 — say so if you think a specific piece genuinely warrants one.

## Scope discipline — enforce this against me

The concept doc's own principle is *depth beats breadth*, and I want you to hold me to it harder than the doc does. **Primary + exactly one fully-written case study, end to end, deployed, before anything else.** No empty folders. No Tier 2 or Tier 3 until Tier 1 is genuinely complete. If I get excited and jump to the Trash easter eggs or the Spam folder, push back.

- **M0** — scaffold, git init, Tailwind theme tokens matched to Gmail, light/dark
- **M1** — the shell: sidebar + top bar + layout, static, no content
- **M2** — the `Email` type, `content/`, inbox list rendering from typed data
- **M3** — the reading view: one complete case study, block renderer, signature component
- **M4** — labels → URL-based filtering
- **M5** — responsive, accessibility, metadata/SEO, deploy to Vercel, verify the budget
- **M6** — remaining Tier 1 content: Promotions, Contacts/About, resume download, Starred → **frontend complete**
- **M7** — *(after I clean up the backend template)* compose → `POST /contact`
- **M8** — live chat widget
- **M9** — owner inbox for chat

## Two content items that need real-world consent

From my own action items — flag these before they reach a commit:

- The **Trash easter eggs** quote family and friends. Either get explicit OK on the exact wording, or write them as my own memory instead of a quote attributed to someone.
- **References** show real colleagues by name. They need to agree before appearing on a public site, even name-only.

Don't let me ship either without confirming I've had those conversations.

## One more thing

Your training data may predate the current versions of Next.js, Tailwind, and the shadcn CLI. **Check the current official docs for the exact scaffold and init commands before running them** rather than recalling them from memory — CLI flags in particular change often, and I'd rather you verify than have me debug a stale command.

## Start here

Read the two files above, tell me your understanding of what we're building and anything in this plan you think is wrong, then walk me through **M0** — one step at a time, waiting for me at each step.
