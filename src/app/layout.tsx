import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpendPilot — AI Spend Audit for Startups',
  description:
    'Audit your AI tool spending in minutes. Discover duplicate subscriptions, wrong pricing plans, and unused enterprise tiers. Average 37% savings found.',
  keywords: ['AI spend audit', 'AI tools', 'startup savings', 'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT'],
  openGraph: {
    title: 'SpendPilot — AI Spend Audit for Startups',
    description: 'Find out where your AI budget is leaking. Free audit in under 5 minutes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-surface text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
