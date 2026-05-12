# SpendPilot — Engineering Dev Log

A running log of daily progress, decisions made, and technical challenges encountered during the 7-day build sprint (May 6–13, 2026).

---

## Day 1 — May 6: Concept & Architecture

**Goal:** Validate the idea and design the full system architecture before writing a single line of code.

**Decisions made:**
- Chose Next.js 14 (App Router) for full-stack capability in a single deployment — no separate Express backend needed.
- Decided on a **deterministic audit engine** (no AI dependency at the core) so the product works 100% without any API keys. This was a deliberate architectural choice to ensure zero-downtime resilience.
- Selected Supabase for persistence (generous free tier, built-in RLS) and Resend for transactional email (modern API, excellent developer UX).

---

## Day 2 — May 7: Foundation & Core Engine

**Goal:** Build the audit engine and schema.

**Built today:**
- `src/lib/auditEngine.ts` — the deterministic pricing rules engine. It checks seat mismatches (e.g., paying for 15 Copilot seats on a 10-person team), plan tier mismatches, and duplicate overlapping tools (e.g., Cursor + Copilot).
- `src/lib/validations.ts` — Zod schema for the multi-tool form input.
- Core database schema (`supabase_schema.sql`) with `audits`, `audit_tools`, and `leads` tables with Row Level Security (RLS) policies.

**Key decision:** Used a `nanoid`-based `shareSlug` (instead of exposing raw database UUIDs) so audit URLs are opaque and unguessable.

---

## Day 3 — May 8: UI, Form & Results Dashboard

**Goal:** Build the complete user-facing product — form and results page.

**Built today:**
- `SpendForm.tsx` with `react-hook-form` + Zod validation, animated tool cards, and auto-save to `localStorage`.
- Full results page with `SavingsHero`, `ActionPlan`, `SpendChart` (Recharts), `InsightsPanel`, and `AuditBreakdown` components.
- Lead capture modal with a **honeypot spam field** for bot protection and duplicate email deduplication.
- GitHub Actions CI/CD pipeline running lint + tests on every push.

**Vitest test suite:** 9 passing unit tests covering the audit engine edge cases (zero savings, seat mismatches, plan tier detection).

---

## Day 4 — May 9: Email, AI Integration & Bug Fixes

**Goal:** Wire up transactional email and AI summaries. Ship two critical bug fixes.

**Built today:**
- Integrated **Resend** for transactional email with a rich HTML email template (see Day 5 for the upgrade).
- Integrated **Google Gemini API** for AI-powered audit summaries.
- Fixed a critical bug: When a user added an empty tool card and then clicked "Generate Audit Report," the Zod validation blocked form submission. Fixed by rewriting the validation schema to use `.transform()` to strip blank tool rows before validation runs — they are silently dropped and never cause errors.
- Fixed a **React/Framer Motion race condition**: when a tool was deleted, Framer Motion kept the card visible for its exit animation. If the card tried to render its error message during this fade-out, it would crash because React Hook Form had already removed the data. Fixed with safe optional chaining (`?.`) on all error reads.

---

## Day 5 — May 10: Production Incidents & Resilience Testing

**Goal:** Connect all APIs, do live end-to-end testing, and handle real-world failures.

**What happened — The Gemini API Incident:**

During the first live end-to-end test, the Google Gemini 2.0 Flash API returned a `429 Too Many Requests` error with `limit: 0`, meaning the free tier was completely unavailable for this specific Google Cloud project (likely due to regional quota restrictions or missing billing account on the project).

```
[AI Summary Error] GoogleGenerativeAIFetchError:
  Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
  limit: 0, model: gemini-2.0-flash
```

**What did NOT happen:** The app did not crash. The product did not break. The user saw their results with zero interruption.

**Why it worked:** On Day 1, we made the decision to build a deterministic fallback summary generator (`generateFallbackSummary` in `src/lib/aiSummary.ts`). The `try/catch` block around the Gemini call caught the `429` error immediately and fell back to the template summary in milliseconds. The API route returned `200 OK` in 1.3 seconds total.

**The database race condition:**

