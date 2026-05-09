'use client';

import { motion } from 'framer-motion';
import { GitMerge, Zap } from 'lucide-react';
import type { ConsolidationInsight } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

interface InsightsPanelProps {
  insights: ConsolidationInsight[];
}

const ICON_MAP = {
  duplicate_coding: '💻',
  duplicate_writing: '✍️',
  duplicate_research: '🔬',
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <h2 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
        <GitMerge className="h-4 w-4 text-brand-400" />
        Consolidation Opportunities
      </h2>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card-hover rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl">{ICON_MAP[insight.type] ?? '⚡'}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {insight.tools.join(' + ')} — Overlapping tools
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">{insight.message}</p>
                </div>
              </div>
              {insight.estimatedMonthlySavings > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-amber-400">
                    {formatCurrency(insight.estimatedMonthlySavings)}<span className="text-xs font-normal text-amber-400/60">/mo</span>
                  </p>
                  <p className="text-xs text-white/40">estimated</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
