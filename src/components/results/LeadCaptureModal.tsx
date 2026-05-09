'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  website: z.string().max(0).optional(), // honeypot
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditId: string;
  totalMonthlySavings: number;
}

export default function LeadCaptureModal({
  isOpen, onClose, auditId, totalMonthlySavings,
}: LeadCaptureModalProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadForm) => {
    setState('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, auditId, totalMonthlySavings }),
      });
      if (!res.ok) throw new Error('Failed');
      setState('success');
      setTimeout(onClose, 2500);
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 mx-auto max-w-md rounded-2xl border border-white/10 glass-strong shadow-glass p-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {state === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">You&apos;re all set!</h3>
                <p className="text-sm text-white/50">Check your email for your audit summary.</p>
              </motion.div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="mb-1 text-xs font-medium text-brand-300">
                    ✓ Audit complete — {formatCurrency(totalMonthlySavings)}/mo in savings found
                  </div>
                  <h2 className="text-lg font-bold text-white">Get your results via email</h2>
                  <p className="mt-1 text-sm text-white/50">
                    We&apos;ll send your full audit report and savings breakdown.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Honeypot — hidden from real users */}
                  <div className="hidden" aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" {...register('website')} />
                  </div>

                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        {...register('email')}
                        className={cn(
                          'input-base pl-9',
                          errors.email && 'border-rose-500/50'
                        )}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email.message}</p>}
                  </div>

                  <div>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="Company name (optional)"
                        {...register('companyName')}
                        className="input-base pl-9"
                      />
                    </div>
                  </div>

                  {state === 'error' && (
                    <p className="text-xs text-rose-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition-all hover:bg-brand-500 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {state === 'loading' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      'Send My Audit Report'
                    )}
                  </button>

                  <button type="button" onClick={onClose} className="w-full text-xs text-white/30 hover:text-white/60 transition-colors py-1">
                    Skip for now
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