During the same test, the leads table threw a Foreign Key Constraint violation:
```
[saveLead] insert or update on table "leads" violates foreign key constraint "leads_audit_id_fkey"
```

**Root cause:** Because the Gemini API took ~3 seconds to fail, the user had already typed their email and clicked "Send" before the backend finished saving the audit to the database. The `leads` table tried to reference an `audit_id` that didn't exist yet.

**Fix:** Removed the strict foreign key constraint on `leads.audit_id` (via `ALTER TABLE leads DROP CONSTRAINT leads_audit_id_fkey`) so that a lead can be captured even if the audit hasn't persisted yet. The data integrity is maintained at the application layer, not the database layer — an acceptable trade-off for better user experience.

**Email content upgrade:**

The initial email only contained the total savings number. Updated the email template (`/api/leads/route.ts`) to include:
- Full AI summary block (if available)
- Tool-by-tool breakdown table showing current plan, recommended plan, monthly savings per tool, priority badge, and the reasoning behind each recommendation
- Annual savings projection

---

## Key Architectural Decisions Summary

| Decision | Rationale |
|---|---|
| Client-side audit engine | Zero backend dependency; works even if the server is down |
| Fallback AI summary | The product never breaks if AI APIs fail |
| Service Role Key (not Anon Key) | All DB writes happen server-side in API routes — more secure |
| Honeypot spam protection | Simple, effective, invisible to real users |
| Soft foreign key constraint on leads | Better UX over strict relational integrity in async contexts |

---

## Open Items / Known Limitations

- [x] **Gemini 2.0 Flash has `limit: 0` free tier quota** for some Google Cloud projects due to regional restrictions. Diagnosed via `curl` to the `/v1beta/models` endpoint, which confirmed `gemini-2.5-flash` was available. Switched model to `gemini-2.5-flash` — confirmed working.
- [ ] Resend sandbox mode limits emails to the account owner's address only. Needs a verified custom domain for production use.
- [ ] The rate limiter (`rateMap`) is in-memory and resets on each serverless cold start. For production, this should be replaced with an upstash/redis-based rate limiter.

---

## Day 6 — May 11: Form Architecture Refactor, State Management & UI Polish

**Goal:** Resolve complex form state regressions (the "ghost card" bug), polish the UI to enterprise standards, and implement seamless back-navigation state.

**Built today:**
- **UI Professionalization:** Executed a massive "emoji purge" across the codebase. Replaced all static emojis in `USE_CASES`, `AI_TOOLS`, and results components with professional, consistent `lucide-react` SVG icons. 
- **The "Ghost Card" Bug Fix:** Discovered that the Day 4 Zod `.transform()` pipe was interacting poorly with `react-hook-form` default values and Framer Motion's exit animations. When a user deleted a card, the exit animation kept the component mounted just long enough for React Hook Form to *re-register* the deleted fields into state (but without their unique IDs). When the user clicked Generate, these "ghost rows" caused the Zod schema to crash silently because `id` was undefined.
- **The Three-Layer Architecture Fix:**
  1. *Zero-Duration Exits*: Changed Framer Motion `exit` transitions to `duration: 0` so deleted cards unmount instantaneously.
  2. *Schema Relaxation*: Made `id` optional in the Zod schema so ghost rows don't block validation.
  3. *Pre-validation Filtering*: Shifted the blank-row filtering out of Zod entirely. Now, `SpendForm.tsx` manually strips any row missing a `plan` *before* Zod validation runs.
- **Circular JSON Fix:** Discovered that spreading the raw `react-hook-form` data object (`{ ...data }`) into the `fetch` body caused a `TypeError: Converting circular structure to JSON` because it contained internal React Fiber DOM node references. Fixed by explicitly constructing a clean `cleanPayload` map.
- **State Management ("Edit Inputs"):** Implemented `sessionStorage` management. When a user clicks "Generate", their exact form inputs are saved. Clicking "Edit Inputs" routes to `/audit?restore=1`, which loads the state and *immediately deletes* it from session storage. This ensures a seamless back-navigation while keeping manual page refreshes a clean slate.

---

## Key Architectural Decisions Summary
