# Project Context

## Project Identity
**KIRO Inventory Management** - Internal workshop tool prioritizing operational flexibility over rigid constraints.
**Tech Stack**: Next.js 15 + React 19 + TypeScript + Tailwind + Supabase

## AI Behavioral Framework

### 🤖 **Autonomy Rules**
- **✅ Act Independently**: Bug fixes, performance optimization, UI polish, code quality, documentation updates, TypeScript fixes
- **🔐 Ask Permission**: New features, schema changes, business logic modifications, dependency updates, architectural decisions

### 🎯 **Auto-Detection Modes**
- **ANALYZE** (questions/debugging) → Investigate, recommend solutions
- **IMPLEMENT** (add/build/create) → Autonomous development with established patterns  
- **OPTIMIZE** (performance issues) → Refactor, improve efficiency
- **REVIEW** (validate/check) → Assess quality, compliance, alignment

## Business & Operational Context

### 🏭 **Workshop Reality** 
- Support negative inventory (real operational constraints)
- Allow back-dating transactions (operational corrections)
- Prioritize quick data entry over perfect validation
- Mobile-first workshop/field operations
- Forgiving validation patterns for efficiency

### 🎯 **User Experience Priorities**
- Touch-friendly interfaces (44px+ targets)
- Progressive enhancement (works without JavaScript)
- Contextual help for workshop operations
- Offline resilience for field work
- Batch operations for productivity

## Development Standards

### 🛡️ **Non-Negotiable Quality**
- TypeScript strict mode with exhaustive checking
- Server Components default, Client Components only when needed
- Error boundaries with graceful degradation
- WCAG 2.1 AA accessibility compliance
- Mobile-responsive design patterns

### 🏗️ **Code Philosophy**
- Early returns over nested conditions
- Named exports over default exports
- Zod validation for runtime safety
- Functional components without React.FC
- Business logic in separate utilities
- Graceful error handling with user-friendly messages

## Project Intelligence & Documentation

### 📚 **Documentation Hierarchy**
1. `docs/tasks.md` - Current work (✅ + timestamp on completion)
2. `docs/developer-guide.md` - Technical patterns and standards
3. `docs/product-specification.md` - Business requirements authority
4. `docs/technical-reference.md` - Database schema and APIs

### 🔍 **Context Validation Process**
Before making changes, always:
1. Check current task status in `docs/tasks.md`
2. Reference technical patterns in `docs/developer-guide.md`
3. Validate business alignment with `docs/product-specification.md`  
4. Use `docs/technical-reference.md` for database operations
5. **Ask for clarification** if documentation is missing/incomplete

### 🧩 **Pattern Recognition**
- Use existing `src/lib/utils` functions (check before creating new)
- Follow established component patterns in codebase
- Validate database schema via Supabase MCP
- Align with business workflows from product specification

## MCP Integration & Workflows

### 🗄️ **Database-First Development**
- Investigate schema with Supabase MCP before implementing
- Validate queries and test data before writing code
- Check security advisors and performance insights
- Generate TypeScript types after schema changes

### ⚡ **Rapid Development**
- **GitHub MCP**: Multi-file commits with proper context
- **Codebase Search**: Find existing patterns before creating new
- **Pull Requests**: Feature branches with clear descriptions
- **Context7 MCP**: Current library documentation and API patterns

### 🔄 **Autonomous Maintenance**
- Update `tasks.md` with completion timestamps
- Fix linting/TypeScript errors automatically
- Follow established naming conventions
- Use existing utilities instead of creating duplicates

## Deployment & Quality Assurance

### 🚀 **Vercel Workflow**
- **Production**: `main` branch auto-deploys
- **Preview**: Feature branches create test deployments
- **Validation**: `pnpm build` + lint + type-check before push
- **Rollback**: One-click recovery via Vercel dashboard

### 🔧 **Git Integration**
- **User Commits**: VS Code Git UI for manual changes
- **AI Commits**: GitHub MCP for multi-file implementations
- **Quality Gates**: Husky pre-commit hooks
- **Conflict Resolution**: VS Code merge editor

## Communication Excellence

### 🧠 **Before Responding** 
1. **Assess Context**: Read docs, identify complexity (1-4 scale), check patterns
2. **Plan Solution**: Break into components, consider mobile-first, evaluate trade-offs  
3. **Strategy**: Choose patterns, ensure error handling, plan updates

### 💬 **Interaction Standards**
- **Reasoning First**: Explain technical decisions and provide alternatives
- **Complete Solutions**: Working code with imports, comments, business context
- **Natural Language**: Business requirements → technical solutions
- **Proactive**: Suggest optimizations, share better patterns discovered
- **Memory**: Build on previous conversations and inventory patterns

### 📈 **Progress Communication**
- **Status**: Clear milestones and completion updates
- **Blockers**: Immediate notification when user input needed
- **Learning**: Share insights about improved patterns
- **Operational Focus**: Efficiency over technical perfection