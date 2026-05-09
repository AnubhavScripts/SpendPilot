import { nanoid } from './utils';
import type { AIToolName } from '@/types';
import type {
  AuditInput,
  AuditResult,
  AuditToolInput,
  ConsolidationInsight,
  RecommendationType,
  ToolRecommendation,
} from '@/types/audit';
import {
  CODING_TOOLS,
  CHAT_TOOLS,
  calculateEffectiveCost,
  getPlanPricing,
  getToolPricing,
} from './pricing';

// ─── Individual tool recommendation logic ────────────────────────────────────

function auditTool(tool: AuditToolInput, teamSize: number): ToolRecommendation {
  const pricing = getToolPricing(tool.tool);
  const currentPlan = getPlanPricing(tool.tool, tool.plan);

  // Fallback: tool not in pricing database, just return it as-is
  if (!pricing || !currentPlan) {
    return {
      toolId: tool.id,
      toolName: tool.tool,
      currentPlan: tool.plan,
      currentMonthlySpend: tool.monthlySpend,
      currentSeats: tool.seats,
      recommendationType: 'already_optimized',
      recommendedPlan: tool.plan,
      recommendedMonthlyCost: tool.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      action: 'Keep current plan',
      reason: 'No pricing data available for this configuration.',
      priority: 'low',
    };
  }

  const effectiveCurrent = calculateEffectiveCost(currentPlan, tool.seats);
  const actualSpend = tool.monthlySpend;
  
  // ── Rule 1: Enterprise plan with very few users ──────────────────────────
  if (
    currentPlan.tier === 'enterprise' &&
    tool.seats < (currentPlan.enterpriseThreshold ?? 10)
  ) {
    // Find the best team/business plan
    const betterPlan = pricing.plans
      .filter((p) => p.tier === 'business' || p.tier === 'team')
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];

    if (betterPlan) {
      const betterCost = calculateEffectiveCost(betterPlan, tool.seats);
      const savings = actualSpend - betterCost;
      if (savings > 0) {
        return buildRecommendation(tool, 'downgrade_plan', betterPlan.label, betterCost, savings, 'high',
          `Downgrade to ${betterPlan.label}`,
          `You have only ${tool.seats} seat(s) on an Enterprise plan. Enterprise is only cost-effective above ${currentPlan.enterpriseThreshold} seats.`
        );
      }
    }
  }

  // ── Rule 2: Team plan with 1–2 users — suggest Individual ───────────────
  if (currentPlan.tier === 'team' && tool.seats <= 2) {
    const individualPlan = pricing.plans.find((p) => p.tier === 'individual');
    if (individualPlan) {
      // For 1–2 users, two individual plans may be cheaper
      const individualCostForTeam = individualPlan.monthlyPricePerSeat * tool.seats;
      const savings = actualSpend - individualCostForTeam;
      if (savings > 2) {
        return buildRecommendation(tool, 'downgrade_plan', individualPlan.label, individualCostForTeam, savings, 'high',
          `Switch to ${tool.seats} × ${individualPlan.label}`,
          `With only ${tool.seats} user(s), individual plans cost ${formatMoney(individualCostForTeam)}/mo vs the ${formatMoney(actualSpend)}/mo Team plan.`
        );
      }
    }
  }

  // ── Rule 3: Business/Team plan with seats > actual team size ─────────────
  if (currentPlan.isPerSeat && tool.seats > teamSize) {
    const optimizedCost = calculateEffectiveCost(currentPlan, teamSize);
    const savings = actualSpend - optimizedCost;
    if (savings > 0) {
      return buildRecommendation(tool, 'reduce_seats', currentPlan.label, optimizedCost, savings, 'high',
        `Reduce seats from ${tool.seats} to ${teamSize}`,
        `You have ${tool.seats} licensed seats but only ${teamSize} team members. Remove ${tool.seats - teamSize} unused seats.`
      );
    }
  }

  // ── Rule 4: Actual spend significantly exceeds plan list price ────────────
  if (actualSpend > effectiveCurrent * 1.3 && currentPlan.tier !== 'api') {
    // Overpaying vs list price — likely on a more expensive plan or paying for extras
    return buildRecommendation(tool, 'downgrade_plan', currentPlan.label, effectiveCurrent, actualSpend - effectiveCurrent, 'medium',
      `Audit your billing for ${tool.tool}`,
      `You're paying ${formatMoney(actualSpend)}/mo but the list price for ${currentPlan.label} with ${tool.seats} seat(s) is ${formatMoney(effectiveCurrent)}/mo. Review for unused add-ons.`
    );
  }

  // ── Rule 5: API tools with low spend — suggest checking usage ────────────
  if (currentPlan.tier === 'api' && actualSpend < 50 && actualSpend > 0) {
    return buildRecommendation(tool, 'already_optimized', currentPlan.label, actualSpend, 0, 'low',
      'Low API spend — looks healthy',
      `Your ${tool.tool} usage at ${formatMoney(actualSpend)}/mo is low. Consider setting budget alerts to prevent surprise overages.`
    );
  }

  // ── Rule 6: API tools with very high spend ───────────────────────────────
  if (currentPlan.tier === 'api' && actualSpend > 500) {
    return buildRecommendation(tool, 'downgrade_plan', currentPlan.label, actualSpend * 0.8, actualSpend * 0.2, 'medium',
      'High API spend — review usage patterns',
      `You're spending ${formatMoney(actualSpend)}/mo on ${tool.tool} API. Implement caching, prompt compression, and model tiering (use cheaper models for simpler tasks) to reduce costs ~20%.`
    );
  }

  // ── Default: already optimized ───────────────────────────────────────────
  return buildRecommendation(tool, 'already_optimized', currentPlan.label, actualSpend, 0, 'low',
    'Plan looks optimized',
    `${tool.tool} on ${currentPlan.label} appears appropriately priced for ${tool.seats} seat(s).`
  );
}

