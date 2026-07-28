# Gmail Portfolio — Locked Concept

**The idea:** a portfolio built as a working Gmail inbox. Chosen over the VS Code approach because Gmail is a UI almost *everyone* recognizes — recruiters, PMs, hiring managers — not just developers. Zero onboarding required.

## Visual direction

- Literal, modern Gmail UI: real chrome, colors, layout, typography
- Personality lives entirely in the copy and content, not in deviations from the real UI
- Deliberate design pass needed — real Gmail is visually plain, so it must read as *intentional*, not unstyled

## Email anatomy — how content maps to the UI

This mapping applies everywhere and should stay consistent across every section:

| Gmail element | Portfolio content |
|---|---|
| Sender name | Company, client, org, or context |
| Subject line | Project / item title |
| Preview snippet | One-line pitch |
| Opened email | Full case study or detail |
| Attachments | Screenshots, PDFs, demos |
| Labels | Tech stack (clickable → filters Primary) |
| Starred | Best work |

---

## Tier 1 — Ships the core pitch

- **Primary** (inbox tab) → **Projects.** Each is an email thread; opening it reveals the full case study.
- **Important** (sidebar) + **Labels** → **Skills.** Each skill is its own flagged entry (proficiency, years, a one-line story of how you've used it). Labels are the connective tissue — clicking a skill's label filters Primary down to the projects that used it.
- **Promotions** (inbox tab) → **Testimonials, recommendations, and certifications.** Certs format nicely as offers: sender = issuing body (AWS, Coursera), subject = "You've earned it: Solutions Architect Associate."
- **Contacts** (adjacent app) → **About Me** card.
- **Reference system** → Approval-gated reveal for your department head and trusted former colleagues. Visitors see only name, relationship, and photo; contact details are released only after they request it and you approve.
- **Resume/CV download** → triggered by Gmail's print icon on an open email. No new UI element needed.
- **Compose** → the **"hire me"** CTA. Opens a real, working compose window addressed to you.

## Tier 2 — Adds personality, once the shell works

- **Starred** → 2-3 flagship projects. Can be a pinned filter on Primary rather than a separate build.
- **Drafts** → what you're currently building.
- **Social** (inbox tab) → profile links: GitHub, LinkedIn, LeetCode, etc.
- **Trash** → retired projects and old portfolio versions, *plus* the human easter eggs. Each is a normal-looking row: avatar, sender name with the relationship baked in ("Amma ❤️", "Rafi (roommate, '19–'22)"), a real subject line, one-line preview. Text only — no phone numbers, no links. Framed as notes you never got around to deleting. Where no written line exists, write it as your own memory instead: sender = "You (Note to self)", subject = "What Amma said when she saw the launch."
- **Calendar** (adjacent app) → career timeline / booking.
- **Meet** (adjacent app) → schedule a call.
- **Snooze** → for a project you've teased but haven't written up yet: "case study coming soon," instead of a dead link.
- **Storage meter** (bottom-left) → replace "15 GB of 15 GB used" with something playful and true — coffee consumed, lines of code shipped. Cheap to build, always visible.
- **Email signature** → one reusable sign-off block at the bottom of every thread (name, tagline, email, link). Single component, reused everywhere, keeps your voice consistent wherever someone lands.
- **More options (⋮) menu** → discoverable rewards for people who poke around. "Create event" on a project drops a real calendar entry for its ship date; "Mark as important" is already checked on your best work.

## Tier 3 — Flavor. Add whenever; safest to cut if time runs short

- **Updates** (inbox tab) → **growth changelog**, styled as system notifications: **blog posts**, skill-ups ("React upgraded to Advanced"), talks, conferences attended. *Certifications live in Promotions, not here — don't duplicate them.*
- **Forums** (inbox tab) → **open source collaboration.** Row format: sender = repo name, subject = what you did, plus a truncated one-line snippet.
  > **react:** Fixed a subtle memory leak in useEffect cleanup

  Opening it plays out as a real thread: your PR description → maintainer reply → merged checkmark → "View on GitHub" link. Turns a small contribution into a story with a resolution, without overselling it.
- **Spam** → self-aware humor: real (or lightly exaggerated) rejection emails, parody recruiter spam ("URGENT: Blockchain synergy ninja needed!!"), and a "hall of cringe" — your earliest project, kept deliberately to show the contrast.
- **Purchases** (sidebar item, **not** an inbox tab — matches how real Gmail places it) → investments in yourself, as order-summary cards with thumbnail + action button: AI subscriptions, Copilot, Figma, courses, books, conference tickets, domain/hosting, hardware that changed how you work. Something you're currently learning can sit in "arriving soon," with the button flipping from *Track Package* to *View Certificate* once done.
- **Sent** → *on probation.* Outreach and collaboration: cold emails that led somewhere, recommendations you wrote for teammates, intros you made. The one folder about how you show up for other people. Cut it if it stays thin.

## Deferred — post-launch upgrades

- **Account switcher** (top-right avatar) → toggles "Recruiter view" (impact, shipped work) vs. "Peer/engineer view" (code depth, architecture decisions). Same content, different emphasis.
- **Vacation responder banner** → "Open to opportunities, replies within 24h" status strip.
- **Drag-and-drop** → visitors build their own shortlist by dragging projects into a personal Starred pile.
- **Live unread count** → tab badge tied to real GitHub activity instead of a static number.

---

## Before you build — action items

- [ ] Get explicit OK from your department head and past colleagues before listing them as approval-gated references.
- [ ] Get explicit OK on the exact wording of each Trash easter egg — or write it as your own memory rather than a quote attributed to them.
- [ ] Decide the storage-meter stat and the signature tagline. Both are one-liners, but they set the voice for the whole site.

## Guiding principle

Depth beats breadth. One deeply-written case study in Primary will win more callbacks than five more folders. Build Tier 1 completely before touching Tier 2.
