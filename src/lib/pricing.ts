import type { AIToolName } from '@/types';

/**
 * Centralized pricing data for the audit engine.
 * Sources: Official pricing pages as of 2025.
 * See PRICING_DATA.md for verification details.
 */

export interface PlanPricing {
  id: string;
  label: string;
  monthlyPricePerSeat: number; // 0 = free or usage-based
  isPerSeat: boolean;
  minSeats?: number;
  maxSeats?: number;
  enterpriseThreshold?: number; // # seats above which enterprise is overkill
  tier: 'free' | 'individual' | 'team' | 'business' | 'enterprise' | 'api';
}

export interface ToolPricing {
  toolName: AIToolName;
  category: 'coding' | 'chat' | 'api';
  plans: PlanPricing[];
}

// ─── Pricing Table ─────────────────────────────────────────────────────────

export const PRICING: Record<AIToolName, ToolPricing> = {
  Cursor: {
    toolName: 'Cursor',
    category: 'coding',
    plans: [
      {
        id: 'cursor-hobby',
        label: 'Hobby (Free)',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'free',
      },
      {
        id: 'cursor-pro',
        label: 'Pro ($20/mo)',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'cursor-business',
        label: 'Business ($40/seat/mo)',
        monthlyPricePerSeat: 40,
        isPerSeat: true,
        enterpriseThreshold: 5,
        tier: 'business',
      },
    ],
  },

  'GitHub Copilot': {
    toolName: 'GitHub Copilot',
    category: 'coding',
    plans: [
      {
        id: 'copilot-individual',
        label: 'Individual ($10/mo)',
        monthlyPricePerSeat: 10,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'copilot-business',
        label: 'Business ($19/seat/mo)',
        monthlyPricePerSeat: 19,
        isPerSeat: true,
        tier: 'business',
      },
      {
        id: 'copilot-enterprise',
        label: 'Enterprise ($39/seat/mo)',
        monthlyPricePerSeat: 39,
        isPerSeat: true,
        enterpriseThreshold: 25,
        tier: 'enterprise',
      },
    ],
  },

  Claude: {
    toolName: 'Claude',
    category: 'chat',
    plans: [
      {
        id: 'claude-free',
        label: 'Free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'free',
      },
      {
        id: 'claude-pro',
        label: 'Pro ($20/mo)',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'claude-team',
        label: 'Team ($25/seat/mo)',
        monthlyPricePerSeat: 25,
        isPerSeat: true,
        enterpriseThreshold: 5,
        tier: 'team',
      },
      {
        id: 'claude-enterprise',
        label: 'Enterprise (Custom)',
        monthlyPricePerSeat: 0,
        isPerSeat: true,
        tier: 'enterprise',
      },
    ],
  },

  ChatGPT: {
    toolName: 'ChatGPT',
    category: 'chat',
    plans: [
      {
        id: 'chatgpt-free',
        label: 'Free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'free',
      },
      {
        id: 'chatgpt-plus',
        label: 'Plus ($20/mo)',
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'chatgpt-team',
        label: 'Team ($25/seat/mo)',
        monthlyPricePerSeat: 25,
        isPerSeat: true,
        enterpriseThreshold: 5,
        tier: 'team',
      },
      {
        id: 'chatgpt-enterprise',
        label: 'Enterprise (Custom)',
        monthlyPricePerSeat: 0,
        isPerSeat: true,
        tier: 'enterprise',
      },
    ],
  },

  'OpenAI API': {
    toolName: 'OpenAI API',
    category: 'api',
    plans: [
      {
        id: 'openai-payg',
        label: 'Pay-as-you-go',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'api',
      },
      {
        id: 'openai-committed',
        label: 'Committed usage tier',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'api',
      },
    ],
  },

  'Anthropic API': {
    toolName: 'Anthropic API',
    category: 'api',
    plans: [
      {
        id: 'anthropic-payg',
        label: 'Pay-as-you-go',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'api',
      },
      {
        id: 'anthropic-scale',
        label: 'Scale tier',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'api',
      },
    ],
  },

  Gemini: {
    toolName: 'Gemini',
    category: 'chat',
    plans: [
      {
        id: 'gemini-free',
        label: 'Free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'free',
      },
      {
        id: 'gemini-advanced',
        label: 'Advanced ($19.99/mo)',
        monthlyPricePerSeat: 19.99,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'gemini-business',
        label: 'Business (Custom)',
        monthlyPricePerSeat: 0,
        isPerSeat: true,
        tier: 'business',
      },
    ],
  },

  Windsurf: {
    toolName: 'Windsurf',
    category: 'coding',
    plans: [
      {
        id: 'windsurf-free',
        label: 'Free',
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        tier: 'free',
      },
      {
        id: 'windsurf-pro',
        label: 'Pro ($15/mo)',
        monthlyPricePerSeat: 15,
        isPerSeat: false,
        tier: 'individual',
      },
      {
        id: 'windsurf-teams',
        label: 'Teams ($35/seat/mo)',
        monthlyPricePerSeat: 35,
        isPerSeat: true,
        enterpriseThreshold: 5,
        tier: 'team',
      },
    ],
  },
};

// ─── Category helpers ────────────────────────────────────────────────────────

export const CODING_TOOLS: AIToolName[] = ['Cursor', 'GitHub Copilot', 'Windsurf'];
export const CHAT_TOOLS: AIToolName[] = ['Claude', 'ChatGPT', 'Gemini'];
export const API_TOOLS: AIToolName[] = ['OpenAI API', 'Anthropic API'];

export function getToolPricing(tool: AIToolName): ToolPricing {
  return PRICING[tool];
}

export function getPlanPricing(tool: AIToolName, planLabel: string): PlanPricing | undefined {
  return PRICING[tool]?.plans.find((p) => p.label === planLabel);
}

export function calculateEffectiveCost(plan: PlanPricing, seats: number): number {
  if (!plan.isPerSeat) return plan.monthlyPricePerSeat;
  return plan.monthlyPricePerSeat * seats;
}
