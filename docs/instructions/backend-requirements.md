# Gmail Portfolio — Backend Requirements

**Status:** planning only. No backend work starts until the static frontend is deployed and live.
**Approach:** fork `server-setup-template-updated` and delete down to this spec. Do not rebuild from scratch.

**Revised.** Compose and live chat are separate features. Reference requests are email-only — no approval tokens, no stored state. (If you ever want the full gated-reveal version, see the appendix.)

---

## The shape of this backend

All portfolio content is static — projects, case studies, skills, labels, testimonials, certifications, about, easter eggs live as typed TypeScript in the frontend repo and compile to HTML at build time. The backend never serves them and MongoDB never stores them.

That leaves **two features**:

| Feature | Needs | Delivery |
|---|---|---|
| **Compose** (hire-me CTA) | SMTP only | Lands in your real Gmail |
| **Reference request** | SMTP only — same endpoint | Lands in your real Gmail |
| **Live chat** | MongoDB + Socket.IO + an owner inbox | You must build the receiving side |

Everything else is plumbing you already own.

### Two things to keep in mind

**Live chat is the only feature that touches MongoDB.** If you build Compose first, you can ship it without a database at all — persist failures to your Winston logs and add the collection when chat arrives.

**Email delivers itself; chat does not.** Compose lands in an inbox you already read. Every chat message needs somewhere *you* can read and reply, which means chat is a visitor widget **plus an owner inbox UI plus authentication for you**. That receiving side is most of the work and it's easy to miss when planning. Budget accordingly.

### The auth inversion

This is the biggest structural difference from your template and it applies to the chat feature.

Your template assumes **authenticated user ↔ authenticated user**. This is **anonymous visitor → one authenticated owner**.

- Visitors never register, never log in, have no account. They carry a random `visitorId` in a first-party cookie — an identifier, not an identity, and it grants no trust.
- You are the only account. One seeded owner, created by script, never by self-registration.
- So: no registration, no OTP activation, no role hierarchy, no password reset. Most of the `auth` module goes away.

---

## Audit of the existing template

### Keep as-is — this is why we fork instead of rebuild

| Path | Reason |
|---|---|
| `src/config/index.ts` | zod-validated, fail-fast env. Trim the variable list, keep the mechanism. |
| `src/error/` | `ApiError`, Mongoose/Zod transformers, 404 handler, global error handler. |
| `src/app/middleware/globalErrorHandler.ts` | The stable JSON error contract. |
| `src/app/middleware/limiter.ts` | **Load-bearing here.** Anonymous write endpoints need this more than your template ever did. |
| `src/util/catchAsync.ts`, `sendResponse.ts` | The response envelope the frontend codes against. |
| `src/util/logger.ts` | Winston + daily rotation + request-id correlation. |
| `src/util/sendEmail.ts`, `src/mail/` | Keep the transport and template mechanism; rewrite the template *content*. |
| `src/util/jwtHelpers.ts` | Still needed — for you, for the chat inbox. |
| `src/connection/` | HTTP + WebSocket on one port, already solved. |
| `src/builder/queryBuilder.ts` | Paginating your conversation list. Its injection-safety matters on a public surface. |
| `src/app.ts`, `src/server.ts` | App assembly and graceful shutdown. |
| `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml` | Free infrastructure. |
| `tests/` | Keep the harness and `mongodb-memory-server` setup; the auth suites go with the flows they cover. |

### Delete outright

| Path | Reason |
|---|---|
| `src/app/module/admin/` | No admin accounts. One owner, seeded. |
| `src/app/module/user/` | No user profiles. |
| `src/app/module/review/` | Not a feature here. |
| `src/app/module/feedback/` | Superseded by the contact module. |
| `src/app/module/manage/` | CMS content is static TypeScript in the frontend repo. |
| `src/app/module/notification/` | In-app notifications need a UI that doesn't exist. Email is the notification channel. |
| `src/app/module/chat/` | **Wrong shape** — built for two authenticated participants. Rewrite, don't adapt. |
| `src/app/middleware/fileUploader.ts` + `/uploads` static serving | Screenshots and PDFs are repo assets on Vercel's CDN. Nothing is uploaded at runtime. |
| Stripe SDK + config | No payments. |
| `DRIVER` role and the `auth_level` tiers | Two states only: owner, or not. |

### Reduce heavily

