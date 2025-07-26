# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development workflow
pnpm dev                   # Start dev server (primary command)
pnpm build                 # Build for production
pnpm lint && pnpm type-check  # Check before committing
pnpm format                # Format code with Prettier
pnpm clean                 # Clear .next and cache folders

# Database (after schema changes)
pnpm db:generate          # Regenerate TypeScript types
pnpm db:start             # Start local Supabase
pnpm db:stop              # Stop local Supabase
pnpm db:reset             # Reset local database
pnpm db:status            # Check Supabase status

# Testing
pnpm test                 # Run Playwright tests
pnpm test:ui              # Run with visual UI
```

## Common Issues & Quick Fixes

- **Port 3000 already in use**: Next.js auto-switches to 3001+ (normal behavior)
- **Dev server gets stuck**: Delete `.next` folder, restart with `pnpm dev`
- **Changes not updating**: Clear cache with `pnpm clean && pnpm dev`
- **Type errors after DB changes**: `pnpm db:generate` to regenerate types
- **Build failures**: Run `pnpm lint && pnpm type-check` first
- **Slow compilation**: Normal for Next.js dev mode, use `pnpm build` for production testing

## Project Context

**Business Domain**: Workshop-focused inventory management system with two-mode tracking:

- **Fully Tracked** 🟢: Complete inventory with WAC calculations
- **Cost Added** 🟡: Simple cost allocation without quantity tracking

**Stack**: Next.js 15 + Supabase + TypeScript + Tailwind + pnpm (required)
**Focus**: Mobile-first, workshop/field operations, operational flexibility over rigid constraints

**Database clients**:

- `supabase` (browser/RLS)
- `supabaseAdmin` (server actions)

**Key business logic**:

- WAC calculations handled by PostgreSQL functions
- All inventory changes create audit logs
- Cost allocation distributes overhead proportionally
- Support negative inventory with proper alerting
- Allow back-dating transactions for operational corrections

**Workshop Reality Considerations**:

- Touch-friendly interfaces for mobile operations (44px+ touch targets)
- Forgiving validation patterns for efficiency
- Batch operations for productivity
- Progressive enhancement (works without JavaScript)

## Development Workflow

### MCP Tool Integration

**Available MCP servers**:

- **GitHub MCP**: Multi-file commits and PR creation (ask user about local pull after operations)
- **Playwright MCP**: Auto-trigger after UI changes, critical path testing, visual validation
- **Supabase MCP**: Validate schema and test queries before code changes
- **Context7 MCP**: Look up current documentation for libraries
- **Firecrawl MCP**: Research and gather external information

### Development Patterns

**Server Actions**: All database operations in `src/app/actions/`
**Components**: Feature-organized in `src/components/[feature]/`
**Types**: Auto-generated from Supabase schema - run `pnpm db:generate` after DB changes
**Validation**: Zod schemas in `src/lib/validations/`
**Utilities**: Shared functions in `src/lib/utils/` (check before creating new)
**State Management**: Zustand for client state, TanStack Query for server state

### Testing Guidelines

**Auto-test triggers** (use Playwright MCP):

- Major UI changes or new features
- User-reported bugs
- Critical inventory workflows: add item → purchase → receive → adjust → sell
- Form validation and error states

## AI Behavioral Guidelines

### Autonomy Rules

**✅ Act Independently:**

- Bug fixes, performance optimization, UI polish
- Code quality improvements, TypeScript fixes
- Documentation updates, lint fixes

**🔐 Ask Permission:**

- New features, schema changes, business logic modifications
- Dependency updates, architectural decisions
- UI layouts and workflow sequences

### Decision Protocol

- **90% Confidence Threshold**: Only proceed autonomously if solution confidence ≥ 90%
- **Below 90%**: Present structured options with trade-offs
- **Option Format**: Clear title + approach + trade-offs + best use case

### Quality Standards

- **Task Updates**: Add to `docs/tasks.md` for multi-component features
- **Completion Criteria**: Only mark ✅ when fully functional with error handling
- **Testing Required**: Use Playwright MCP after major UI changes
- **Mobile Testing**: Verify touch targets (44px+) and responsive behavior

### Communication Standards

- **Questions First**: If user message ends with "?" - present options, don't implement automatically
- **Factual Language**: Use objective, technical language; avoid superlatives like "perfect", "amazing", "excellent", "completely fixed"
- **Reasoning First**: Explain technical decisions and provide alternatives before implementing
- **No Code in Chat**: Only show code in chat if user needs to manually copy/paste for specific reasons

### Response Pattern

1. **Assess Context**: Read docs, identify complexity, check existing patterns
2. **Plan Solution**: Break into components, consider mobile-first, evaluate trade-offs
3. **Strategy**: Choose patterns, ensure error handling, plan implementation

## Documentation References

**Primary References**:

- `docs/tasks.md` - Current development work and roadmap
- `docs/developer-guide.md` - Complete technical patterns and standards
- `docs/product-specification.md` - Business requirements authority
- `docs/technical-reference.md` - Database schema and API reference

**Context Validation Process**:

1. Check current task status in `docs/tasks.md`
2. Reference technical patterns in `docs/developer-guide.md`
3. Validate business alignment with `docs/product-specification.md`
4. Use `docs/technical-reference.md` for database operations
5. Ask for clarification if documentation is missing/incomplete
