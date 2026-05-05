# Login Component — Content Fixtures

**Ticket**: GAAM-601 — CMS: Login Component (New)  
**Generated**: 2026-04-28  
**Source base**: Style guide at `/content/global-atlantic/style-guide/components/login`

## What was added

This fixture extends the base style guide page with states required for full test coverage.

| Node | What | Test IDs |
|------|------|----------|
| `login_default` | Standard login form with all fields, labels, assistance text | LGN-001–LGN-027 |
| `login_forgot_username` | Login with forgot-username modal content authored | LGN-018–020, LGN-I-006–008 |
| `login_forgot_password` | Login with forgot-password modal content authored | LGN-021–022, LGN-I-010–012 |
| `login_validation_error` | Login with alert banner in error state pre-authored | LGN-023–026 |
| `section_white` | Login inside white background section | LGN-M-010, LGN-M-014 |
| `section_granite` | Login inside dark/granite background section | LGN-M-012, LGN-M-015, LGN-M-016 |
| `section_azul` | Login inside azul background section | LGN-M-013, LGN-M-017 |
| `section_slate` | Login inside slate background section | LGN-M-011 |

## Why these states are needed

The existing style guide page only covers the default login state. Missing states:
- **Modal states** — Forgot username / forgot password modals require authored dialog copy
- **Validation error state** — Alert banner requires error state to be authored
- **Background variants** — All 4 section background colors needed for matrix tests

## How to deploy

**Local / Dev (auto-deploy)**:
The `content-fixture-deployer.ts` utility POSTs this XML to AEM before tests run.
Tests navigate to: `http://localhost:4502/content/global-atlantic/test-fixtures/login.html?wcmmode=disabled`

**QA / UAT / Prod (manual merge)**:
Review additions marked with `<!-- [Added GAAM-601] -->` and merge into kkr-aem style guide.
Tests then navigate to the standard style guide URL.
