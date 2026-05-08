import type { AIToolConfig } from '@/types';

export const AI_TOOLS: AIToolConfig[] = [
  {
    name: 'Cursor',
    icon: '⚡',
    color: '#6366f1',
    plans: [
      { label: 'Hobby (Free)', price: 0 },
      { label: 'Pro ($20/mo)', price: 20 },
      { label: 'Business ($40/seat/mo)', price: 40 },
    ],
  },
  {
    name: 'GitHub Copilot',
    icon: '🐙',
    color: '#8b5cf6',
    plans: [
      { label: 'Individual ($10/mo)', price: 10 },
      { label: 'Business ($19/seat/mo)', price: 19 },
      { label: 'Enterprise ($39/seat/mo)', price: 39 },
    ],
  },
  {
    name: 'Claude',
    icon: '🔮',
    color: '#d97706',
    plans: [
      { label: 'Free', price: 0 },
      { label: 'Pro ($20/mo)', price: 20 },
      { label: 'Team ($25/seat/mo)', price: 25 },
      { label: 'Enterprise (Custom)', price: 0 },
    ],
  },
  {
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10b981',
    plans: [
      { label: 'Free', price: 0 },
      { label: 'Plus ($20/mo)', price: 20 },
      { label: 'Team ($25/seat/mo)', price: 25 },
      { label: 'Enterprise (Custom)', price: 0 },
    ],
  },
  {
    name: 'OpenAI API',
    icon: '🔑',
    color: '#06b6d4',
    plans: [
      { label: 'Pay-as-you-go', price: 0 },
      { label: 'Committed usage tier', price: 0 },
    ],
  },
  {
    name: 'Anthropic API',
    icon: '🧬',
    color: '#f59e0b',
    plans: [
      { label: 'Pay-as-you-go', price: 0 },
      { label: 'Scale tier', price: 0 },
    ],
  },
  {
    name: 'Gemini',
    icon: '✨',
    color: '#3b82f6',
    plans: [
      { label: 'Free', price: 0 },
      { label: 'Advanced ($19.99/mo)', price: 19.99 },
      { label: 'Business (Custom)', price: 0 },
    ],
  },
  {
    name: 'Windsurf',
    icon: '🏄',
    color: '#ec4899',
    plans: [
      { label: 'Free', price: 0 },
      { label: 'Pro ($15/mo)', price: 15 },
      { label: 'Teams ($35/seat/mo)', price: 35 },
    ],
  },
];

export const AI_TOOL_NAMES = AI_TOOLS.map((t) => t.name);

export const USE_CASES = [
  { value: 'coding', label: '💻 Coding & Development' },
  { value: 'writing', label: '✍️ Writing & Content' },
  { value: 'research', label: '🔬 Research & Analysis' },
  { value: 'data-analysis', label: '📊 Data Analysis' },
  { value: 'mixed', label: '🎯 Mixed / General' },
] as const;

export const TRUST_METRICS = [
  { value: '$2.1M', label: 'AI spend analyzed' },
  { value: '500+', label: 'startup teams' },
  { value: '37%', label: 'average savings found' },
  { value: '< 5 min', label: 'to complete audit' },
];

export const MOCK_LOGOS = [
  'Notion', 'Linear', 'Vercel', 'Loom', 'Figma', 'Retool',
];
