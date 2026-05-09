'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Percent } from 'lucide-react';
import type { AuditResult } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = 0;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(start + (end - start) * eased);
      if (el) el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [value, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

interface SavingsHeroProps {
  audit: AuditResult;
}

export default function SavingsHero({ audit }: SavingsHeroProps) {
  const { totalMonthlySavings, totalAnnualSavings, savingsPercentage, totalCurrentMonthlySpend } = audit;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Your AI Spend Audit Results
      </h1>
      <p className="mb-8 text-sm text-white/50">
        We analyzed {audit.input.tools.length} tool{audit.input.tools.length !== 1 ? 's' : ''} for your {audit.input.teamSize}-person team
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Annual savings — biggest metric */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-full sm:col-span-1 relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 to-brand-800/10 p-6 glow-purple"
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-brand-400" />
              <p className="text-xs font-medium text-brand-300/80">Annual Savings Found</p>
            </div>
            <p className="text-4xl font-extrabold text-white sm:text-5xl">
              $<AnimatedNumber value={Math.round(totalAnnualSavings)} />
            </p>
            <p className="mt-1 text-xs text-white/40">per year</p>
          </div>
        </motion.div>

        {/* Monthly savings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-surface-100 p-6"
        >
          <div className="mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <p className="text-xs font-medium text-white/60">Monthly Savings</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">
            $<AnimatedNumber value={Math.round(totalMonthlySavings)} />
          </p>
          <p className="mt-1 text-xs text-white/40">per month</p>
        </motion.div>

        {/* Savings percentage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-surface-100 p-6"
        >
          <div className="mb-2 flex items-center gap-2">
            <Percent className="h-4 w-4 text-amber-400" />
            <p className="text-xs font-medium text-white/60">Reduction</p>
          </div>
          <p className="text-3xl font-extrabold text-amber-400">
            <AnimatedNumber value={savingsPercentage} suffix="%" />
          </p>
          <p className="mt-1 text-xs text-white/40">of {formatCurrency(totalCurrentMonthlySpend)}/mo budget</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
