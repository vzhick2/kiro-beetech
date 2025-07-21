# AI Development Rules for KIRO-BEETECH Inventory System

## Project Context
- Internal business inventory management system (not public/commercial)
- Next.js 15.4.1 with React 19.1.0, TypeScript 5.8.3, Tailwind CSS 4.1.11
- Supabase for database and authentication
- Small business workflows with flexible data entry patterns

## AI Workflow Rules
- **MCP-First Approach**: Use MCP tools for deep analysis, database operations, and rapid commits
- **Database Investigation**: Use Supabase MCP to understand schema, test queries, and validate data before coding
- **Rapid Iteration**: Use GitHub MCP for fast commits when implementing multiple related changes
- **Smart Permission Model**: 
  - ASK for new features, schema changes, major architecture decisions
  - IMPLEMENT autonomously for bug fixes, UI polish, performance improvements, small enhancements
- Follow docs/requirements.md for feature specifications
- Use docs/data-model.md for database schema (verify with Supabase MCP when uncertain)
- Reference docs/technical-design.md for architecture decisions
- Use docs/development-guide.md for development standards
- **Missing Documentation**: If referenced docs don't exist or are incomplete, ask user to clarify requirements rather than assume

## Autonomous Processing Rules
### Autonomous Actions (No Permission Needed)
- Fix linting and TypeScript errors
- Format code with Prettier
- Update documentation for completed tasks
- Use existing utility functions from src/lib/utils
- Follow established naming conventions
- Update tasks.md with ✅ and completion date when marking tasks complete
- Update CHANGELOG.md with version and description when adding features
- **UI Polish & Styling**: Improve existing interfaces, fix responsive issues, enhance UX
- **Performance Fixes**: Database indexes, query optimization, bundle size improvements
- **Bug Fixes**: Resolve errors, fix broken functionality, improve error handling
- **Code Refactoring**: Improve code quality, extract utilities, optimize components
- **Small Feature Enhancements**: Extend existing functionality without changing core logic

### Permission Required Actions
- Add new features or components
- Modify database schema
- Change business logic
- Update dependencies
- Create new utility functions
- Create scripts (.ps1, .sh, .bat files)
- Create documentation files (.md files)
- Create test components or example code
- Update data-model.md and api-documentation.md when modifying database schema
- Update technical-design.md when changing architecture decisions

## Error Prevention Rules
- Check existing implementations before creating new ones
- Use existing utility functions from src/lib/utils
- Follow established naming conventions
- Verify imports and dependencies before adding
- Check for duplicate functionality
- Ensure all documentation is aligned before finalizing changes

## Code Standards (AI Must Follow)
- Use TypeScript strict mode with explicit return types
- Prefer interfaces over types for object shapes
- Write functional components with TypeScript interfaces (avoid React.FC)
- Use server components by default, 'use client' only when necessary
- Use Tailwind CSS for ALL styling (no CSS-in-JS)
- Implement early returns for better readability
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)

## AI Code Quality Standards
- Use Zod validation for runtime type safety
- Implement exhaustive branch checking with ensureExhaustive patterns
- Use efficient TypeScript checking with --skipLibCheck for development
- Prioritize type safety over convenience

## Business Logic Requirements
- Support negative inventory with warnings (real-world flexibility)
- Implement mutable transaction logs with editable records and timestamps
- Add cycle count alerts for proactive inventory management
- Design mobile-first for workshop operations
- Create direct-edit workflows for quick updates
- Support back-dating for corrections

## File Structure Patterns
- `src/app/` - Next.js 15 App Router pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities, Supabase client, business logic
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript definitions
- `docs/` - Project specifications

## Debugging and Analysis Patterns
- **MCP-Powered Debugging**: Use Supabase MCP for real-time database analysis and GitHub MCP for codebase search
- **Database Issues**: Query database directly via MCP to understand data state and validate business logic
- **Code Analysis**: Use GitHub MCP to search for similar implementations, usage patterns, and related functionality
- **Performance Investigation**: Use Supabase MCP to analyze query performance, check indexes, review security advisors
- **Integration Testing**: Use MCP tools to create test data, validate workflows, and verify end-to-end functionality
- Prioritize error handling at function beginnings
- Use guard clauses for preconditions
- Implement Zod validation for runtime type checking
- Create user-friendly error messages with clear actions

## State Management Patterns
- Use TanStack Query for server state and caching
- Use Zustand for global UI state only
- Use URL params for view state
- Use server actions for mutations

## Database Patterns
- Use Supabase client for database operations
- Implement row-level security policies
- Use PostgreSQL RPCs for atomic operations
- Use display ID pattern for user-facing references

## MCP (Model Context Protocol) Capabilities
The project has comprehensive MCP integration for enhanced development workflow:

### Supabase MCP Server
- **Project Access**: `jjpklpivpvywagmjjwpu` (full read/write access, project-scoped)
- **Database Operations**: Direct SQL queries, table inspection, data modification, schema analysis
- **Development Operations**: Run migrations, deploy Edge Functions, generate TypeScript types
- **Real-time Development**: Live database debugging, data analysis, and instant modifications
- **Advanced Features**: Security advisor checks, logs analysis, branch operations for development databases

### GitHub MCP Server  
- **Repository Access**: `vzhick2/kiro-beetech` (full repo, workflow, read:org, user scopes)
- **Fast Commits**: Single API call commits with multiple files (~85% faster than traditional git)
- **Repository Operations**: Create/update files, manage branches, handle pull requests, search code
- **Issue Management**: Create issues, manage discussions, handle project workflows
- **Deployment**: Direct push to main branch, atomic commits, batch file operations

