import type { AIToolName, UseCase } from './index';

// ─── Audit Engine Types ────────────────────────────────────────────────────

export interface AuditToolInput {
  id: string;
  tool: AIToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: UseCase;
  tools: AuditToolInput[];
}

export type RecommendationType =
  | 'downgrade_plan'
  | 'upgrade_plan'
  | 'consolidate_tools'
  | 'reduce_seats'
  | 'switch_tool'
  | 'already_optimized';

export interface ToolRecommendation {
  toolId: string;
  toolName: AIToolName;
  currentPlan: string;
  currentMonthlySpend: number;
  currentSeats: number;
  recommendationType: RecommendationType;
  recommendedPlan: string;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  action: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ConsolidationInsight {
  type: 'duplicate_coding' | 'duplicate_writing' | 'duplicate_research';
  tools: AIToolName[];
  message: string;
  estimatedMonthlySavings: number;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  consolidationInsights: ConsolidationInsight[];
  totalCurrentMonthlySpend: number;
  totalOptimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  aiSummary?: string;
}

// ─── Lead Types ─────────────────────────────────────────────────────────────

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalMonthlySavings: number;
}

export interface LeadSubmitResult {
  success: boolean;
  error?: string;
}

// ─── Database Row Types ──────────────────────────────────────────────────────

export interface AuditRow {
  id: string;
  created_at: string;
  team_size: number;
  use_case: string;
  total_monthly_spend: number;
  total_optimized_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  savings_percentage: number;
  ai_summary: string | null;
  share_slug: string;
}

export interface AuditToolRow {
  id: string;
  audit_id: string;
  tool_name: string;
  current_plan: string;
  current_monthly_spend: number;
  current_seats: number;
  recommended_plan: string;
  recommended_monthly_cost: number;
  monthly_savings: number;
  annual_savings: number;
  action: string;
  reason: string;
  recommendation_type: string;
  priority: string;
}

export interface LeadRow {
  id: string;
  created_at: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  audit_id: string;
  total_monthly_savings: number;
}
