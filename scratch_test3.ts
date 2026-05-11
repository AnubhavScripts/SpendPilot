import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  tools: z.array(z.any()).min(1, 'Add at least one AI tool')
});

async function run() {
  const resolver = zodResolver(schema);
  const result = await resolver({ tools: [] }, undefined, { criteriaMode: "firstError", fields: {} } as any);
  console.log(JSON.stringify(result.errors, null, 2));
}

run();
