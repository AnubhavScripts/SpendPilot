'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { AuditResult } from '@/types/audit';
import Navbar from '@/components/Navbar';
import SavingsHero from '@/components/results/SavingsHero';
import AuditBreakdown from '@/components/results/AuditBreakdown';
import SpendChart from '@/components/results/SpendChart';
import InsightsPanel from '@/components/results/InsightsPanel';
import AISummaryCard from '@/components/results/AISummaryCard';
import LeadCaptureModal from '@/components/results/LeadCaptureModal';
import CredexBanner from '@/components/results/CredexBanner';
import ActionPlan from '@/components/results/ActionPlan';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('spendpilot_audit');
    const slug = sessionStorage.getItem('spendpilot_slug');

    if (!raw) {
      router.replace('/audit');
      return;
    }
    try {
      setAudit(JSON.parse(raw) as AuditResult);
      setShareSlug(slug);
    } catch {
      router.replace('/audit');
    }

    // Show lead modal after 5 seconds
    const t = setTimeout(() => setShowLeadModal(true), 5000);
    return () => clearTimeout(t);
  }, [router]);

  const handleCopyLink = () => {
    const url = shareSlug
      ? `${window.location.origin}/audit/${shareSlug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!audit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-white/40">Running your audit...</p>
        </div>
      </div>
    );
  }

  const isHighSavings = audit.totalMonthlySavings >= 500;
  const isOptimized = audit.totalMonthlySavings < 30 && audit.consolidationInsights.length === 0;
  const highPriorityCount = audit.recommendations.filter(r => r.priority === 'high').length;

  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pb-32 pt-24 sm:px-6 lg:px-8">

        {/* ── Top bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/audit"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit inputs
            </Link>
            <span className="text-white/20">·</span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-400 font-medium">
              ✓ Audit Complete
            </span>
            {highPriorityCount > 0 && (
              <>
                <span className="text-white/20">·</span>
                <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-xs text-rose-400 font-medium">
                  {highPriorityCount} high-priority item{highPriorityCount > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
            ) : (
              <><Share2 className="h-3.5 w-3.5" />Share Report</>
            )}
          </button>
        </motion.div>

        {/* ── 1. Savings Hero ── */}
        <SavingsHero audit={audit} />

        {/* ── 2. AI Summary ── */}
        {audit.aiSummary && (
          <AISummaryCard summary={audit.aiSummary} />
        )}

        {/* ── 3. Credex CTA for high savers ── */}
        {isHighSavings && (
          <CredexBanner monthlySavings={audit.totalMonthlySavings} />
        )}

        {/* ── 4. Action Plan (prioritised recommendations) ── */}
        <ActionPlan recommendations={audit.recommendations} />

        {/* ── 5. Spend Chart ── */}
        <SpendChart audit={audit} />

        {/* ── 6. Consolidation Insights ── */}
        {audit.consolidationInsights.length > 0 && (
          <InsightsPanel insights={audit.consolidationInsights} />
        )}

        {/* ── 7. Full per-tool breakdown ── */}
        <AuditBreakdown recommendations={audit.recommendations} />

        {/* ── 8. Optimized state ── */}
        {isOptimized && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-8 text-center"
          >
            <p className="text-3xl mb-3">🎉</p>
            <h3 className="text-lg font-bold text-emerald-300">Your AI stack is well-optimized!</h3>
            <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
              No significant savings found right now. Check back as your team grows or new pricing tiers become available.
            </p>
          </motion.div>
        )}

        {/* ── 9. Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-white/40 mb-4">Want to save your results?</p>
          <button
            onClick={() => setShowLeadModal(true)}
            className="rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 transition-all hover:-translate-y-0.5"
          >
            Email Me My Audit Report
          </button>
        </motion.div>
      </div>

      {/* ── Lead capture modal ── */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        auditId={audit.id}
        totalMonthlySavings={audit.totalMonthlySavings}
      />
    </main>
  );
}
