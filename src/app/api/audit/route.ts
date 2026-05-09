import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAudit } from '@/lib/auditEngine';
import { generateFallbackSummary, buildAuditPrompt } from '@/lib/aiSummary';
import { saveAudit } from '@/lib/db';

const auditRequestSchema = z.object({
  teamSize: z.number().int().min(1),
  useCase: z.enum(['coding', 'writing', 'research', 'data-analysis', 'mixed']),
  tools: z.array(
    z.object({
      id: z.string(),
      tool: z.string(),
      plan: z.string(),
      monthlySpend: z.number().min(0),
      seats: z.number().int().min(1),
    })
  ).min(1),
});

// Simple in-memory rate limiter (per IP, 10 requests/minute)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { teamSize, useCase, tools } = parsed.data;

  // Run the deterministic audit engine
  const auditResult = runAudit({ teamSize, useCase, tools: tools as any });

  // Try to generate an AI summary (with fallback)
  let aiSummary: string;
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      const prompt = buildAuditPrompt(auditResult);
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey: anthropicKey });

      const message = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });

      aiSummary = (message.content[0] as { type: string; text: string }).text ?? generateFallbackSummary(auditResult);
    } else {
      aiSummary = generateFallbackSummary(auditResult);
    }
  } catch {
    aiSummary = generateFallbackSummary(auditResult);
  }

  auditResult.aiSummary = aiSummary;

  // Persist to Supabase (fire-and-forget — don't block the response)
  let shareSlug: string | null = null;
  try {
    shareSlug = await saveAudit(auditResult);
  } catch {
    // Supabase not configured yet — that's okay
  }

  return NextResponse.json({
    audit: auditResult,
    shareSlug,
  });
}