**`src/app/module/auth/`** — delete `register`, `activate-account`, `activation-code-resend`, `forgot-password`, `forget-pass-otp-verify`, `reset-password`, and every OTP field on the model (`activationCode`, `activationCodeExpire`, `activationAttempts`, and the verification equivalents). Keep only `POST /login`, `POST /refresh-token`, `PATCH /change-password`. Locked out? Re-run the seed script.

**`src/app/middleware/auth.ts`** — collapses to one check: is this a valid token for the owner account. No role arrays, no access levels.

**`src/socket/socketAuth.ts`** — rewrite, don't trim. It currently rejects any handshake without a valid JWT. Here, anonymous handshakes are the *normal* case and authenticated ones are the exception.

**`src/jobs/`** — delete the OTP cleanup job, keep the `startJobs`/`stopJobs` bootstrap. It becomes the retention job that prunes abandoned conversations.

---

## Feature 1 — Contact (Compose + reference requests)

One endpoint, one service, no socket, no read path. Both message types are the same operation with different context attached.

**`POST /contact`** — public, rate-limited, returns `202` immediately.

Validate with a **zod discriminated union** on `kind`:

```
kind: "compose"    → name, email, subject, message
kind: "reference"  → name, email, organization, message, referenceSlug
```

(`referenceSlug` points at a person defined in the frontend's static content. The backend never stores your references — it only tells you who's asking about whom.)

Every payload also carries a honeypot field that must be empty.

**Three things that must be right:**

**Persist before you send.** If SMTP fails, an unpersisted message is gone and nobody knows. Write a minimal record — timestamp, kind, name, email, subject, body — then send. Email is the delivery mechanism; the record is your only safety net.

**Send outside the request cycle.** Return `202` the moment it's persisted, then send. Your template currently sends inline, so the visitor waits on your SMTP handshake.

**Set `Reply-To`, don't spoof `From`.** `From` must be your own service address — putting the visitor's address there fails SPF/DKIM and lands you in spam. Put theirs in `Reply-To` so hitting Reply in Gmail just works. This is what makes the feature feel native.

Email templates needed: new Compose message (to you), reference request (to you).

---

## Feature 2 — Live chat

### Data model

**Conversation**

| Field | Notes |
|---|---|
| `visitorId` | Random UUID from a first-party cookie. Indexed. Identifier only — never trusted for authorization. |
| `visitorName`, `visitorEmail` | Optional. Email required when you're offline, so there's a reply path. |
| `status` | `open` / `closed` |
| `lastMessageAt` | Indexed. Sorts your inbox. |
| `unreadForOwner` | Count for the badge. |
| `referrer`, `userAgent` | Optional context. **Do not store raw IPs** — hash them if you need abuse correlation. |

**Message**

| Field | Notes |
|---|---|
| `conversationId` | Compound index with `createdAt`, exactly like your template's `Message`. |
| `from` | `visitor` / `owner`. Derived server-side from the connection, **never** from the payload. |
| `body` | Length-capped. Stored as plain text; never rendered as HTML. |
| `isRead` | |

### Presence

The widget must never imply you're available when you aren't. A recruiter who types at 2am and gets silence leaves with a worse impression than if there had been no chat at all.

- **`GET /presence`** → `{ online: boolean }`. Public, unauthenticated, cacheable for a few seconds.
- Deliberately plain HTTP, not a socket event: the widget shows your status *before* the visitor opens the chat, and opening a WebSocket just to render a status dot would defeat lazy-loading the socket client.
- Online means "the owner socket is currently connected." When offline, the frontend requires an email address before accepting a message.

### Visitor endpoints

| Method | Route | Access |
|---|---|---|
| GET | `/chat/:visitorId` | Cookie-scoped — a visitor reads only their own thread |
| GET | `/presence` | Public |

Sending is socket-primary; keep a REST fallback if you want the widget to degrade without WebSockets.

### Owner inbox — the hidden half of this feature

| Method | Route |
|---|---|
| GET | `/owner/conversations` (paginated via `QueryBuilder`) |
| GET | `/owner/conversations/:id` |
| POST | `/owner/conversations/:id/reply` |
| PATCH | `/owner/conversations/:id/read` |

Plus the reduced `auth` module for login and refresh, and a UI to render it. Two ways to soften that: build the owner view inside the portfolio's Gmail interface (thematically perfect, and the interface already exists), or bridge new-message notifications to email/Telegram so there's no inbox to build. Decide when you get there.

### Socket layer

