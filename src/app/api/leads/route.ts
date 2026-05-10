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
  // Full audit result — sent from the client so we can include it in the email
  auditResult: z.any().optional(),
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

  const { website, auditResult, ...leadData } = parsed.data;

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
        html: buildConfirmationEmail(leadData.totalMonthlySavings, auditResult),
      });

      // High-savings internal notification
      if (leadData.totalMonthlySavings > 500) {
        await resend.emails.send({
          from: `SpendPilot <${fromDomain}>`,
          to: fromDomain,
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

function buildConfirmationEmail(monthlySavings: number, audit?: any): string {
  const annualSavings = Math.round(monthlySavings * 12);

  // Build per-tool recommendation rows if we have full audit data
  const recommendationRows = audit?.recommendations?.length
    ? audit.recommendations
        .map((rec: any) => {
          const savingsColor = rec.monthlySavings > 0 ? '#34d399' : 'rgba(255,255,255,0.4)';
          const badge = rec.priority === 'high' ? '🔴 High' : rec.priority === 'medium' ? '🟡 Medium' : '🟢 Low';
          return `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                <div>
                  <span style="font-weight:700;color:white;font-size:14px">${rec.toolName}</span>
                  <span style="margin-left:8px;font-size:11px;color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px">${badge}</span>
                  <div style="margin-top:4px;font-size:12px;color:rgba(255,255,255,0.5)">${rec.currentPlan} → <strong style="color:rgba(255,255,255,0.8)">${rec.recommendedPlan}</strong></div>
                  <div style="margin-top:3px;font-size:12px;color:rgba(255,255,255,0.45)">${rec.action}</div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:16px;font-weight:800;color:${savingsColor}">$${Math.round(rec.monthlySavings)}/mo</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.35)">$${Math.round(rec.annualSavings)}/yr</div>
                </div>
              </div>
              <div style="margin-top:6px;font-size:12px;color:rgba(255,255,255,0.4);font-style:italic">${rec.reason}</div>
            </td>
          </tr>`;
        })
        .join('')
    : '';

  const aiSummaryBlock = audit?.aiSummary
    ? `<div style="background:rgba(99,102,241,0.08);border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:16px;margin:20px 0">
        <p style="margin:0 0 4px;font-size:11px;color:#818cf8;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">AI Analysis</p>
        <p style="margin:0;color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7">${audit.aiSummary}</p>
      </div>`
    : '';

  const toolTableBlock = recommendationRows
    ? `<div style="margin:28px 0">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em">Tool-by-Tool Breakdown</p>
        <table style="width:100%;border-collapse:collapse">${recommendationRows}</table>
      </div>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f17;font-family:Inter,system-ui,sans-serif;color:#f8fafc">
  <div style="max-width:600px;margin:40px auto;padding:0 16px">
    <div style="background:#18181f;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">

      <!-- Header -->
      <div style="padding:32px 40px 0">
        <div style="display:inline-flex;align-items:center;gap:8px;background:#4f46e5;border-radius:8px;padding:8px 12px;margin-bottom:28px">
          <span style="color:white;font-size:14px;font-weight:700">SpendPilot</span>
        </div>
        <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:white">Your AI Spend Audit is Ready</h1>
        <p style="margin:0 0 24px;color:rgba(255,255,255,0.45);font-size:14px">Here is the full breakdown of your AI tool spending</p>
      </div>

      <!-- Savings Hero -->
      <div style="padding:0 40px">
        <div style="background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(167,139,250,0.1));border:1px solid rgba(99,102,241,0.35);border-radius:14px;padding:28px;text-align:center;margin-bottom:24px">
          <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.12em">Potential Annual Savings</p>
          <p style="margin:0;font-size:48px;font-weight:900;color:#818cf8;line-height:1.1">$${annualSavings.toLocaleString()}</p>
          <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.4)">$${Math.round(monthlySavings).toLocaleString()}/month identified</p>
        </div>

        ${aiSummaryBlock}
        ${toolTableBlock}

        <p style="color:rgba(255,255,255,0.5);line-height:1.6;font-size:13px;margin:20px 0 32px">
          Log back into SpendPilot to view your interactive dashboard, share this report with your team, or generate a new audit as your stack evolves.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">
          SpendPilot — AI spend auditing for startups<br>
          You are receiving this because you requested an audit. No account required.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}
