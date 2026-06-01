# Sprint 16 Test Automation Plan

## Current Status
- **Previous Sprints:** 1-15 automated (50 components)
- **Sprint 16:** Awaiting ticket list

## How to Automate Sprint 16

### Step 1: Provide Sprint 16 Jira Tickets
```
Request format:
- Jira ticket keys (e.g., GAAM-2001, GAAM-2002, etc.)
- OR: Component names and acceptance criteria
- OR: CSV file with requirements
```

### Step 2: Automated Generation
```bash
/automate jira GAAM-2001 GAAM-2002 ... GAAM-XXXX
```

### Step 3: Available Options
- `--categories all` — All test types
- `--a11y-level wcag22` — Full accessibility
- `--update` — Update existing components
- `--from-content` — Include content-driven tests

### Step 4: Deployment & Testing
- Deploy components to AEM
- Deploy content fixtures
- Run tests in dev environment
- Validate against requirements

## Timeline
- Ticket provision: T+0
- Test generation: T+15 min
- Component deployment: T+5 min
- Content deployment: T+10 min
- Test execution: T+30-45 min
- Results & report: T+10 min

**Total: ~2 hours to full validation**

## Next Steps
1. Provide Sprint 16 tickets
2. Run `/automate jira [tickets]`
3. Deploy and test
4. Report results
