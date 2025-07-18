---
title: "AI Guidelines"
description: "AI development guidelines for inventory management project"
purpose: "Reference for AI behavior, communication, and development principles"
last_updated: "July 17, 2025"
doc_type: "ai-reference"
related: ["README.md", "data-model.md", "ui-blueprint.md", "dev-standards.md", ".kiro/specs/inventory-management/requirements.md"]
---

# AI Guidelines

Development guidance for AI assistants working on the small business inventory management system.

## Core Development Philosophy

### **Business Value First**
- Prioritize functional, minimal solutions that solve real small business problems
- Support forgiving workflows: back-dating, editing, corrections
- Mobile-first for workshop use, desktop-optimized for admin tasks
- Use mutable logs and cycle count alerts over rigid constraints

### **Kiro Integration**
- Follow spec-driven development: requirements → design → tasks → implementation
- Use Kiro's task execution for incremental development
- Leverage steering files and context for project-specific guidance

### Business Development Principles

- **Ship "Good Enough"**: Prioritize functional, minimal solutions that solve business problems (e.g., simple timestamped logs over immutable ledgers). Avoid adding unnecessary features—suggest simple direct edits to make workflows more flexible.  
- **Business Value First**: All suggestions must tie to small business needs (e.g., forgiving data entry, mobile workshop UX). Incorporate mitigations naturally (e.g., add cycle count alert algorithms to Dashboard queries).  
- **Maintain Single Source of Truth**: Centralize info (e.g., open questions in README.md). Update docs cohesively when proposing changes.  
- **Modular & Replaceable**: Design components for easy swaps (e.g., use TanStack Query for data fetching; simplify RPCs to essentials).  
- **Human-Friendly Outputs**: Use clear, actionable language; structure responses with sections/bullets. For code/docs, ensure completeness (no placeholders) and consistent terminology like "cycle count alerts".
- **Self-Validation**: Before finalizing outputs, simulate key scenarios (e.g., "What happens if user enters negative quantity?") and describe expected behavior vs actual results (negative inventory warnings but transaction allowed).
- **Professional Communication**: Keep all communication factual, professional, and focused on small business value. Use precise, factual descriptions (say "implements validation" not "provides robust validation"). Always tie suggestions to concrete small business workflows and pain points.

## Business Domain Guidelines

### Small Business Context
- **Forgiving Data Entry**: Allow back-dating, editing, and corrections - small businesses need flexibility
- **Mobile-First UX**: Workshop/warehouse use requires touch-friendly interface (≥44px targets)
- **Direct Edit Workflows**: Enable in-place editing rather than complex forms
- **Risk-Appropriate Security**: Small scale = no complex audit trails needed, focus on usability

### Inventory Terminology Standards
- Use "cycle count alerts" not "inventory nudges" or similar
- "Action Center" for dashboard notifications
- "Allocation exclusion" for reserved inventory
- Maintain consistent terminology across all interfaces and documentation

## Project-Specific Behavioral Rules

1. **Response Structure**: Always format clearly (summaries first, details after). For tools/code, explain reasoning before/after.  
2. **Error Handling**: If uncertain, ask for clarification. Suggest mitigations for risks (e.g., validation to warn on negatives in RPCs).  
3. **Iteration Mindset**: Propose evolutions. Align with roadmap workflows.
4. **Doc Maintenance**: When updating/generating docs, ensure:  
   - YAML frontmatter (purpose, last_updated, doc_type, related).  
   - Consistency: Reference other docs sparingly.  
   - Vision Support: Embed flexibility (e.g., back-dating support in schemas).

## Simple Self-Audit Steps

Before finalizing any AI output for this inventory project, run through this checklist:

1. **Approval Check**: Have I asked for explicit approval before making any changes? If user requested suggestions, did I STOP and WAIT for their choice?
2. **Key Scenario Test**: Describe what happens with edge cases (e.g., "If user enters negative quantity, system should show warning but allow transaction for real-world flexibility")
3. **Integration Check**: Verify new features work with existing flows (e.g., "New cycle count alert integrates with Dashboard Action Center")  
4. **Terminology Consistency**: Ensure all terms match project terminology (e.g., use "cycle count alert" not "inventory nudge")
5. **Mobile-First Validation**: Confirm UX works on mobile devices (touch targets ≥44px, readable text)
6. **Business Logic Alignment**: Check output supports small business workflows (forgiving entry, back-dating, direct edits)

**CRITICAL**: If step #1 fails (no approval sought for changes), STOP immediately and ask for approval before proceeding.

## Architecture Guidelines for Inventory App

### Development Standards
- Use TypeScript strict mode and clear names; TSDoc for public methods
- Keep functions <50 lines; inline validation + toasts for error handling
- Use RPCs for atomic operations; direct mutations for simple CRUD
- Prioritize SSR for <3s TTI; mobile touch targets ≥44px
- Align with design tokens (Inter font, 8px grid)

### Data & Business Logic
- **Data Strategy**: Favor simplicity (mutable logs with timestamps/soft deletes; evolutionary schema). Apply Display ID pattern for user-facing entities. Mitigate high-tier issues with algorithms for cycle count alerts, filters for allocation, warnings for negatives.  
- **UI/Workflows**: Prioritize mobile-first, direct edits. Use SKU/displayId for user references, not internal UUIDs. Add UX for mitigations (inline warnings for negatives).  
- **Dev Practices**: Follow established conventions; test high-risk logic (allocation exclusion). Use standardized error types from data-model.md.  
- **Risk Awareness**: Consider small-scale context—no audits/trust issues, so avoid over-secure features.