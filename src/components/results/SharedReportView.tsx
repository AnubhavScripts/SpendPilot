'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingDown, Percent, Github, Sparkles, Bot, Key, Network, Code2, Wrench } from 'lucide-react';
import type { AuditRow, AuditToolRow } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

const TOOL_ICONS: Record<string, any> = {
  Cursor: Zap, 'GitHub Copilot': Github, Claude: Sparkles, ChatGPT: Bot,
  'OpenAI API': Key, 'Anthropic API': Network, Gemini: Sparkles, Windsurf: Code2,
};

interface SharedReportViewProps {
  audit: AuditRow;
  tools: AuditToolRow[];
}

export default function SharedReportView({ audit, tools }: SharedReportViewProps) {
  const sortedTools = [...tools].sort((a, b) => b.monthly_savings - a.monthly_savings);

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600">
            <Zap className="h-3 w-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-white/50">SpendPilot · Shared Audit Report</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          AI Spend Audit Results
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {audit.team_size}-person team · {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: 'Annual Savings', value: formatCurrency(audit.total_annual_savings), icon: TrendingDown, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/25' },
          { label: 'Monthly Savings', value: formatCurrency(audit.total_monthly_savings), icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Budget Reduction', value: `${audit.savings_percentage}%`, icon: Percent, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border ${metric.border} ${metric.bg} p-5`}
          >
            <p className="text-xs text-white/50 mb-1">{metric.label}</p>
            <p className={`text-2xl font-extrabold ${metric.color}`}>{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Summary */}
      {audit.ai_summary && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-2xl border border-brand-500/25 bg-brand-600/10 p-5"
        >
          <p className="text-xs font-semibold text-brand-400 mb-2 uppercase tracking-widest">AI Summary</p>
          <p className="text-sm text-white/70 leading-relaxed">{audit.ai_summary}</p>
        </motion.div>
      )}

      {/* Tool recommendations */}
      <h2 className="text-lg font-bold text-white mb-4">Recommendations</h2>
      <div className="space-y-3">
        {sortedTools.map((tool, i) => {
          const ToolIcon = TOOL_ICONS[tool.tool_name] ?? Wrench;
          return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="rounded-xl border border-white/10 bg-surface-100 p-4"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 shrink-0">
                  <ToolIcon className="h-4 w-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tool.tool_name}</p>
                  <p className="text-xs text-white/40">{tool.current_plan} → <span className="text-brand-300">{tool.recommended_plan}</span></p>
                </div>
              </div>
              {tool.monthly_savings > 0 && (
                <p className="text-base font-bold text-emerald-400 shrink-0">
                  {formatCurrency(tool.monthly_savings)}/mo
                </p>
              )}
            </div>
            {tool.reason && (
              <p className="mt-2 text-xs text-white/40 leading-relaxed pl-9">{tool.reason}</p>
            )}
          </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-white/40 mb-3">Want to audit your own AI stack?</p>
        <a
          href="/audit"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
        >
          <Zap className="h-3.5 w-3.5" />
          Start Your Free Audit →
        </a>
      </motion.div>
    </div>
  );
}