### MCP Development Workflow
- **Database-First Development**: Use Supabase MCP to explore schema, test queries, validate data integrity
- **Rapid Prototyping**: Direct database modifications for testing business logic and data flows  
- **Fast Iteration**: GitHub MCP for instant commits, eliminating traditional git workflow delays
- **Integrated Debugging**: Real-time database inspection and modification during development
- **Production Safety**: Use Supabase branch operations for safe schema testing before production deployment

### MCP Usage Examples
- **Database**: "Show me all tables", "Add test supplier", "Check cycle count alerts", "Deploy this migration"
- **GitHub**: "Commit these changes with message X", "Create branch for feature Y", "Search for function Z in codebase"
- **Analysis**: "Analyze current inventory levels", "Show recent purchase patterns", "Validate database integrity"

## Dependency Management Rules (CRITICAL)
### Always Use Package Manager Commands
- ✅ **CORRECT**: `pnpm add package@version` (updates both package.json and lockfile)
- ✅ **CORRECT**: `pnpm add -D package@version` (for devDependencies)
- ✅ **CORRECT**: `pnpm remove package` (cleanly removes from both files)
- ❌ **NEVER**: Manually edit package.json dependencies section
- ❌ **NEVER**: Copy package.json from other projects without regenerating lockfile

### Configuration-Dependency Alignment
- When config files reference packages (postcss.config.js, tailwind.config.ts), ensure they're installed
- Example: If postcss.config.js uses `@tailwindcss/postcss`, run `pnpm add -D @tailwindcss/postcss`
- Always verify config dependencies exist before committing

### Lockfile Hygiene Prevention
- **Before Adding Dependencies**: Check if similar functionality already exists
- **After Dependency Changes**: Run `pnpm build` to verify everything works
- **Before Committing**: Ensure package.json and pnpm-lock.yaml are synchronized
- **Clean Removal**: When removing features, also remove their unused dependencies

### Deployment Validation
- Vercel uses `--frozen-lockfile` mode (strict lockfile validation)
- Any mismatch between package.json and pnpm-lock.yaml causes deployment failure
- Local `pnpm install` allows updates, production does not
- Always test: `pnpm install --frozen-lockfile && pnpm build` before deployment

## AI Development Commands
- Use `pnpm ai:validate` for fast validation (type-check, lint, format)
- Use `pnpm ai:validate:full` for full type-check for production builds
- Use `pnpm ai:fix` for auto-fixing common issues
- Use `pnpm ai:type-check` for fast type-check only
- Use `pnpm build` for production build
- Use `pnpm supabase:types` for updating database types
- Use `pnpm sync:after-mcp` for post-MCP synchronization (automated stash/pull/pop)
- Use `pnpm sync:force` for quick pull when no local changes exist

## Git Workflow Rules (2025 SIMPLIFIED)

### ULTRA-SIMPLE GIT WORKFLOW (NEW APPROACH)
To eliminate all the complexity you just experienced, here's the new simplified approach:

**Primary Rule: GitHub MCP Only for Complex Operations**
- Use GitHub MCP (`mcp_github_push_files`) for AI-driven commits only
- User manages their own Git through VS Code UI exclusively
- NO terminal Git commands unless specifically requested
- NO complex merge resolution instructions

**VS Code Git Integration (User-Friendly)**
- **Status Bar Sync**: Click sync button for pull/push (one-click operation)
- **Source Control Panel**: `Ctrl+Shift+G` for visual Git management
- **Auto-Resolve**: Let VS Code handle merge conflicts with built-in editor
- **Simple Commits**: Use commit message box and commit button
- **No CLI Required**: Everything through VS Code interface

**When Conflicts Happen (SIMPLIFIED)**
1. **Click "Resolve in Merge Editor"** (VS Code will guide you)
2. **Accept Current/Incoming/Both** (visual interface)
3. **Click "Complete Merge"** (one button)
4. **Commit through VS Code UI** (standard commit)

**GitHub MCP Usage Pattern**
- **Batch Changes**: Use MCP for multiple related files (docs updates, refactoring)
- **Single Files**: User manages directly through VS Code
- **Merge Conflicts**: User resolves through VS Code, AI doesn't interfere
- **Complex Operations**: Branch management, PRs, etc. through GitHub web interface

**AI Responsibilities (SIMPLIFIED)**
- ✅ **DO**: Use GitHub MCP for batch documentation updates, multi-file features
- ✅ **DO**: Provide clear commit messages with scope and impact
- ❌ **DON'T**: Give terminal git commands unless specifically asked
- ❌ **DON'T**: Provide complex merge resolution steps
- ❌ **DON'T**: Assume user wants to use terminal over VS Code UI

**User Responsibilities (SIMPLIFIED)**
- ✅ **DO**: Use VS Code Source Control panel for day-to-day commits
- ✅ **DO**: Click VS Code sync button for pull/push operations
- ✅ **DO**: Use VS Code merge editor for conflict resolution
- ❌ **DON'T**: Feel obligated to use terminal commands
- ❌ **DON'T**: Worry about complex git workflows

### GitHub MCP Integration Rules
- **Batch Changes**: Clearly describe scope of multi-file operations
- **Atomic Commits**: Group related changes in single commits
- **Clear Messages**: Include scope (docs:, feat:, fix:) and impact description
- **File Organization**: Ensure related changes are committed together

### MCP Success Indicators
- ✅ **Multiple file commits**: Documentation updates, feature implementations
- ✅ **Clear commit messages**: Scope and impact clearly described  
- ✅ **Atomic operations**: Related changes grouped logically
- ✅ **User autonomy preserved**: User maintains control over their git workflow

**Key Insight**: This approach gives users the choice between VS Code's user-friendly interface and GitHub MCP's efficiency for batch operations, without forcing terminal complexity.
