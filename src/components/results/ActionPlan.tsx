'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, CheckCircle2, ArrowRight, Zap, Github, Sparkles, Bot, Key, Network, Code2, Wrench } from 'lucide-react';
import type { ToolRecommendation } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TOOL_ICONS: Record<string, any> = {
  Cursor: Zap,
  'GitHub Copilot': Github,
  Claude: Sparkles,
  ChatGPT: Bot,
  'OpenAI API': Key,
  'Anthropic API': Network,
  Gemini: Sparkles,
  Windsurf: Code2,
};

const TYPE_LABELS: Record<string, string> = {
  downgrade_plan: 'Wrong Plan',
  reduce_seats: 'Too Many Seats',
  switch_tool: 'Switch Tool',
  consolidate_tools: 'Consolidate',
  upgrade_plan: 'Upgrade Recommended',
  already_optimized: 'Optimized ✓',
};

interface ActionPlanProps {
  recommendations: ToolRecommendation[];
}

export default function ActionPlan({ recommendations }: ActionPlanProps) {
  const savings = recommendations.filter((r) => r.monthlySavings > 0);
  const optimized = recommendations.filter((r) => r.monthlySavings === 0);

  if (savings.length === 0) return null;

  const totalSavings = savings.reduce((s, r) => s + r.monthlySavings, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-400" />
            Your Action Plan
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            {savings.length} saving{savings.length > 1 ? 's' : ''} found · implement these to save {formatCurrency(totalSavings)}/month
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-emerald-400">{formatCurrency(totalSavings * 12)}</p>
          <p className="text-[10px] text-white/40">annual savings</p>
        </div>
      </div>

      {/* Action items */}
      <div className="space-y-3">
        {savings
          .sort((a, b) => b.monthlySavings - a.monthlySavings)
          .map((rec, i) => (
            <ActionCard key={rec.toolId} rec={rec} index={i} />
          ))}
      </div>

      {/* Optimized tools — collapsed */}
      {optimized.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="text-xs text-white/40 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {optimized.map((r) => r.toolName).join(', ')} — no changes needed
          </p>
        </div>
      )}
    </motion.section>
  );
}

function ActionCard({ rec, index }: { rec: ToolRecommendation; index: number }) {
  const isPriority = rec.priority === 'high';
  const isMedium = rec.priority === 'medium';
  const ToolIcon = TOOL_ICONS[rec.toolName] ?? Wrench;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 transition-all',
        isPriority
          ? 'border-rose-500/25 bg-rose-500/8'
          : isMedium
          ? 'border-amber-500/20 bg-amber-500/6'
          : 'border-brand-500/20 bg-brand-500/6'
      )}
    >
      {/* Priority pill */}
      <div className="absolute top-4 right-4">
        <span className={cn(
          'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
          isPriority ? 'bg-rose-500/20 text-rose-400' :
          isMedium ? 'bg-amber-500/15 text-amber-400' :
          'bg-brand-500/15 text-brand-400'
        )}>
          {TYPE_LABELS[rec.recommendationType] ?? rec.recommendationType}
        </span>
      </div>

      <div className="flex items-start gap-3 pr-28">
        {/* Tool icon */}
        <div className={cn(
          'p-2.5 rounded-xl border shrink-0',
          isPriority ? 'bg-rose-500/10 border-rose-500/20' : 
          isMedium ? 'bg-amber-500/10 border-amber-500/20' : 
          'bg-brand-500/10 border-brand-500/20'
        )}>
          <ToolIcon className={cn('h-5 w-5', isPriority ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-brand-400')} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Tool name + action */}
          <h3 className="text-sm font-bold text-white mb-1">{rec.toolName}</h3>

          {/* What they're doing now → what they should do */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-white/50 line-through">
              {rec.currentPlan}
            </span>
            <ArrowRight className="h-3 w-3 text-white/30 shrink-0" />
            <span className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-semibold',
              isPriority ? 'bg-rose-500/15 text-rose-300' :
              isMedium ? 'bg-amber-500/10 text-amber-300' :
              'bg-brand-500/15 text-brand-300'
            )}>
              {rec.recommendedPlan}
            </span>
          </div>

          {/* Plain-English reason */}
          <p className="text-xs text-white/55 leading-relaxed mb-3">{rec.reason}</p>

          {/* Action badge */}
          <div className="flex items-center gap-1.5">
            {isPriority
              ? <AlertTriangle className="h-3 w-3 text-rose-400" />
              : <TrendingDown className="h-3 w-3 text-amber-400" />
            }
            <p className="text-xs font-semibold text-white/70">{rec.action}</p>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <div className={cn(
        'mt-4 pt-4 border-t flex items-center justify-between',
        isPriority ? 'border-rose-500/15' : isMedium ? 'border-amber-500/10' : 'border-brand-500/10'
      )}>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span>Current: <span className="text-white/70 font-medium">{formatCurrency(rec.currentMonthlySpend)}/mo</span></span>
          <ArrowRight className="h-3 w-3" />
          <span>Optimized: <span className="text-emerald-400 font-medium">{formatCurrency(rec.recommendedMonthlyCost)}/mo</span></span>
          {rec.currentSeats > 1 && (
            <span className="text-white/30">({rec.currentSeats} seats)</span>
          )}
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold text-emerald-400">
            {formatCurrency(rec.monthlySavings)}
            <span className="text-xs font-normal text-emerald-400/60">/mo</span>
          </p>
          <p className="text-[10px] text-white/30">{formatCurrency(rec.annualSavings)}/year</p>
        </div>
      </div>
    </motion.div>
  );
}
