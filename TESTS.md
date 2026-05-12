# Test Suite

The SpendPilot test suite is built using **Vitest** and guarantees the financial accuracy of the core deterministic audit engine.

## Coverage Summary
We prioritize testing the pure business logic (`auditEngine.ts`) since UI and API routes degrade gracefully, but math errors instantly destroy user trust.

- **Total Tests:** 9
- **Coverage Focus:** 100% path coverage on the `runAudit` engine (seat mismatches, duplicates, optimal plan mapping, and cost calculations).

## How to Run Tests
To execute the test suite locally:
```bash
# Run tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch
```
*Note: GitHub Actions automatically runs `npm run test` on every push to the `main` branch.*

## Test Manifest

| Filename | Test Description | What It Covers |
|---|---|---|
| `auditEngine.test.ts` | Calculates 0 savings when stack is already optimal | Ensures we don't hallucinate savings if the user is perfectly configured. |
| `auditEngine.test.ts` | Identifies seat mismatch savings | Verifies the engine correctly flags when users pay for more tool seats than they have employees (e.g., 10 employees but 15 Copilot seats). |
| `auditEngine.test.ts` | Suggests downgrading to optimal plan | Verifies the logic that maps a user's current excessive plan to the strictly required optimal plan (e.g., ChatGPT Enterprise down to Pro). |
| `auditEngine.test.ts` | Flags redundant tools based on primary IDE | Ensures the engine catches overlapping LLM capabilities (e.g., paying for both Cursor and GitHub Copilot). |
| `auditEngine.test.ts` | Skips redundant flags if use case requires it | Ensures edge cases (like `Code Generation` explicitly requiring specialized tools) don't trigger false-positive redundancy warnings. |
| `auditEngine.test.ts` | Processes complex, multi-tool redundant stacks | Tests the aggregator: 3+ tools, overlapping features, and seat mismatches processed simultaneously. |
| `auditEngine.test.ts` | Handles missing tools gracefully | Ensures the engine does not crash if the form submits an unrecognized tool ID. |
| `auditEngine.test.ts` | Handles unknown plans gracefully | Ensures unknown plan tiers default safely to $0 spend without throwing NaN errors. |
| `auditEngine.test.ts` | Calculates accurate total metrics | Verifies that `currentSpend`, `optimalSpend`, and `annualSavings` strictly equal the sum of the individual recommendation rows. |
