# SpendPilot — AI Spend Audit for Startups

> Stop burning cash on AI tools you don't need.

SpendPilot audits your startup's AI subscription stack, surfaces duplicate subscriptions, wrong pricing plans, and unused enterprise seats — in under 5 minutes.

---

## 🚀 Product Overview

| Feature | Status |
|---|---|
| Landing Page | ✅ |
| Spend Input Form | ✅ |
| Audit Engine (deterministic) | ✅ |
| AI Summary (Claude API) | ✅ |
| Results Dashboard | ✅ |
| Data Visualizations (Recharts) | ✅ |
| Lead Capture + Email (Resend) | ✅ |
| Supabase Persistence | ✅ |
| Shareable Public Reports | ✅ |
| Rate Limiting + Honeypot | ✅ |
| CI/CD (GitHub Actions) | ✅ |
| 9 Vitest Tests | ✅ |

---

## 📸 Screenshots

> _Add screenshots after first run_

- [ ] Landing page hero
- [ ] Spend input form
- [ ] Results dashboard
- [ ] Public shared report

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom glassmorphism system
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **AI**: Anthropic Claude (claude-3-5-haiku) with fallback summaries
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

---

## ⚙️ Setup Instructions

### 1. Clone and install

```bash
git clone <repo-url>
cd SpendPilot
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in your Supabase, Anthropic, and Resend credentials
```

### 3. Set up Supabase

Run the following SQL in your Supabase project:

```sql
-- See schema in ARCHITECTURE.md
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Run tests

```bash
npm test
```

---

## 🚀 Deployment

Optimized for Vercel:

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard before deploying.

---

## 📁 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design.

---

## 📊 Key Metrics

See [METRICS.md](./METRICS.md) for funnel and North Star metrics.
