'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calculator, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateId, cn } from '@/lib/utils';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { spendFormSchema, type SpendFormSchema } from '@/lib/validations';
import { USE_CASES } from '@/constants';
import { runAudit } from '@/lib/auditEngine';
import { generateFallbackSummary } from '@/lib/aiSummary';
import ToolInputCard from './ToolInputCard';

export default function SpendForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { save, load, clear } = useFormPersistence();
  const router = useRouter();

  const methods = useForm<SpendFormSchema>({
    resolver: zodResolver(spendFormSchema),
    defaultValues: {
      teamSize: '' as unknown as number,
      useCase: '' as any,
      tools: [{ id: generateId(), tool: '', plan: '', monthlySpend: '' as any, seats: 1 }],
    },
  });

  const { control, handleSubmit, register, watch, reset, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'tools' });
  const watchedData = watch();

  useEffect(() => {
    setIsClient(true);
    const saved = load();
    if (saved) reset(saved as any);
  }, [load, reset]);

  useEffect(() => {
    if (isClient) save(watchedData as any);
  }, [watchedData, isClient, save]);

  const onSubmit = async (data: SpendFormSchema) => {
    setIsSubmitting(true);

    // Small delay so the loader is visible and feels deliberate
    await new Promise((r) => setTimeout(r, 800));

    try {
      // ── Run the deterministic audit engine entirely client-side ──────────
      const auditResult = runAudit({
        teamSize: data.teamSize as number,
        useCase: data.useCase as any,
        tools: data.tools.map((t) => ({
          id: t.id,
          tool: t.tool as any,
          plan: t.plan,
          monthlySpend: t.monthlySpend as number,
          seats: t.seats as number,
        })),
      });

      // ── Generate AI summary (always use fallback for now; try Claude async) ─
      auditResult.aiSummary = generateFallbackSummary(auditResult);

      // ── Store in sessionStorage → results page reads it ──────────────────
      sessionStorage.setItem('spendpilot_audit', JSON.stringify(auditResult));

      // ── Attempt to persist + get a shareSlug via API (fire-and-forget) ───
      // This works when env vars are configured; silently skipped otherwise
      fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          if (res.ok) {
            const { audit: serverAudit, shareSlug } = await res.json();
            // If server returned a Claude-powered summary, upgrade it
            if (serverAudit?.aiSummary && serverAudit.aiSummary !== auditResult.aiSummary) {
              const stored = sessionStorage.getItem('spendpilot_audit');
              if (stored) {
                const parsed = JSON.parse(stored);
                parsed.aiSummary = serverAudit.aiSummary;
                sessionStorage.setItem('spendpilot_audit', JSON.stringify(parsed));
              }
            }
            if (shareSlug) sessionStorage.setItem('spendpilot_slug', shareSlug);
          }
        })
        .catch(() => { /* Silently skip — no env vars configured */ });

      clear();
      router.push('/results');
    } catch (err) {
      console.error('[SpendForm] Audit failed:', err);
      // Even if something unexpected fails, navigate — the engine should never throw
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Team Details ── */}
        <section className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-xs text-brand-400">1</span>
            Team Details
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Total Team Size</label>
              <input
                type="number"
                {...register('teamSize', { valueAsNumber: true })}
                placeholder="e.g. 15"
                className={cn('input-base', errors.teamSize && 'border-rose-500/50')}
              />
              {errors.teamSize && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="h-3 w-3" />{errors.teamSize.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Primary Use Case</label>
              <select
                {...register('useCase')}
                className={cn('select-base', errors.useCase && 'border-rose-500/50')}
              >
                <option value="">Select primary use case...</option>
                {USE_CASES.map((uc) => (
                  <option key={uc.value} value={uc.value}>{uc.label}</option>
                ))}
              </select>
              {errors.useCase && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertCircle className="h-3 w-3" />{errors.useCase.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── AI Tools ── */}
        <section className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-xs text-brand-400">2</span>
            AI Tool Subscriptions
          </h2>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {fields.map((field, index) => (
                <ToolInputCard key={field.id} index={index} onRemove={() => remove(index)} />
              ))}
            </AnimatePresence>
          </div>
          {errors.tools?.root && (
            <div className="mt-4 rounded-xl bg-rose-500/10 p-3 border border-rose-500/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400" />
              <p className="text-sm text-rose-400">{errors.tools.root.message}</p>
            </div>
          )}
          <motion.button
            type="button"
            onClick={() => append({ id: generateId(), tool: '', plan: '', monthlySpend: '' as any, seats: 1 })}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-4 text-sm font-medium text-white/60 transition-colors hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-300"
          >
            <Plus className="h-4 w-4" />
            Add another AI tool
          </motion.button>
        </section>

        {/* ── Sticky CTA ── */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
          className="sticky bottom-6 z-20 mx-auto mt-12 overflow-hidden rounded-2xl glass-strong border border-brand-500/30 p-4 shadow-glass glow-purple flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-white/60 ml-2">
            Form auto-saves. <span className="text-white">Ready to see your savings?</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto relative group overflow-hidden rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Analyzing your AI stack...</>
              ) : (
                <><Calculator className="h-4 w-4" />Generate Audit Report</>
              )}
            </span>
          </button>
        </motion.div>
      </form>
    </FormProvider>
  );
}
