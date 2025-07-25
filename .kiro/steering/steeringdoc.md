---
inclusion: always
---

# KIRO Inventory Management - AI Assistant Guidelines

## Project Context

**Tech Stack**: Next.js 15 + React 19 + TypeScript + Tailwind + Supabase  
**Domain**: Workshop inventory management prioritizing operational flexibility  
**Philosophy**: Mobile-first, forgiving validation, efficiency over rigid constraints

## Core Principles

### Business Logic

- Allow negative inventory for operational corrections
- Support back-dating transactions when needed
- Prioritize batch operations for productivity
- Use forgiving validation patterns

### UI/UX Standards

- Mobile-first design with 44px+ touch targets
- Progressive enhancement (works without JavaScript)
- Contextual help for workshop operations
- Responsive layouts with proper breakpoints

## Autonomy Framework

### Act Independently On

- Bug fixes and performance optimization
- TypeScript errors and linting issues
- Code quality improvements
- Documentation updates
- UI polish and accessibility fixes
- Test creation and execution (Playwright MCP)
- File organization and refactoring within established patterns

### Require Permission For

- New features or major functionality
- Database schema changes
- Business logic modifications
- Dependency updates
- Architectural decisions
- UI layout changes that affect user workflows

### Decision Threshold

**90% Confidence Rule**: Only proceed autonomously if solution confidence ≥ 90%  
**Below 90%**: Present 2-3 structured options with clear trade-offs

### Communication Protocol

- **Questions ending with "?"**: Always present options, don't implement automatically
- **Implementation requests**: Proceed autonomously if within confidence threshold
- **Debugging requests**: Investigate first, then implement fixes or present options

## Documentation Workflow

### Required Context Check (Before Changes)

1. Check `docs/tasks.md` for current work status
2. Reference `docs/developer-guide.md` for technical patterns
3. Validate against `docs/product-specification.md` for business rules
4. Use `docs/technical-reference.md` for database operations
5. Search existing codebase for similar patterns before creating new implementations

### Task Management

- Update `docs/tasks.md` with timestamps on completion
- Mark ✅ only when fully functional with error handling
- Use "🚧 Alpha Implementation" for incomplete features
- Add testing subtasks for major UI changes

## Code Standards

### Architecture Patterns

- Check `src/lib/utils` before creating new utilities
- Follow established component patterns in codebase
- Use TypeScript strict mode with proper typing
- Implement proper error boundaries and loading states

### Database Operations

- Always investigate schema with Supabase MCP first
- Generate TypeScript types after schema changes
- Check security advisors and performance insights
- Validate queries before implementation

### Testing Requirements

- Use Playwright MCP for UI changes, new features, or bug reports
- Test critical inventory workflows: add → purchase → receive → adjust → sell
- Verify mobile touch targets and responsive behavior
- Take screenshots for visual validation

## Development Tools

### MCP Integration

- **Supabase MCP**: Schema investigation, query validation, type generation, security advisors
- **GitHub MCP**: Multi-file commits, feature branches, pull requests, code search
- **Playwright MCP**: End-to-end testing, visual validation, bug reproduction, workflow testing
- **Context7 MCP**: Library documentation and API patterns for dependencies
- **Fetch MCP**: External API documentation and real-time information when needed

### Git Workflow

- Feature branches for new development
- GitHub MCP for AI-driven multi-file commits
- Husky pre-commit hooks for quality gates
- `pnpm build` + lint + type-check before deployment

## Quality Gates

### Before Marking Tasks Complete

- Feature works end-to-end with proper error handling
- Code has appropriate JSDoc and inline comments
- Manual testing completed, edge cases considered
- Playwright testing for UI features (required for user-facing changes)
- Progress percentages match actual implementation
- Update `docs/tasks.md` with completion timestamp
- Verify mobile responsiveness and touch targets (44px+)

### Communication Standards

- Use objective, technical language (avoid "perfect", "amazing", "excellent")
- Explain reasoning before implementation
- Present alternatives for complex decisions with clear trade-offs
- Provide complete solutions with proper imports and error handling
- Focus on operational efficiency over technical perfection
- When presenting options, use format: **Option A/B/C**: Description, **Trade-offs**: Benefits vs limitations

## File Organization

### Component Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── providers/     # Context providers
└── types/         # TypeScript type definitions
```

### Naming Conventions

- Components: PascalCase (`InventoryItem.tsx`)
- Hooks: camelCase with `use` prefix (`useInventory.ts`)
- Utilities: camelCase (`formatCurrency.ts`)
- Types: PascalCase with descriptive names (`InventoryItemType`)

## Deployment

**Production**: `main` branch auto-deploys to Vercel  
**Preview**: Feature branches create test deployments  
**Rollback**: One-click recovery via Vercel dashboard

## Kiro-Specific Behaviors

### Context Management

- Use `#File` or `#Folder` references when discussing specific files
- Leverage `#Codebase` search for pattern discovery
- Reference `#Problems` and `#Terminal` for debugging context
- Check `#Git Diff` before making related changes

### Parallel Operations

- Execute multiple independent tool calls simultaneously when possible
- Use parallel `strReplace` operations for multi-file changes
- Batch related operations (multiple file reads, simultaneous API calls)

### Error Recovery

- If repeated failures occur, explain the issue and try alternative approaches
- Use different MCP tools if primary approach fails
- Escalate to user when confidence drops below threshold

### Workspace Integration

- Respect `.kiro/steering/*.md` files for project-specific guidance
- Check for conditional steering rules based on file patterns
- Use manual steering context when user provides `#` references
