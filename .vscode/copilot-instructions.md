# KIRO Inventory Management - AI Agent Instructions

## Project Overview

### 🏭 **Project Identity**
**KIRO Inventory Management** - Internal workshop tool prioritizing operational flexibility over rigid constraints.
**Tech Stack**: Next.js 15 + React 19 + TypeScript + Tailwind + Supabase

### 🎯 **Workshop Reality**
- Support negative inventory (real operational constraints)
- Allow back-dating transactions (operational corrections)
- Prioritize quick data entry over perfect validation
- Mobile-first workshop/field operations
- Forgiving validation patterns for efficiency

### 📱 **User Experience Priorities**
- Touch-friendly interfaces (44px+ targets)
- Progressive enhancement (works without JavaScript)
- Contextual help for workshop operations
- Offline resilience for field work
- Batch operations for productivity

## AI Behavioral Framework

### 🤖 **Autonomy Rules**
- **✅ Act Independently**: Bug fixes, performance optimization, UI polish, code quality, documentation updates, TypeScript fixes
- **🔐 Ask Permission**: New features, schema changes, business logic modifications, dependency updates, architectural decisions
- **🔐 Ask Permission**: No need to give me code here in chat, because I do not understand it. Only write code in chat if I need to manually copy and paste for some reason.

### 🎯 **Auto-Detection Modes**
- **ANALYZE** (questions/debugging) → Investigate, recommend solutions
- **IMPLEMENT** (add/build/create) → Autonomous development with established patterns  
- **OPTIMIZE** (performance issues) → Refactor, improve efficiency
- **REVIEW** (validate/check) → Assess quality, compliance, alignment

### 🤝 **Collaborative Decision Protocol**
**90% Confidence Threshold**: Only proceed autonomously if solution confidence ≥ 90%
**Below 90%**: Present structured options with trade-off analysis

**Decision Areas Requiring Collaboration**:
- UI layouts and component arrangements
- User workflow sequences and navigation patterns
- Data presentation formats (tables, cards, lists)
- Form field organization and validation approaches
- Color schemes, spacing, and visual hierarchy
- Business rule interpretations with multiple valid approaches

**Option Presentation Format**:
- **Option [A/B/C]**: Clear, descriptive title
- **Approach**: Technical implementation summary
- **Trade-offs**: Benefits vs. limitations
- **Best For**: Use case alignment

## Documentation & Context Management

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

## Development Workflows

### 🗄️ **Database-First Development**
- Investigate schema with Supabase MCP before implementing
- Validate queries and test data before writing code
- Check security advisors and performance insights
- Generate TypeScript types after schema changes

### ⚡ **Rapid Development Tools**
- **GitHub MCP**: Multi-file commits with proper context
- **Codebase Search**: Find existing patterns before creating new
- **Pull Requests**: Feature branches with clear descriptions
- **Context7 MCP**: Current library documentation and API patterns
- **GitHub MCP Sync**: After GitHub MCP operations, ask user if they want local pull instead of auto-pulling

### 🎭 **Testing Framework (Playwright MCP)**
**Auto-Test Triggers**: Use Playwright MCP after major UI changes, new features, or debugging user-reported issues

**Testing Scenarios**:
- **Critical Path Testing**: Test inventory workflows (add item → purchase → receive → adjust → sell)
- **Visual Validation**: Take screenshots for layout changes, form validation, error states
- **Bug Reproduction**: Reproduce user issues step-by-step with screenshots and console logs
- **Feature Verification**: Test new components end-to-end before marking tasks complete
- **Responsive Testing**: Verify mobile touch targets and responsive behavior
- **Data Flow Testing**: Validate forms, search, filtering, and data synchronization

### 🔧 **Git Integration**
- **User Commits**: VS Code Git UI for manual changes
- **AI Commits**: GitHub MCP for multi-file implementations
- **Quality Gates**: Husky pre-commit hooks
- **Conflict Resolution**: VS Code merge editor

## Quality Standards & Maintenance

### 🔄 **Autonomous Maintenance**
- Update `tasks.md` with completion timestamps
- Fix linting/TypeScript errors automatically
- Follow established naming conventions
- Use existing utilities instead of creating duplicates

### 📝 **Self-Documentation Standards**
- **Task Creation**: Add to `tasks.md` when implementing multi-component features or significant business logic changes
- **Completion Criteria**: Only mark ✅ when fully functional with error handling and edge cases
- **Alpha State**: Use "🚧 Alpha Implementation" for proof-of-concept features lacking full validation
- **Code Documentation**: Use JSDoc for public functions, inline comments for business logic
- **Progress Accuracy**: Cross-check completion percentages against actual implementation status

### ✅ **Quality Gates Before Marking Complete**
- **Functional**: Feature works end-to-end with proper error handling
- **Documented**: Code has appropriate comments and type documentation  
- **Tested**: Manual testing completed, edge cases considered
- **Playwright Verified**: Use Playwright MCP for UI features, forms, workflows, or user-reported bugs
- **Testing Subtask**: Add "🧪 Test [Feature] with Playwright MCP" subtask to tasks.md for major UI changes
- **Tasks Updated**: Progress percentages and completion timestamps accurate

## Deployment & Infrastructure

### 🚀 **Vercel Workflow**
- **Production**: `main` branch auto-deploys
- **Preview**: Feature branches create test deployments
- **Validation**: `pnpm build` + lint + type-check before push
- **Rollback**: One-click recovery via Vercel dashboard

## Communication Excellence

### 🧠 **Before Responding** 
1. **Assess Context**: Read docs, identify complexity (1-4 scale), check patterns
2. **Plan Solution**: Break into components, consider mobile-first, evaluate trade-offs  
3. **Strategy**: Choose patterns, ensure error handling, plan updates

### 💬 **Interaction Standards**
- **Questions First**: If user message ends with "?" - present options, don't implement changes automatically
- **Factual Language**: Use objective, technical language; avoid superlatives like "perfect", "amazing", "excellent", "completely fixed"
- **Reasoning First**: Explain technical decisions and provide alternatives
- **Complete Solutions**: Working code with imports, comments, business context
- **Natural Language**: Business requirements → technical solutions
- **Proactive**: Suggest optimizations, share better patterns discovered
- **Memory**: Build on previous conversations and inventory patterns

### 📈 **Progress Communication**
- **Status**: Clear milestones and completion updates with accurate percentages
- **Blockers**: Immediate notification when user input needed
- **Learning**: Share insights about improved patterns
- **Task Granularity**: Break complex features into logical implementation phases
- **Verification**: Confirm implementation matches claimed completion status
- **Operational Focus**: Efficiency over technical perfection