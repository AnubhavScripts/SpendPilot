# METRICS.md — SpendPilot KPIs and Instrumentation

## North Star Metric

**Total verified savings unlocked by users**  
(sum of totalMonthlySavings across all completed audits × 12)

This metric grows when:
- More users complete audits (acquisition)
- Users with higher AI spend use SpendPilot (targeting)
- Audit engine accuracy improves (product quality)

---

## Funnel Metrics

| Stage | Metric | Target |
|---|---|---|
| Awareness | Landing page visits | – |
| Interest | Clicks to /audit | > 15% CTR from LP |
| Activation | Audit form submitted | > 60% of /audit visitors |
| Value | Results page viewed | > 90% of submitters |
| Lead | Email captured | > 30% of results viewers |
| Retention | Return visits | > 20% within 30 days |

---

## Key Events to Track

```typescript
// Suggested analytics events (PostHog / Mixpanel)

track('audit_started')          // /audit page load
track('tool_added', { tool })   // each tool added to form
track('audit_submitted', {
  tool_count,
  total_monthly_spend,
})
track('audit_completed', {
  total_monthly_savings,
  savings_percentage,
  use_case,
})
track('lead_captured', {
  has_company,
  total_monthly_savings,
})
track('report_shared')          // share link copied
track('credex_cta_clicked')     // high-savings CTA
```

---

## Instrumentation Plan

**Phase 1 (now)**: Add PostHog or Plausible for page-level analytics  
**Phase 2**: Add custom event tracking at key funnel points  
**Phase 3**: Dashboard showing real-time audit volume and savings unlocked
