import { z } from 'zod';

export const toolEntrySchema = z.object({
  id: z.string(),
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

export const spendFormSchema = z.object({
  teamSize: z
    .number({ invalid_type_error: 'Enter your team size' })
    .int('Must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(100000, 'That seems too large'),
  useCase: z.enum(['coding', 'writing', 'research', 'data-analysis', 'mixed'], {
    errorMap: () => ({ message: 'Please select a use case' }),
  }),
  tools: z.array(toolEntrySchema).min(1, 'Add at least one AI tool'),
});

export type SpendFormSchema = z.infer<typeof spendFormSchema>;
