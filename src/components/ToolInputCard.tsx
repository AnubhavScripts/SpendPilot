'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Trash2, DollarSign, Users } from 'lucide-react';
import { AI_TOOLS } from '@/constants';
import { cn } from '@/lib/utils';
import type { SpendFormSchema } from '@/lib/validations';

interface ToolInputCardProps {
  index: number;
  onRemove: () => void;
}

export default function ToolInputCard({ index, onRemove }: ToolInputCardProps) {
  const { register, watch, formState: { errors } } = useFormContext<SpendFormSchema>();
  
  const selectedToolName = watch(`tools.${index}.tool`);
  const selectedToolConfig = AI_TOOLS.find((t) => t.name === selectedToolName);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-6 relative overflow-hidden rounded-2xl border border-white/10 glass-strong p-6 shadow-glass"
    >
      {/* Decorative left border color */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
        style={{ backgroundColor: selectedToolConfig?.color || '#3b82f6' }}
      />
      
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-semibold text-white/80">AI Tool {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-white/30 hover:text-rose-400 transition-colors p-1"
          aria-label="Remove tool"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Tool Select */}
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Tool</label>
          <select
            {...register(`tools.${index}.tool`)}
            className={cn(
              "select-base", 
              errors.tools?.[index]?.tool && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
            )}
          >
            <option value="">Select a tool...</option>
            {AI_TOOLS.map((tool) => (
              <option key={tool.name} value={tool.name}>
                {tool.icon} {tool.name}
              </option>
            ))}
          </select>
          {errors.tools?.[index]?.tool && (
            <p className="mt-1 text-[10px] text-rose-400">{errors.tools?.[index]?.tool?.message}</p>
          )}
        </div>

        {/* Plan Select */}
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Current Plan</label>
          <select
            {...register(`tools.${index}.plan`)}
            disabled={!selectedToolName}
            className={cn(
              "select-base",
              !selectedToolName && "opacity-50 cursor-not-allowed",
              errors.tools?.[index]?.plan && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
            )}
          >
            <option value="">Select plan...</option>
            {selectedToolConfig?.plans.map((plan) => (
              <option key={plan.label} value={plan.label}>
                {plan.label}
              </option>
            ))}
          </select>
          {errors.tools?.[index]?.plan && (
            <p className="mt-1 text-[10px] text-rose-400">{errors.tools?.[index]?.plan?.message}</p>
          )}
        </div>

        {/* Monthly Spend */}
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Monthly Spend ($)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-white/40" />
            </div>
            <input
              type="number"
              {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
              placeholder="0.00"
              step="0.01"
              className={cn(
                "input-base pl-9",
                errors.tools?.[index]?.monthlySpend && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
              )}
            />
          </div>
          {errors.tools?.[index]?.monthlySpend && (
            <p className="mt-1 text-[10px] text-rose-400">{errors.tools?.[index]?.monthlySpend?.message}</p>
          )}
        </div>

        {/* Seats */}
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Number of Seats</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-4 w-4 text-white/40" />
            </div>
            <input
              type="number"
              {...register(`tools.${index}.seats`, { valueAsNumber: true })}
              placeholder="1"
              className={cn(
                "input-base pl-9",
                errors.tools?.[index]?.seats && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
              )}
            />
          </div>
          {errors.tools?.[index]?.seats && (
            <p className="mt-1 text-[10px] text-rose-400">{errors.tools?.[index]?.seats?.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
