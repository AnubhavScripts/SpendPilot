'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-brand-600/10 mesh-gradient" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-8 sm:p-12 border border-brand-500/30 glow-purple"
        >
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Ready to stop overpaying?
          </h2>
          <p className="mb-8 mx-auto max-w-2xl text-base sm:text-lg text-white/60">
            Join 500+ startups saving an average of 37% on their AI tools. 
            Takes less than 5 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/audit"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-900 shadow-lg transition-all hover:-translate-y-1 hover:bg-brand-50 active:translate-y-0 w-full sm:w-auto"
            >
              Start Free Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/40">No credit card required • Secure and private</p>
        </motion.div>
      </div>
    </section>
  );
}
