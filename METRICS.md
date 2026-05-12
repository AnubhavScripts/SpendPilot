# Product Metrics & Instrumentation

## 🌟 North Star Metric
**Identified Monthly Savings (IMS)**
*Why:* SpendPilot is a B2B lead-generation tool. The core value proposition to the user (saving money) is perfectly aligned with the value to the business (higher IMS = higher quality leads for procurement/negotiation services). Tracking raw "Daily Active Users" is useless for a tool used once a quarter; tracking the exact dollar amount of savings we expose is the ultimate measure of product-market fit.

## 📊 Core Input Metrics (The Funnel)
To drive our North Star, we track three specific input metrics:

1. **Audit Completion Rate:** 
   *(Audits Generated / Landing Page Visitors)*
   Measures the friction of the dynamic form. If this drops below 15%, the form is too complex or asking for too much data upfront.
2. **Lead Conversion Rate:** 
   *(Emails Captured / Audits Generated)*
   Measures the effectiveness of the "Locking" mechanism on the Action Plan. If users see their High-Level Savings but refuse to give their email to see the tool-by-tool breakdown, the perceived value is too low.
3. **Average Savings Per Audit (ASPA):**
   Measures whether we are attracting our target persona (Startups/Mid-market) or just individual hobbyists. If ASPA is <$50/mo, our top-of-funnel marketing is targeting the wrong demographic.

## 🛠️ Instrumentation Plan (What we track first)
1. `audit_started` (Event): Triggers when a user clicks "Add Tool".
2. `audit_generated` (Event): Captures the `totalSpend` and `totalSavings` as event properties.
3. `lead_captured` (Event): Triggers when the Resend email fires successfully.
4. `report_shared` (Event): Triggers when a user copies the `shareSlug` to send to their team.

## 🔄 Pivot Trigger
If **Lead Conversion Rate is < 5%** after 1,000 generated audits, it means users do not value the itemized action plan enough to trade their email. 
*Pivot Decision:* We would remove the email wall entirely, make the tool 100% open, and pivot to a "Book a Consultation" CTA at the very bottom of the fully exposed report.
