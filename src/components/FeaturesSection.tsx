'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Sparkles,
  GitCompare,
  Calendar,
  TrendingDown,
  Shield,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    title: 'Spend Tracking',
    description:
      'Get a crystal-clear breakdown of every AI tool subscription — monthly cost, seats, and actual usage.',
    badge: 'Core',
  },
  {
    icon: Sparkles,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Savings Recommendations',
    description:
      'AI-powered suggestions for consolidating tools, downgrading plans, and eliminating redundant subscriptions.',
    badge: 'AI-powered',
  },
  {
    icon: GitCompare,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'AI Tool Comparisons',
    description:
      'Side-by-side feature and price comparisons across equivalent AI tools. Switch confidently.',
    badge: 'New',
  },
  {
    icon: TrendingDown,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Plan Optimization',
    description:
      'Match your actual usage patterns to the right pricing tier. No more paying for features you skip.',
    badge: '',
  },
  {
    icon: Calendar,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    title: 'Annual Savings Forecast',
    description:
      'See your projected 12-month savings before you make any changes. Decide with confidence.',
    badge: '',
  },
  {
    icon: Shield,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    title: 'Spend Governance',
    description:
      'Centralise shadow AI spend and give your finance team full visibility into AI tool costs.',
    badge: '',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 bg-surface-50">
      {/* Glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            Features
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{' '}
            <span className="gradient-text">cut AI waste</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-white/45">
            From spend tracking to plan optimization — SpendPilot gives your team
            the tools to make every AI dollar count.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card-hover group relative overflow-hidden rounded-2xl border border-white/8 bg-surface-100 p-6"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent" />
              </div>

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg}`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  {feature.badge && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/50">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/45">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
