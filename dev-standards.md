
---
title: "Development Standards"
description: "Technical standards, tools, and development practices"
purpose: "Reference for development conventions, tech stack, and coding standards"
last_updated: "July 17, 2025"
doc_type: "technical-standards"
related: ["README.md", "data-model.md", "ui-blueprint.md"]
---

# Development Standards

Coding guidelines and tech stack for MVP with mutable logs and pragmatic mitigations.



## 1. Development Philosophy

Balance speed and stability for both human and AI developers:

- **Git Workflow**: Feature branches with PRs to main; self-approved PRs acceptable for solo work.
- **Code Quality**: ESLint + Prettier with pre-commit hooks for consistency.
- **Testing**: Unit tests with Vitest for critical business logic (WAC calculations, negative inventory alerts, cycle count algorithms).

## 2. Tech Stack Overview

- **Frontend**: Next.js (React) with TypeScript for SSR and fast loads.
- **Backend/Database**: Supabase (PostgreSQL) with mutable logs, simplified RPCs for atomic ops, and direct mutations for non-critical actions.
- **UI Library**: shadcn/ui + Tailwind CSS for customizable, accessible components.
- **State Management**: TanStack Query for server data; URL params for view state; Zustand only if needed for global UI.
- **Data Tables**: TanStack Table for custom, performant grids.
- **Deployment/Version Control**: Vercel for CI/CD; GitHub for repos.

## 3. Coding Standards & Best Practices

- **Constants & Enums**: Use a central `constants.ts` for shared values (e.g., `ITEM_TYPES`, `TRANSACTION_TYPES`) to avoid magic strings. The database enforces this with PostgreSQL `ENUM` types as documented in data-model.md.
- **Display ID Pattern**: Apply consistently across entities - use auto-generated displayId for user references while maintaining UUID primary keys for performance.
- **Units of Measurement**: Use the standardized `inventoryUnit` enum in forms to ensure data consistency for calculations.
- **Component Naming**: Use a `[View/Context][ComponentName]` structure (e.g., `ItemsTable`, `PurchaseForm`) for a self-documenting codebase.
- **Error & Feedback Handling**: Use inline validation for immediate user feedback. Use standardized error types from data-model.md and translate all technical errors into plain, actionable language in UI toasts.

## 4. API Design & Business Logic

- **Database Functions**: PostgreSQL RPCs for critical multi-step operations; direct Supabase mutations for simple CRUD.
- **Validation**: Client-side for fast UX; server-side in RPCs for final authority.
- **Key Mitigations**: Negative inventory alerts, cycle count alerts, purchase allocation exclusion, import duplicate detection, smart forecasting with seasonal adjustments.
- **Forecasting Logic**: Simple 3-month moving averages with seasonal indices; monthly recalculation for automatic reorder points.
- **Batch Templates**: Reusable production configurations stored in batch_templates table for efficiency.
- **External Integrations (Phase 2)**: 
  - **Webhook Processing**: Supabase Edge Functions for BigCommerce/QBO event handling with retry logic
  - **OAuth Management**: Secure token storage and refresh for third-party API access
  - **Sync Validation**: Real-time inventory deduction with negative inventory warnings and error recovery

## 5. Privacy & Security
- **No Analytics (MVP)**: Rely on Vercel/Supabase logs for essential monitoring.
- **File Security**: CSV imports processed server-side with validation and secure temporary storage.
- **Future**: Any analytics must be privacy-focused, opt-in only, and avoid PII.

## 6. Schema & Evolution
- Follow the schema defined in `data-model.md`, using mutable logs for history.
- The schema is expected to evolve. Use Supabase migrations to manage changes. Prioritize simplicity and compute complex values on-demand where possible.
