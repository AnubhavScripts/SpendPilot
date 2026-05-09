import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/db';
import { Resend } from 'resend';

const leadSchema = z.object({
  email: z.string().email('Valid email required'),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().min(1).max(100000).optional(),
  auditId: z.string().min(1),
  totalMonthlySavings: z.number().min(0),
  // Honeypot field — bots fill this in, humans leave it blank
  website: z.string().max(0, 'Bot detected').optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // Check for honeypot specifically
    const websiteError = parsed.error.errors.find((e) => e.path[0] === 'website');
    if (websiteError) {
      // Silently succeed for bots — don't reveal the honeypot
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { website, ...leadData } = parsed.data;

  const result = await saveLead(leadData);

  if (!result.success) {
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
  }

  // Send confirmation email via Resend (if configured)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !result.isDuplicate) {
    try {
      const resend = new Resend(resendKey);
      const fromDomain = process.env.RESEND_FROM_EMAIL ?? 'noreply@spendpilot.dev';

      await resend.emails.send({
        from: `SpendPilot <${fromDomain}>`,
        to: leadData.email,
        subject: `Your AI Spend Audit Results — $${Math.round(leadData.totalMonthlySavings * 12).toLocaleString()}/year in potential savings`,
        html: buildConfirmationEmail(leadData.totalMonthlySavings),
      });

      // High-savings follow-up for Credex
      if (leadData.totalMonthlySavings > 500) {
        await resend.emails.send({
          from: `SpendPilot <${fromDomain}>`,
          to: fromDomain, // Internal notification
          subject: `[HIGH-VALUE LEAD] ${leadData.email} — $${Math.round(leadData.totalMonthlySavings)}/mo savings`,
          html: `<p>New high-value lead: <strong>${leadData.email}</strong> from ${leadData.companyName ?? 'Unknown'} (${leadData.teamSize ?? '?'} people). Monthly savings: $${leadData.totalMonthlySavings}.</p>`,
        });
      }
    } catch (err) {
      console.error('[leads] Email send failed:', err);
      // Don't fail the request if email fails
    }
  }

  return NextResponse.json({ success: true, isDuplicate: result.isDuplicate ?? false });
}

function buildConfirmationEmail(monthlySavings: number): string {
  const annualSavings = Math.round(monthlySavings * 12);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f17;font-family:Inter,system-ui,sans-serif;color:#f8fafc">
  <div style="max-width:560px;margin:40px auto;padding:40px;background:#18181f;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
    <div style="margin-bottom:28px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#4f46e5;border-radius:8px;padding:8px 12px">
        <span style="color:white;font-size:14px;font-weight:700">⚡ SpendPilot</span>
      </div>
    </div>

    <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:white">
      Your audit is ready ✓
    </h1>

    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(167,139,250,0.08));border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:24px;margin:24px 0;text-align:center">
      <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em">Potential annual savings</p>
      <p style="margin:0;font-size:40px;font-weight:900;color:#818cf8">$${annualSavings.toLocaleString()}</p>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.4)">$${Math.round(monthlySavings).toLocaleString()}/month identified</p>
    </div>

    <p style="color:rgba(255,255,255,0.6);line-height:1.6;font-size:14px">
      We've saved your audit results. Share your personalized report with your team or bookmark it for your next budget review.
    </p>

    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)">
      SpendPilot — AI spend auditing for startups<br>
      You're receiving this because you requested an audit.
    </p>
  </div>
</body>
</html>`;
}
