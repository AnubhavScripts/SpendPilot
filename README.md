# SpendPilot: AI SaaS Spend Auditor

SpendPilot is a B2B SaaS tool designed to help engineering leaders and founders audit their team's AI tool subscriptions and uncover immediate cost-saving opportunities. By analyzing your active seats across tools like GitHub Copilot, Cursor, and ChatGPT Enterprise, SpendPilot provides a deterministic, personalized action plan to consolidate redundant licenses and optimize your AI stack.

### 📸 Product Tour
*(Screenshots/recording to be embedded here)*
- [Watch the 30-second Demo Video (Loom)](#)
- ![Hero Section](/docs/screenshots/hero.png)
- ![Audit Form](/docs/screenshots/form.png)
- ![Savings Action Plan](/docs/screenshots/action-plan.png)

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ and a Supabase account.

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/spendpilot.git
   cd spendpilot
   npm install
   ```
2. **Environment Setup**
   Copy `.env.example` to `.env.local` and add your keys (Supabase, Resend, Gemini).
   ```bash
   cp .env.example .env.local
   ```
3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to run the app.

4. **Deploy**
   The application is fully optimized for Vercel. 
   - Connect your GitHub repo to Vercel.
   - Add the environment variables from `.env.local`.
   - Click "Deploy".

**Live URL:** [https://spendpilot.vercel.app](https://spendpilot.vercel.app) *(Replace with actual URL)*

## ⚖️ Architectural Decisions & Trade-offs

1. **Client-Side Audit Engine over Server-Side Processing**
   *Why:* The core pricing logic (`src/lib/auditEngine.ts`) runs entirely in the browser. 
   *Trade-off:* We expose our pricing matrix logic to the client, but we gain zero-latency feedback, 100% uptime (even if backend APIs fail), and eliminate server compute costs for tire-kickers.
2. **Fallback AI Summaries over Strict AI Dependency**
   *Why:* Gemini API quotas can fail (e.g., `limit: 0` on free tiers).
   *Trade-off:* We wrote a deterministic template generator that acts as a fallback. It's less personalized than the LLM output, but guarantees the app never crashes during an API outage.
3. **Soft Foreign Keys in the Database**
   *Why:* We dropped the strict `audit_id` foreign key constraint on the `leads` table.
   *Trade-off:* We lose strict relational database integrity, but we prevent a race condition where a user submits their email before the asynchronous audit payload finishes saving. UX > strict DB rules here.
4. **Zod Validation in `onSubmit` instead of `.transform()`**
   *Why:* Attempting to filter blank tool rows inside the schema caused "ghost card" state bugs with `react-hook-form`.
   *Trade-off:* The validation schema is slightly less strict (e.g., `id` is optional), but the form state remains completely stable and predictable during complex UI animations.
5. **Framer Motion Instant Exits**
   *Why:* `duration: 0` on exit animations.
   *Trade-off:* We sacrifice a smooth fade-out animation when deleting a tool card, but we completely eliminate race conditions where React Hook Form re-registers a deleted, fading component.
