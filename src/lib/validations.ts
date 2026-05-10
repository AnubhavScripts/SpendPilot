import { z } from 'zod';

export const toolEntrySchema = z.object({
  id: z.string().optional(),
  tool: z.string().min(1, 'Please select a tool'),
  plan: z.string().min(1, 'Please select a plan'),
  monthlySpend: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .min(0, 'Cannot be negative')
    .max(100000, 'Amount seems too high'),
  seats: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .int('Must be a whole number')
    .min(1, 'At least 1 seat required')
    .max(10000, 'Too many seats'),
});

// The form schema accepts any array of partial tool entries.
// Blank-row filtering and strict validation happen in the onSubmit handler.
// This prevents react-hook-form from rejecting the submit when empty rows exist.
export const spendFormSchema = z.object({
  teamSize: z
    .number({ invalid_type_error: 'Enter your team size' })
    .int('Must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(100000, 'That seems too large'),
  useCase: z.enum(['coding', 'writing', 'research', 'data-analysis', 'mixed'], {
    errorMap: () => ({ message: 'Please select a use case' }),
  }),
  tools: z.array(
    z.object({
      id: z.string().optional(),
      tool: z.string().optional().default(''),
      plan: z.string().optional().default(''),
      monthlySpend: z.any().optional(),
      seats: z.any().optional(),
    })
  ),
});

export type SpendFormSchema = z.infer<typeof spendFormSchema>;

/**
 * A tool row is considered incomplete (and silently skipped) if it has
 * no plan selected. This covers:
 *   - Fully blank rows (user added but filled nothing)
 *   - Partially filled rows (user selected a tool but deleted before picking a plan)
 * Only rows with BOTH tool AND plan filled are passed to the audit engine.
 */
export function isBlankTool(t: {
  tool?: string;
  plan?: string;
  monthlySpend?: unknown;
  seats?: unknown;
}): boolean {
  const noTool = !t.tool || t.tool.trim() === '';
  const noPlan = !t.plan || t.plan.trim() === '';
  // Skip if tool is empty (fully blank) OR plan is empty (partially filled / deleted mid-way)
  return noTool || noPlan;
}
