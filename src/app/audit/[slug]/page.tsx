import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAuditBySlug, getAuditToolsByAuditId } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SharedReportView from '@/components/results/SharedReportView';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const audit = await getAuditBySlug(params.slug).catch(() => null);

  if (!audit) {
    return { title: 'Audit Not Found — SpendPilot' };
  }

  const savings = Math.round(audit.total_annual_savings).toLocaleString();
  const title = `AI Spend Audit — $${savings}/year in savings found`;
  const description = audit.ai_summary ?? `This startup found $${savings}/year in AI tool savings using SpendPilot.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SharedAuditPage({ params }: Props) {
  let audit = null;
  let tools: any[] = [];

  try {
    audit = await getAuditBySlug(params.slug);
    if (audit) {
      tools = await getAuditToolsByAuditId(audit.id);
    }
  } catch {
    // Supabase not configured — show fallback
  }

  if (!audit) notFound();

  return (
    <main className="min-h-screen mesh-gradient">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <SharedReportView audit={audit} tools={tools} />
      </div>
      <Footer />
    </main>
  );
}
