import { describe, it, expect } from 'vitest';
import { runAudit } from '../src/lib/auditEngine';
import type { AuditInput } from '../src/types/audit';

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    teamSize: 10,
    useCase: 'coding',
    tools: [],
    ...overrides,
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Audit Engine — runAudit()', () => {

  it('returns zero savings when no tools are provided', () => {
    const result = runAudit(makeInput({ tools: [] }));
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.savingsPercentage).toBe(0);
  });

  it('detects seat-count overage and recommends reducing seats', () => {
    const result = runAudit(makeInput({
      teamSize: 5,
      tools: [{
        id: 't1',
        tool: 'GitHub Copilot',
        plan: 'Business ($19/seat/mo)',
        monthlySpend: 190, // 10 seats at $19 but team is only 5
        seats: 10,
      }],
    }));

    const rec = result.recommendations[0];
    expect(rec.recommendationType).toBe('reduce_seats');
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.annualSavings).toBe(rec.monthlySavings * 12);
  });

  it('flags team plan with 1 user — suggests downgrade to individual', () => {
    const result = runAudit(makeInput({
      teamSize: 3,
      tools: [{
        id: 't2',
        tool: 'Claude',
        plan: 'Team ($25/seat/mo)',
        monthlySpend: 25,
        seats: 1,
      }],
    }));

    const rec = result.recommendations[0];
    // 1 user on Team plan → should recommend Individual plan
    expect(rec.recommendationType).toBe('downgrade_plan');
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it('correctly calculates annual savings as 12x monthly', () => {
    const result = runAudit(makeInput({
      teamSize: 3,
      tools: [{
        id: 't3',
        tool: 'Cursor',
        plan: 'Business ($40/seat/mo)',
        monthlySpend: 200,
        seats: 1, // 1 seat, team plan is overkill
      }],
    }));

    const rec = result.recommendations[0];
    expect(rec.annualSavings).toBe(rec.monthlySavings * 12);
  });

  it('detects duplicate coding tools and surfaces consolidation insight', () => {
    const result = runAudit(makeInput({
      tools: [
        { id: 't4', tool: 'Cursor', plan: 'Pro ($20/mo)', monthlySpend: 20, seats: 1 },
        { id: 't5', tool: 'GitHub Copilot', plan: 'Individual ($10/mo)', monthlySpend: 10, seats: 1 },
        { id: 't6', tool: 'Windsurf', plan: 'Pro ($15/mo)', monthlySpend: 15, seats: 1 },
      ],
    }));

    const codingInsight = result.consolidationInsights.find(
      (i) => i.type === 'duplicate_coding'
    );
    expect(codingInsight).toBeDefined();
    expect(codingInsight!.estimatedMonthlySavings).toBeGreaterThan(0);
  });

  it('marks already-optimized plans as optimized with zero savings', () => {
    const result = runAudit(makeInput({
      teamSize: 1,
      tools: [{
        id: 't7',
        tool: 'Cursor',
        plan: 'Pro ($20/mo)',
        monthlySpend: 20,
        seats: 1,
      }],
    }));

    const rec = result.recommendations[0];
    // 1 person on Pro plan — no savings expected
    expect(rec.recommendationType).toBe('already_optimized');
    expect(rec.monthlySavings).toBe(0);
  });

  it('handles API tools with high spend by suggesting optimization', () => {
    const result = runAudit(makeInput({
      tools: [{
        id: 't8',
        tool: 'OpenAI API',
        plan: 'Pay-as-you-go',
        monthlySpend: 1200,
        seats: 1,
      }],
    }));

    const rec = result.recommendations[0];
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it('total current spend equals sum of all tool spends', () => {
    const result = runAudit(makeInput({
      tools: [
        { id: 't9', tool: 'Claude', plan: 'Pro ($20/mo)', monthlySpend: 20, seats: 1 },
        { id: 't10', tool: 'ChatGPT', plan: 'Plus ($20/mo)', monthlySpend: 20, seats: 1 },
      ],
    }));

    expect(result.totalCurrentMonthlySpend).toBe(40);
  });

  it('savings percentage is bounded between 0 and 100', () => {
    const result = runAudit(makeInput({
      teamSize: 2,
      tools: [{
        id: 't11',
        tool: 'GitHub Copilot',
        plan: 'Enterprise ($39/seat/mo)',
        monthlySpend: 78,
        seats: 2,
      }],
    }));

    expect(result.savingsPercentage).toBeGreaterThanOrEqual(0);
    expect(result.savingsPercentage).toBeLessThanOrEqual(100);
  });
});
