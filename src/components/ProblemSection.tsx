'use client';

import { motion } from 'framer-motion';
import { CreditCard, Copy, Package, TrendingUp } from 'lucide-react';

const PROBLEMS = [
  {
    icon: Copy,
    color: 'text-rose-400',
    bg: 'from-rose-500/15 to-rose-500/5',
    border: 'border-rose-500/20',
    title: 'Duplicate subscriptions',
    description:
      'Your team uses Cursor, Copilot, and Windsurf simultaneously. Three AI coding tools for the same job.',
    stat: '68% of startups',
    statLabel: 'have overlapping AI tools',
  },
  {
    icon: Package,
    color: 'text-amber-400',
    bg: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20',
    title: 'Wrong pricing plans',
    description:
      'Paying for Enterprise when 80% of your team only needs the Starter tier. Easy money to reclaim.',
    stat: '$1,200/mo avg',
    statLabel: 'wasted on oversized plans',
  },
  {
    icon: TrendingUp,
    color: 'text-violet-400',
    bg: 'from-violet-500/15 to-violet-500/5',
    border: 'border-violet-500/20',
    title: 'Unused enterprise tiers',
    description:
      'Locking into annual enterprise contracts for features like SSO and audit logs that you never use.',
    stat: '3.2x',
    statLabel: 'average cost vs actual usage',
  },
  {
    icon: CreditCard,
    color: 'text-brand-400',
    bg: 'from-brand-500/15 to-brand-500/5',
    border: 'border-brand-500/20',
    title: 'Shadow AI spend',
    description:
      'Individual contributors adding AI tools on personal cards, expensed monthly without central oversight.',
    stat: '42%',
    statLabel: 'of AI spend is ungoverned',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-28">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-rose-600/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
            The problem
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Where startup AI budgets{' '}
            <span className="gradient-text-warm">go to waste</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-white/45">
            AI tool spending is growing faster than governance. Most startups have no idea
            how much they&apos;re over-paying or why.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {PROBLEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`card-hover overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-6`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <p className={`text-xl font-extrabold ${item.color}`}>{item.stat}</p>
                  <p className="text-[11px] text-white/30">{item.statLabel}</p>
                </div>
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-white/45">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
