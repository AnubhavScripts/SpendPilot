# Unit Economics & Monetization Strategy

If this tool were deployed as a lead-generation asset for a procurement/SaaS negotiation firm (like Credex), here is the mathematical breakdown of the unit economics.

## 💎 What is a Converted Lead Worth?
A qualified lead is a company with a high Total Identified Savings (>$10,000/year). 
- If the firm charges a **15% contingency fee** on first-year savings, an average $10k savings lead is worth **$1,500** in gross revenue.
- Assuming an 80% margin on the negotiation service, the **LTV (Lifetime Value) of a qualified lead is ~$1,200.**

## 💸 CAC (Customer Acquisition Cost) Estimates
Based on our GTM strategy:
- **Organic Social/Reddit/Slack:** $0 hard cost, but roughly $50 in time/labor per qualified lead.
- **Paid LinkedIn Ads (Future):** Targeting VP Engineering at 50-200 employee companies is expensive. Estimated CPC is $8. At a 5% audit conversion and 10% lead capture rate, the pure paid **CAC would be ~$1,600**. 

*Conclusion:* Paid ads are not viable initially. The tool must rely on product-led growth (PLG) and organic sharing via the `shareSlug` mechanism.

## 📊 Conversion Math for Profitability
To run a profitable organic motion, we need the following funnel:
1. **1,000** Landing Page Visitors
2. **200** Audits Generated (20% conversion)
3. **30** Emails Captured (15% lead conversion)
4. **15** Qualified Leads (50% have >$5k in savings)
5. **3** Consultations Booked (20% book rate)
6. **1** Closed Deal (33% close rate)

For every 1,000 organic visitors, we close 1 deal worth $1,500. Our server costs (Vercel free tier + Supabase free tier + minimal Resend costs) are effectively $0.

## 🚀 The Path to $1M ARR
To generate $1,000,000 in Annual Recurring Revenue in 18 months, what must be true?
- At $1,500 per closed deal, we need **667 closed deals**.
- With our funnel math (1,000 visitors = 1 closed deal), we need **667,000 targeted unique visitors** over 18 months (~37,000 visitors/month).
- **Is this true?** No. Generating 37k targeted B2B VP of Engineering visits purely organically every month is highly improbable.

**The Pivot Required for $1M ARR:**
To hit $1M ARR, SpendPilot cannot just be a lead-gen calculator. It must evolve into a **B2B SaaS product** that companies pay for continuously. 
- Pivot to an OAuth-integrated dashboard that continuously monitors Google Workspace/Okta for unused licenses.
- Charge a flat **$299/month** subscription.
- To hit $1M ARR, we only need **278 active subscribers**. This is a vastly more realistic objective than closing 667 contingency-fee consulting deals.
