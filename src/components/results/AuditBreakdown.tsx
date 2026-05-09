'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import type { ToolRecommendation } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TOOL_ICONS: Record<string, string> = {
  Cursor: '⚡', 'GitHub Copilot': '🐙', Claude: '🔮', ChatGPT: '🤖',
  'OpenAI API': '🔑', 'Anthropic API': '🧬', Gemini: '✨', Windsurf: '🏄',
};

const PRIORITY_CONFIG = {
  high: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'High Priority' },
  medium: { icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Medium Priority' },
  low: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Optimized' },
};

interface AuditBreakdownProps {
  recommendations: ToolRecommendation[];
}

export default function AuditBreakdown({ recommendations }: AuditBreakdownProps) {
  const sorted = [...recommendations].sort((a, b) => b.monthlySavings - a.monthlySavings);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <h2 className="mb-5 text-lg font-bold text-white">Per-Tool Breakdown</h2>
      <div className="space-y-4">
        {sorted.map((rec, i) => {
          const priority = PRIORITY_CONFIG[rec.priority];
          const Icon = priority.icon;
          const emoji = TOOL_ICONS[rec.toolName] ?? '🔧';

          return (
            <motion.div
              key={rec.toolId}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                'card-hover rounded-2xl border p-5',
                priority.border,
                priority.bg
              )}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: tool info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-white">{rec.toolName}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', priority.bg, priority.color, 'border', priority.border)}>
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mb-2">
                      Current: <span className="text-white/70">{rec.currentPlan}</span>
                      {' · '}{rec.currentSeats} seat{rec.currentSeats !== 1 ? 's' : ''}
                      {' · '}<span className="text-white/70">{formatCurrency(rec.currentMonthlySpend)}/mo</span>
                    </p>
                    {rec.recommendationType !== 'already_optimized' && (
                      <p className="text-xs text-white/50">
                        Recommended: <span className="text-brand-300 font-medium">{rec.recommendedPlan}</span>
                        {' → '}<span className="text-brand-300">{formatCurrency(rec.recommendedMonthlyCost)}/mo</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: savings */}
                {rec.monthlySavings > 0 && (
                  <div className="text-right shrink-0">
                    <p className="text-xl font-extrabold text-emerald-400">
                      {formatCurrency(rec.monthlySavings)}<span className="text-xs font-normal text-emerald-400/60">/mo</span>
                    </p>
                    <p className="text-xs text-white/40">{formatCurrency(rec.annualSavings)}/year</p>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              <div className="mt-4 pt-4 border-t border-white/8">
                <div className="flex gap-2">
                  <Icon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', priority.color)} />
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-0.5">{rec.action}</p>
                    <p className="text-xs text-white/45 leading-relaxed">{rec.reason}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