function buildRecommendation(
  tool: AuditToolInput,
  type: RecommendationType,
  recommendedPlan: string,
  recommendedCost: number,
  monthlySavings: number,
  priority: 'high' | 'medium' | 'low',
  action: string,
  reason: string
): ToolRecommendation {
  return {
    toolId: tool.id,
    toolName: tool.tool,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
    currentSeats: tool.seats,
    recommendationType: type,
    recommendedPlan,
    recommendedMonthlyCost: Math.max(0, recommendedCost),
    monthlySavings: Math.max(0, monthlySavings),
    annualSavings: Math.max(0, monthlySavings * 12),
    action,
    reason,
    priority,
  };
}

// ─── Consolidation Insights ──────────────────────────────────────────────────

function detectConsolidationInsights(
  tools: AuditToolInput[]
): ConsolidationInsight[] {
  const insights: ConsolidationInsight[] = [];
  const toolNames = tools.map((t) => t.tool);

  // Duplicate coding assistants
  const codingTools = toolNames.filter((n): n is AIToolName =>
    CODING_TOOLS.includes(n as AIToolName)
  );
  if (codingTools.length >= 2) {
    const codingSpend = tools
      .filter((t) => CODING_TOOLS.includes(t.tool as AIToolName))
      .reduce((sum, t) => sum + t.monthlySpend, 0);
    const cheapestCodingSpend = tools
      .filter((t) => CODING_TOOLS.includes(t.tool as AIToolName))
      .sort((a, b) => a.monthlySpend - b.monthlySpend)[0]?.monthlySpend ?? 0;

    insights.push({
      type: 'duplicate_coding',
      tools: codingTools,
      message: `You're using ${codingTools.join(', ')} simultaneously. These are overlapping AI coding assistants. Pick the one your team uses most.`,
      estimatedMonthlySavings: codingSpend - cheapestCodingSpend,
    });
  }

  // Duplicate chat/LLM tools
  const chatTools = toolNames.filter((n): n is AIToolName =>
    CHAT_TOOLS.includes(n as AIToolName)
  );
  if (chatTools.length >= 3) {
    const chatSpend = tools
      .filter((t) => CHAT_TOOLS.includes(t.tool as AIToolName))
      .reduce((sum, t) => sum + t.monthlySpend, 0);
    insights.push({
      type: 'duplicate_writing',
      tools: chatTools,
      message: `You're subscribing to ${chatTools.join(', ')}. Most workflows only need one or two LLM subscriptions. Consolidating could save significantly.`,
      estimatedMonthlySavings: Math.round(chatSpend * 0.4),
    });
  }

  return insights;
}

// ─── Main audit function ──────────────────────────────────────────────────────

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((tool) =>
    auditTool(tool, input.teamSize)
  );

  const consolidationInsights = detectConsolidationInsights(input.tools);

  const totalCurrentMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.currentMonthlySpend,
    0
  );

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  ) + consolidationInsights.reduce((sum, i) => sum + i.estimatedMonthlySavings, 0);

  const totalOptimizedMonthlySpend = Math.max(
    0,
    totalCurrentMonthlySpend - totalMonthlySavings
  );

  const savingsPercentage =
    totalCurrentMonthlySpend > 0
      ? Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)
      : 0;

  return {
    id: nanoid(16),
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    consolidationInsights,
    totalCurrentMonthlySpend,
    totalOptimizedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsPercentage,
  };
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
