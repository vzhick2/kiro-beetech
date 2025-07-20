---
title: 'AI Guidelines'
description: 'Development philosophy and project context for internal inventory management'
purpose: 'Reference for development principles, business context, and project reasoning'
last_updated: 'July 20, 2025'
doc_type: 'project-documentation'
related:
  [
    'README.md',
    'data-model.md',
    'ui-blueprint.md',
    'requirements.md',
    'development-guide.md',
    'api-documentation.md',
    'mcp-setup.md',
  ]
---

# AI Guidelines

Development philosophy and project context for the internal KIRO inventory management system.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## AI Development Setup Architecture

### **Multi-IDE AI Currency Solution (July 2025)**

This project uses a sophisticated AI setup designed to provide current, repository-aware assistance across multiple editors:

#### **Core Architecture**
- **Primary**: `.cursorrules` - Comprehensive AI behavior rules (works in Cursor + fallback for VS Code)
- **VS Code Specific**: `.vscode/copilot-instructions.md` - References `.cursorrules` for consistency
- **Real-time Context**: MCP (Model Context Protocol) servers for live repository/database awareness

#### **MCP Integration - The Currency Solution**
- **Supabase MCP Server**: Live database schema, real-time queries, current dependency awareness
- **GitHub MCP Server**: Repository structure analysis, current branch context, file relationships
- **Result**: AI always sees current tech stack (React 19, Next.js 15, etc.) rather than outdated patterns

#### **Why This Approach Works**
1. **Real-time Context**: MCP provides live data vs. static instruction files that become outdated
2. **Multi-Editor Support**: Same rules work in Cursor and VS Code without conflicts
3. **Repository Awareness**: AI reads actual `package.json`, project structure, and database schema
4. **Current Best Practices**: Automatically suggests 2025 patterns, not legacy approaches

#### **Contextual Prompting Strategy**
```bash
# Force current tech stack awareness
"@workspace check my package.json and suggest React 19 patterns"

# Repository structure awareness  
"#file:package.json verify my Next.js version and suggest compatible patterns"

# Real-time validation
"Use my current Supabase schema for this feature"
```

This setup solves the "AI knowledge cutoff" problem by providing real-time repository context rather than relying on static training data.

#### **Integration with .cursorrules**
- **.cursorrules** contains immediate AI instructions for code generation
- **ai-guidelines.md** documents the reasoning and philosophy behind those instructions
- Together they provide both "what to do" and "why we do it this way"
- This separation follows the principle of minimizing token usage while maintaining comprehensive context

## Development Philosophy

### **Business Value First**

- Prioritize functional, minimal solutions that solve real small business problems
- Support forgiving workflows: back-dating, editing, corrections
- Mobile-first for workshop use, desktop-optimized for admin tasks
- Use mutable logs and cycle count alerts over rigid constraints

### **Small Business Context**

- **Forgiving Data Entry**: Allow back-dating, editing, and corrections - small businesses need flexibility
- **Mobile-First UX**: Workshop/warehouse use requires touch-friendly interface (≥44px targets)
- **Direct Edit Workflows**: Enable in-place editing rather than complex forms
- **Risk-Appropriate Security**: Small scale = no complex audit trails needed, focus on usability

### **Technical Approach**

- **Modular & Replaceable**: Design components for easy swaps (e.g., use TanStack Query for data fetching)
- **Human-Friendly Outputs**: Use clear, actionable language; structure responses with sections/bullets
- **Self-Validation**: Before finalizing outputs, simulate key scenarios and describe expected behavior
- **Professional Communication**: Keep all communication factual, professional, and focused on business value

## Business Domain Guidelines

### **Inventory Terminology Standards**

- Use "cycle count alerts" not "inventory nudges" or similar
- "Action Center" for dashboard notifications
- "Allocation exclusion" for reserved inventory
- Maintain consistent terminology across all interfaces and documentation

### **Key Business Workflows**

1. **Procure to Stock**: Traditional entry or bank CSV import → review drafts → complete line items → save with WAC
2. **Production Run**: Select recipe → log batch → analyze yield with stock checks and negative inventory warnings
3. **Bulk Sales Entry**: CSV import with date ranges → decrement stock with positive validation
4. **Cycle Count**: Dashboard alerts → adjust quantity → algorithm reduces over-reliance
5. **Monthly Reconciliation**: Review dashboard → edit missed data → cycle count alerts for corrections
6. **Recipe Development**: Create/edit → test batch → version on edit → tied to batch validation

## AI Behavioral Rules

### **Response Structure**

- Always format clearly (summaries first, details after)
- For tools/code, explain reasoning before/after
- If uncertain, ask for clarification
- Suggest mitigations for risks

### **Development Workflow Rules**

- **ALWAYS** ask "Should I implement this?" before making file changes
- Provide options first, then wait for explicit approval
- Follow docs/requirements.md for feature specifications
- Use docs/data-model.md for database schema (verify with Supabase MCP when uncertain)
- Reference docs/technical-design.md for architecture decisions

### **Iteration Mindset**

- Propose evolutions aligned with roadmap workflows
- When updating/generating docs, ensure:
  - YAML frontmatter (purpose, last_updated, doc_type, related)
  - Consistency: Reference other docs sparingly
  - Vision Support: Embed flexibility (e.g., back-dating support in schemas)

### **Self-Audit Steps**

Before finalizing any output for this inventory project:

1. **Approval Check**: Have I asked for explicit approval before making any changes?
2. **Key Scenario Test**: Describe what happens with edge cases (e.g., "If user enters negative quantity, system should show warning but allow transaction")
3. **Integration Check**: Verify new features work with existing flows
4. **Terminology Consistency**: Ensure all terms match project terminology
5. **Mobile-First Validation**: Confirm UX works on mobile devices
6. **Business Logic Alignment**: Check output supports small business workflows

**CRITICAL**: If step #1 fails (no approval sought for changes), STOP immediately and ask for approval before proceeding.

## Architecture Guidelines

### **Development Standards**

- Use TypeScript strict mode and clear names; TSDoc for public methods
- Keep functions <50 lines; inline validation + toasts for error handling
- Use RPCs for atomic operations; direct mutations for simple CRUD
- Prioritize SSR for <3s TTI; mobile touch targets ≥44px
- Align with design tokens (Inter font, 8px grid)

### **Data & Business Logic**

- **Data Strategy**: Favor simplicity (mutable logs with timestamps/soft deletes; evolutionary schema)
- **UI/Workflows**: Prioritize mobile-first, direct edits
- **Dev Practices**: Follow established conventions; test high-risk logic
- **Risk Awareness**: Consider small-scale context—no audits/trust issues, so avoid over-secure features

## Project Evolution

This documentation evolves with the project to reflect:

- Lessons learned from development
- Changes in business requirements
- Improvements in AI assistance patterns
- Updates to development workflows

The goal is to maintain a clear record of decisions and reasoning while keeping the .cursorrules focused on immediate, actionable instructions.
