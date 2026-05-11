import { z } from 'zod';

const partialToolSchema = z.object({
  id: z.string(),
  tool: z.string().optional().default(''),
  plan: z.string().optional().default(''),
  monthlySpend: z.any().optional(),
  seats: z.any().optional(),
});

function isBlankTool(t: z.infer<typeof partialToolSchema>): boolean {
  const noTool = !t.tool || t.tool === '';
  const noPlan = !t.plan || t.plan === '';
  const noSpend = t.monthlySpend === '' || t.monthlySpend === undefined || t.monthlySpend === null || isNaN(Number(t.monthlySpend));
  return noTool && noPlan && noSpend;
}

const toolEntrySchema = z.object({
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

const spendFormSchema = z
  .object({
    teamSize: z.number().int().min(1).max(100000),
    useCase: z.enum(['coding', 'writing', 'research', 'data-analysis', 'mixed']),
    tools: z.array(partialToolSchema),
  })
  .transform((data) => {
    const filled = data.tools.filter((t) => !isBlankTool(t));
    return { ...data, tools: filled };
  })
  .pipe(
    z.object({
      teamSize: z.number().int().min(1).max(100000),
      useCase: z.enum(['coding', 'writing', 'research', 'data-analysis', 'mixed']),
      tools: z.array(toolEntrySchema).min(1, 'Add at least one AI tool'),
    })
  );

const data = {
  teamSize: 10,
  useCase: "coding",
  tools: [
    { id: "1", tool: "", plan: "", monthlySpend: "", seats: 1 }
  ]
};

const result = spendFormSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.flatten());
}
