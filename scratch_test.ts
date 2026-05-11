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
      tools: z.array(z.any()).min(1, 'Add at least one AI tool'),
    })
  );

const data = {
  teamSize: 10,
  useCase: "coding",
  tools: [
    { id: "1", tool: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
    { id: "2", tool: "", plan: "", monthlySpend: "", seats: 1 }
  ]
};

console.log(spendFormSchema.safeParse(data));
