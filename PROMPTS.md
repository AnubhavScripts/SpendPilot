# PROMPTS.md — AI Summary Prompt Design

## Final Prompt

```
You are a financial analyst specializing in AI tool procurement for startups.

A {teamSize}-person startup using AI primarily for {useCase} has this monthly AI spend:
{toolList}

Total spend: ${totalSpend}/month
Potential savings identified: ${savings}/month

Key recommendations:
{recommendations}

Write a 80-110 word personalized audit summary that:
1. Opens with their specific overspending situation
2. Calls out the 1-2 biggest savings opportunities by name
3. Ends with a confident, encouraging next step
4. Sounds professional but conversational — like a trusted advisor
5. Does NOT use generic filler phrases like "Additionally" or "Furthermore"

Return ONLY the summary text, no headers or metadata.
```

## Model Choice

**Claude 3.5 Haiku** — chosen for:
- Fast (< 1s p50 latency)
- Low cost ($0.80/1M input tokens)
- Excellent short-form writing quality
- Superior at financial/business tone vs GPT-4o-mini

## Prompt Design Reasoning

- **Persona framing** ("financial analyst"): Anchors the model to a specific writing register and prevents generic advice
- **Word count constraint** ("80-110 word"): Prevents padding and keeps the card scannable
- **Anti-patterns list** ("Does NOT use..."): Dramatically reduces filler language in first generation
- **Data injection**: Providing actual numbers gives the model concrete material, producing personalized vs template-like output
- **"Return ONLY"**: Prevents markdown headers, preambles, or JSON wrapping

## Failed Experiments

### Experiment 1 — Too long
```
Write an audit summary for this team...
```
Result: 300+ word essays that users wouldn't read. Fixed by adding word count constraint.

### Experiment 2 — Too generic  
Without persona framing, summaries sounded like generic blog posts. Adding "financial analyst" persona fixed tone.

### Experiment 3 — Hallucinated savings
Early prompts without actual numbers caused the model to invent savings figures. Fixed by injecting calculated data directly.

## Fallback Strategy

When the Anthropic API is unavailable (no key, network error, rate limit):

1. `generateFallbackSummary()` is called immediately
2. Uses deterministic template with actual audit numbers
3. Surfaces top recommendation by name
4. Mentions consolidation opportunities if present
5. UX is identical — users never see an error state for the summary
