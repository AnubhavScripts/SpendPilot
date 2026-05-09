# TESTS.md — Test Suite Documentation

## Running Tests

```bash
npm test           # run once
npm run test:watch # watch mode
```

## Test Suite

**File**: `tests/auditEngine.test.ts`  
**Framework**: Vitest 2.x  
**Coverage**: Audit engine core logic

### Test Cases

| # | Test | What it validates |
|---|---|---|
| 1 | Zero tools → zero savings | Empty tool list edge case |
| 2 | Seat overage → reduce_seats | 10 seats on 5-person team |
| 3 | Team plan with 1 user | Claude Team → Individual downgrade |
| 4 | Annual = 12 × Monthly | Math consistency |
| 5 | Duplicate coding tools | Cursor + Copilot + Windsurf consolidation |
| 6 | Optimized plan → zero savings | Solo user on correct tier |
| 7 | High API spend → optimization tip | $1200/mo OpenAI API |
| 8 | Total spend = sum of tools | Arithmetic correctness |
| 9 | Savings % bounded 0–100 | No impossible percentages |

### Last Run Output

```
✓ tests/auditEngine.test.ts (9)
  ✓ Audit Engine — runAudit() (9)
    ✓ returns zero savings when no tools are provided
    ✓ detects seat-count overage and recommends reducing seats
    ✓ flags team plan with 1 user — suggests downgrade to individual
    ✓ correctly calculates annual savings as 12x monthly
    ✓ detects duplicate coding tools and surfaces consolidation insight
    ✓ marks already-optimized plans as optimized with zero savings
    ✓ handles API tools with high spend by suggesting optimization
    ✓ total current spend equals sum of all tool spends
    ✓ savings percentage is bounded between 0 and 100

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  523ms
```

## Coverage

The audit engine has full test coverage for:
- All 6 recommendation rules
- Consolidation insight detection
- Math accuracy
- Edge cases (zero tools, already-optimized)

Not yet covered (future work):
- Route handler integration tests
- Lead capture flow tests
- Email delivery tests
