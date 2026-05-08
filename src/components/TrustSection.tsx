'use client';

import { motion } from 'framer-motion';
import { TRUST_METRICS, MOCK_LOGOS } from '@/constants';

export default function TrustSection() {
  return (
    <section id="trust" className="relative border-y border-white/5 bg-surface-50 py-20">
      {/* Metrics */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-white/30"
        >
          Trusted by fast-growing startup teams
        </motion.p>

        {/* Metric pills */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-hover glass rounded-2xl p-6 text-center"
            >
              <p className="mb-1 text-3xl font-extrabold gradient-text">{metric.value}</p>
              <p className="text-xs text-white/40">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mock logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14"
        >
          <p className="mb-6 text-center text-xs text-white/25">
            Used by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {MOCK_LOGOS.map((name) => (
              <div
                key={name}
                className="text-sm font-semibold tracking-tight text-white/20 transition-colors hover:text-white/40"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
