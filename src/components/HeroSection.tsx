'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingDown, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';

const FLOAT_CARDS = [
  {
    icon: DollarSign,
    label: 'Monthly Overspend',
    value: '$3,840',
    sub: 'Identified savings',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    delay: 0,
    position: 'top-8 -left-6 sm:top-12 sm:-left-10',
  },
  {
    icon: TrendingDown,
    label: 'Duplicate Tools',
    value: '4 found',
    sub: 'Overlapping AI subs',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    delay: 0.4,
    position: 'top-4 -right-6 sm:top-6 sm:-right-12',
  },
  {
    icon: Sparkles,
    label: 'Savings Unlocked',
    value: '38%',
    sub: 'vs current spend',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    delay: 0.8,
    position: '-bottom-4 left-4 sm:-bottom-6 sm:left-6',
  },
];

function FloatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg,
  delay,
  position,
}: (typeof FLOAT_CARDS)[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8 + delay, duration: 0.5, ease: 'backOut' }}
      style={{ animationDelay: `${delay}s` }}
      className={`absolute ${position} z-10 animate-float glass-strong rounded-2xl px-4 py-3 shadow-glass`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[10px] font-medium text-white/40">{label}</p>
          <p className={`text-sm font-bold ${color}`}>{value}</p>
          <p className="text-[10px] text-white/30">{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden mesh-gradient flex items-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
              AI spend auditing for startups
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Stop burning cash on{' '}
              <span className="gradient-text">AI tools</span>{' '}
              you don&apos;t need
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 max-w-lg text-lg text-white/55 leading-relaxed"
            >
              SpendPilot audits your AI subscription stack and surfaces duplicate tools,
              wrong pricing tiers, and unused enterprise seats — in under 5 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                id="hero-cta"
                href="/audit"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-1 hover:bg-brand-500 hover:shadow-brand-500/40 active:translate-y-0"
              >
                Audit My AI Spend
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                id="hero-demo"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                See sample audit
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex items-center gap-6"
            >
              {[
                { label: 'Free audit', icon: <CheckCircle2 className="h-3 w-3" /> },
                { label: 'No signup needed', icon: <CheckCircle2 className="h-3 w-3" /> },
                { label: '5 min setup', icon: <CheckCircle2 className="h-3 w-3" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-white/40">
                  <span className="text-emerald-400">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative z-0 overflow-hidden rounded-3xl border border-white/10 glass-strong shadow-glass p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40">Your AI spend audit</p>
                    <p className="text-2xl font-bold text-white">$9,680<span className="text-sm font-normal text-white/40">/mo</span></p>
                  </div>
                  <div className="rounded-xl bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-400">
                    ⚠ Overspend detected
                  </div>
                </div>

                {/* Spend bars */}
                <div className="space-y-3">
                  {[
                    { name: 'GitHub Copilot', amount: 2280, pct: 80, color: 'bg-violet-500' },
                    { name: 'OpenAI API', amount: 3200, pct: 100, color: 'bg-brand-500' },
                    { name: 'Claude Pro', amount: 1600, pct: 55, color: 'bg-amber-500' },
                    { name: 'Cursor', amount: 1200, pct: 40, color: 'bg-emerald-500' },
                    { name: 'Windsurf', amount: 840, pct: 28, color: 'bg-pink-500' },
                    { name: 'Gemini', amount: 560, pct: 18, color: 'bg-blue-500' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <p className="w-28 truncate text-xs text-white/60">{item.name}</p>
                      <div className="flex-1 rounded-full bg-white/5 h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 1 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                      <p className="w-14 text-right text-xs font-medium text-white/70">
                        ${item.amount.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom savings callout */}
                <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-3 flex items-center justify-between">
                  <p className="text-xs text-emerald-300/80">Potential monthly savings</p>
                  <p className="text-sm font-bold text-emerald-400">$3,840</p>
                </div>
              </div>

              {/* Floating cards */}
              {FLOAT_CARDS.map((card) => (
                <FloatCard key={card.label} {...card} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
