'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Legend
} from 'recharts';
import type { AuditResult } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

const TOOL_COLORS: Record<string, string> = {
  Cursor: '#6366f1', 'GitHub Copilot': '#8b5cf6', Claude: '#d97706',
  ChatGPT: '#10b981', 'OpenAI API': '#06b6d4', 'Anthropic API': '#f59e0b',
  Gemini: '#3b82f6', Windsurf: '#ec4899',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-surface-50/95 backdrop-blur-sm p-3 shadow-glass text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

interface SpendChartProps {
  audit: AuditResult;
}

export default function SpendChart({ audit }: SpendChartProps) {
  const data = audit.recommendations.map((rec) => ({
    name: rec.toolName.length > 10 ? rec.toolName.slice(0, 10) + '…' : rec.toolName,
    fullName: rec.toolName,
    Current: rec.currentMonthlySpend,
    Optimized: rec.recommendedMonthlyCost,
    color: TOOL_COLORS[rec.toolName] ?? '#6366f1',
  }));

  const summaryData = [
    { name: 'Current', value: audit.totalCurrentMonthlySpend, fill: '#ef4444' },
    { name: 'Optimized', value: audit.totalOptimizedMonthlySpend, fill: '#10b981' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 space-y-6"
    >
      <h2 className="text-lg font-bold text-white">Spend Visualization</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Per-tool comparison */}
        <div className="rounded-2xl border border-white/10 bg-surface-100 p-5">
          <p className="mb-4 text-sm font-medium text-white/70">Per-tool: Current vs Optimized</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} barGap={4}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="Current" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Total comparison */}
        <div className="rounded-2xl border border-white/10 bg-surface-100 p-5">
          <p className="mb-4 text-sm font-medium text-white/70">Total monthly spend</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summaryData} barGap={8}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {summaryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{formatCurrency(audit.totalCurrentMonthlySpend)}</p>
              <p className="text-[10px] text-white/40">Current/mo</p>
            </div>
            <div className="text-xs text-white/30">→</div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">{formatCurrency(audit.totalOptimizedMonthlySpend)}</p>
              <p className="text-[10px] text-white/40">Optimized/mo</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