| Concern | Requirement |
|---|---|
| Visitor handshake | Anonymous. `{ auth: { visitorId } }`. Joins `conversation:<visitorId>` only. |
| Owner handshake | JWT, exactly as the template does today. Joins `owner`. |
| Authorization | A socket may only write to its own conversation. `from` is derived from the connection type. |
| Presence | Owner connect/disconnect flips the flag and broadcasts it. |
| Events | `message:send`, `message:new`, `presence:change`, `typing` (optional), `socket_error` |
| Reuse | Keep `socketCatchAsync`, `emitResult`, `emitError` — the envelope should match the REST contract. |

**Hosting consequence:** WebSockets require a persistent process. This backend cannot be serverless, and free tiers that sleep on inactivity will make the chat look broken on the first message. Host decision deferred; the requirement is "persistent, doesn't sleep."

---

## Security

Your template's posture assumed authenticated users. Every write path here is anonymous — a different threat model.

- **Rate limit per IP on every public write.** `/contact` and chat message send. Primary spam defense.
- **Cap message length and messages per conversation.** An unbounded anonymous write endpoint is a storage bill waiting to happen.
- **Honeypot on the Compose form.** Cheap, catches most bots, costs the user nothing.
- **`visitorId` is not authorization.** It scopes a visitor to their own thread and nothing more. Anyone can forge one — make sure that gains them nothing.
- **CORS allow-list to your Vercel domain only**, plus preview deployments if you want them working.
- **Store as text, render as text.** Visitor content must never reach `dangerouslySetInnerHTML`.
- **Don't log message bodies.** Your Winston setup is verbose by default; keep private correspondence out of rotated log files.

## Email

All SMTP config lives here, in one place. The frontend never sees credentials and never talks to a mail server — it POSTs to this API.

Templates: Compose notification (to you), reference request (to you), new chat message while offline (to you), owner chat reply (to visitor, if they left an address).

Personal Gmail SMTP caps around 500/day and lands in corporate spam filters more often than you'd like. A dedicated sending domain is a config change, not a code change — you keep Nodemailer and full control.

## Environment variables

**Keep:** `NODE_ENV`, `BASE_URL`, `PORT`, `MONGO_URL`, `BCRYPT_SALT_ROUNDS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, `SMTP_*`, `SERVICE_NAME`

**Add:** `CORS_ORIGIN` (Vercel domain), `OWNER_EMAIL` / `OWNER_PASSWORD` (seed), `OWNER_NOTIFY_EMAIL`, `MESSAGE_MAX_LENGTH`

**Drop:** `STRIPE_SECRET_KEY`, `SUPER_ADMIN_*` (renamed `OWNER_*`)

## Data retention

You'll be storing unsolicited messages from identifiable people — names, addresses, and whatever they chose to tell you. That's personal data, on a public site, with your name on it.

- Prune abandoned conversations (no owner reply, no visitor activity) after a defined window. This is the cron job that replaces OTP cleanup.
- Give yourself a hard delete, not a soft one.
- If you later add analytics or IP logging, say so on the site.

---

## Contract the frontend codes against

Relevant **now**, while building the frontend — these are the seams to leave open. Keep the base URL in a single env-driven config module so nothing is hardcoded.

```
POST   /contact              → 202 { ok: true }        // compose + reference
GET    /presence             → { online: boolean }
GET    /chat/:visitorId      → { conversation, messages[] }
```

Socket events the widget uses: `message:send`, `message:new`, `presence:change`.

Responses follow the template's existing `sendResponse` / `globalErrorHandler` envelope — build the frontend's fetch wrapper against that shape.

## Deferred

- Backend host (requirement: persistent process, no cold sleep)
- Whether the owner inbox lives inside the portfolio's Gmail UI or a separate minimal admin page
- Push/mobile notification for new chat messages
- Live unread count tied to real GitHub activity

---

## Appendix — if you later want gated reference reveals

The current design emails you a request and you forward the details yourself. The automated version would add: a `ReferenceRequest` collection, single-use hashed approve/deny tokens sent to you by email, and an expiring reveal token emailed to the requester on approval.

If you build it, one rule is non-negotiable: **reference contact details must never ship in the static bundle**, not even behind a conditional. That's hiding, not gating, and View Source defeats it. They'd live in backend env or the DB and be returned only against a valid reveal token.

Either way — get explicit consent from your department head and former colleagues *before* they appear on the site at all, even name-only. That conversation may change who's listed.
