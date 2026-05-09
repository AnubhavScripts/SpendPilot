import type { AuditResult, AuditRow, AuditToolRow } from '@/types/audit';
import { nanoid } from './utils';

function getClient() {
  const { getServiceClient } = require('./supabase');
  return getServiceClient();
}

export async function saveAudit(result: AuditResult): Promise<string | null> {
  const shareSlug = nanoid(10);

  try {
    const client = getClient();

    const { error: auditError } = await client.from('audits').insert({
      id: result.id,
      created_at: result.createdAt,
      team_size: result.input.teamSize,
      use_case: result.input.useCase,
      total_monthly_spend: result.totalCurrentMonthlySpend,
      total_optimized_spend: result.totalOptimizedMonthlySpend,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      savings_percentage: result.savingsPercentage,
      ai_summary: result.aiSummary ?? null,
      share_slug: shareSlug,
    });

    if (auditError) {
      console.error('[saveAudit]', auditError.message);
      return null;
    }

    const toolRows = result.recommendations.map((rec) => ({
      audit_id: result.id,
      tool_name: rec.toolName,
      current_plan: rec.currentPlan,
      current_monthly_spend: rec.currentMonthlySpend,
      current_seats: rec.currentSeats,
      recommended_plan: rec.recommendedPlan,
      recommended_monthly_cost: rec.recommendedMonthlyCost,
      monthly_savings: rec.monthlySavings,
      annual_savings: rec.annualSavings,
      action: rec.action,
      reason: rec.reason,
      recommendation_type: rec.recommendationType,
      priority: rec.priority,
    }));

    const { error: toolsError } = await client.from('audit_tools').insert(toolRows);
    if (toolsError) console.error('[saveAudit tools]', toolsError.message);

    return shareSlug;
  } catch (err: any) {
    // Supabase not configured — silently skip persistence
    if (err?.message?.includes('not configured')) return null;
    console.error('[saveAudit] Unexpected:', err);
    return null;
  }
}

export async function getAuditBySlug(slug: string): Promise<AuditRow | null> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('audits')
      .select('*')
      .eq('share_slug', slug)
      .single();
    if (error || !data) return null;
    return data as AuditRow;
  } catch {
    return null;
  }
}

export async function getAuditToolsByAuditId(auditId: string): Promise<AuditToolRow[]> {
  try {
    const client = getClient();
    const { data, error } = await client
      .from('audit_tools')
      .select('*')
      .eq('audit_id', auditId);
    if (error || !data) return [];
    return data as AuditToolRow[];
  } catch {
    return [];
  }
}

export async function saveLead(lead: {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalMonthlySavings: number;
}): Promise<{ success: boolean; isDuplicate?: boolean }> {
  try {
    const client = getClient();

    const { data: existing } = await client
      .from('leads')
      .select('id')
      .eq('email', lead.email)
      .maybeSingle();

    if (existing) return { success: true, isDuplicate: true };

    const { error } = await client.from('leads').insert({
      email: lead.email,
      company_name: lead.companyName ?? null,
      role: lead.role ?? null,
      team_size: lead.teamSize ?? null,
      audit_id: lead.auditId,
      total_monthly_savings: lead.totalMonthlySavings,
    });

    if (error) {
      console.error('[saveLead]', error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err: any) {
    if (err?.message?.includes('not configured')) {
      // Return success so the UX flow isn't broken
      return { success: true };
    }
    console.error('[saveLead] Unexpected:', err);
    return { success: false };
  }
}
