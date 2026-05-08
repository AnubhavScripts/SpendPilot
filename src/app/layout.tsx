import type { Metadata } from 'next';
import '@/styles/globals.css';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-white antialiased">
        {children}
      </body>
    </html>
  );
}
