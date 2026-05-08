import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5 opacity-50 transition-opacity hover:opacity-100">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600">
              <Zap className="h-3 w-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">
              SpendPilot
            </span>
          </div>
          
          <div className="flex gap-6 text-xs text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-[10px] text-white/20">
          © {new Date().getFullYear()} SpendPilot. Built for the modern startup.
        </div>
      </div>
    </footer>
  );
}
