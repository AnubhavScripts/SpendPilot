export type AIToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'OpenAI API'
  | 'Anthropic API'
  | 'Gemini'
  | 'Windsurf';

export type UseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'data-analysis'
  | 'mixed';

export interface ToolEntry {
  id: string;
  tool: AIToolName | '';
  plan: string;
  monthlySpend: number | '';
  seats: number | '';
}

export interface SpendFormData {
  teamSize: number | '';
  useCase: UseCase | '';
  tools: ToolEntry[];
}

export interface PlanOption {
  label: string;
  price?: number;
}

export interface AIToolConfig {
  name: AIToolName;
  icon: string;
  color: string;
  plans: PlanOption[];
}
