'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CredexBannerProps {
  monthlySavings: number;
}

export default function CredexBanner({ monthlySavings }: CredexBannerProps) {
  const annualSavings = monthlySavings * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600/15 via-brand-600/10 to-emerald-600/15 p-6"
    >
      <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            High savings detected
          </div>
          <h3 className="text-base font-bold text-white">
            You could save {formatCurrency(annualSavings)}/year
          </h3>
          <p className="mt-1 text-sm text-white/55 max-w-md">
            Teams saving over {formatCurrency(500)}/month benefit from a free 30-minute
            optimization call with our AI procurement specialists at Credex.
          </p>
        </div>

        <button className="group shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 active:translate-y-0">
          <Calendar className="h-4 w-4" />
          Book Free Call
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
