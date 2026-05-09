'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AISummaryCardProps {
  summary: string;
}

export default function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6 relative overflow-hidden rounded-2xl border border-brand-500/25 bg-gradient-to-br from-brand-600/10 to-violet-600/5 p-6"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">AI Summary</p>
        </div>
        <p className="text-sm leading-relaxed text-white/75">{summary}</p>
      </div>
    </motion.div>
  );
}
