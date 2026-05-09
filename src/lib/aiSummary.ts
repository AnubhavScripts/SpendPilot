import type { AuditInput, AuditResult } from '@/types/audit';

/**
 * Generates a personalized 100-word audit summary via Claude.
 * Falls back to a deterministic template if the API fails.
 */
export async function generateAISummary(
  auditResult: AuditResult
): Promise<string> {
  const { input, totalMonthlySavings, totalCurrentMonthlySpend, recommendations, consolidationInsights } = auditResult;

  try {
    const response = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditResult }),
    });

    if (!response.ok) throw new Error('AI API failed');

    const data = await response.json();
    if (data.summary && typeof data.summary === 'string') {
      return data.summary;
    }
    throw new Error('Invalid response');
  } catch {
    // Graceful fallback to templated summary
    return generateFallbackSummary(auditResult);
  }
}

export function generateFallbackSummary(result: AuditResult): string {
  const { input, totalMonthlySavings, totalCurrentMonthlySpend, recommendations, consolidationInsights } = result;
  const savingsPct = result.savingsPercentage;
  const toolCount = input.tools.length;
  const highPriority = recommendations.filter((r) => r.priority === 'high');
  const topRec = highPriority[0];

  if (totalMonthlySavings === 0) {
    return `Your AI stack of ${toolCount} tool${toolCount !== 1 ? 's' : ''} is well-optimized for a team of ${input.teamSize}. You're spending $${totalCurrentMonthlySpend.toFixed(0)}/month efficiently. No significant savings opportunities were detected, though we recommend reviewing API usage monthly to catch cost creep early. Keep monitoring as your team scales.`;
  }

  const consolidationNote =
    consolidationInsights.length > 0
      ? ` We also spotted ${consolidationInsights.length} consolidation opportunity${consolidationInsights.length > 1 ? 'ies' : 'y'} — overlapping tools that could be merged.`
      : '';

  const topRecNote = topRec
    ? ` The biggest win: ${topRec.action} on ${topRec.toolName}, saving $${topRec.monthlySavings.toFixed(0)}/month.`
    : '';

  return `SpendPilot analyzed ${toolCount} AI tool${toolCount !== 1 ? 's' : ''} for your ${input.teamSize}-person team and found $${totalMonthlySavings.toFixed(0)}/month in potential savings — a ${savingsPct}% reduction on your current $${totalCurrentMonthlySpend.toFixed(0)}/month AI budget.${topRecNote}${consolidationNote} Implementing these changes would save you $${(totalMonthlySavings * 12).toFixed(0)} annually. Act on the high-priority items first for the fastest return.`;
}

export function buildAuditPrompt(auditResult: AuditResult): string {
  const { input, totalMonthlySavings, totalCurrentMonthlySpend, recommendations } = auditResult;

  const toolList = input.tools
    .map((t) => `- ${t.tool}: ${t.plan}, ${t.seats} seat(s), $${t.monthlySpend}/mo`)
    .join('\n');

  const recList = recommendations
    .filter((r) => r.monthlySavings > 0)
    .map((r) => `- ${r.toolName}: ${r.action} → saves $${r.monthlySavings}/mo`)
    .join('\n');

  return `You are a financial analyst specializing in AI tool procurement for startups.

A ${input.teamSize}-person startup using AI primarily for ${input.useCase} has this monthly AI spend:
${toolList}

Total spend: $${totalCurrentMonthlySpend}/month
Potential savings identified: $${totalMonthlySavings}/month

Key recommendations:
${recList || 'No major savings found — stack appears optimized.'}

Write a 80-110 word personalized audit summary that:
1. Opens with their specific overspending situation
2. Calls out the 1-2 biggest savings opportunities by name
3. Ends with a confident, encouraging next step
4. Sounds professional but conversational — like a trusted advisor
5. Does NOT use generic filler phrases like "Additionally" or "Furthermore"

Return ONLY the summary text, no headers or metadata.`;
}
