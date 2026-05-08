import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import SpendForm from '@/components/SpendForm';

export const metadata: Metadata = {
  title: 'Audit My AI Spend — SpendPilot',
  description:
    'Enter your AI tool subscriptions and let SpendPilot analyze where you can save money.',
};

export default function AuditPage() {
  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pb-32 pt-28 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            Step 2 of 2
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Tell us about your{' '}
            <span className="gradient-text">AI stack</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/50">
            Enter each AI tool your team uses. We&apos;ll identify overspending,
            duplicates, and wrong-plan choices.
          </p>
        </div>
        <SpendForm />
      </div>
    </main>
  );
}
