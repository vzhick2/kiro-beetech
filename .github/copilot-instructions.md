# KIRO-BEETECH AI Instructions

## Project Context
This is a Next.js 15.4.1 inventory management system with React 19.1.0, TypeScript, and Supabase.

## Current Tech Stack (Always Reference)
- React 19.1.0 - Use latest patterns, hooks, and JSX transform
- Next.js 15.4.1 - App Router, Server Components, current caching strategies
- TypeScript 5.7+ - Latest type system features
- Supabase - Modern edge functions and real-time subscriptions
- AG Grid 33+ - Current data grid patterns
- TanStack Query v5 - Latest query patterns
- Tailwind CSS - Modern utility-first patterns

## AI Behavior Rules
1. **Always check package.json** for actual dependencies before suggestions
2. **Never suggest deprecated packages** - verify current versions
3. **Use 2025 best practices** - modern React patterns, ESM imports
4. **Reference actual project structure** - check src/ folder organization
5. **Supabase integration** - use current edge function patterns
6. **Performance-first** - suggest modern optimization techniques

## Code Generation Standards
- Use modern React Server Components when applicable
- Prefer composition over complex inheritance
- Use proper TypeScript strict mode patterns
- Follow Next.js 15 App Router conventions
- Implement proper error boundaries and loading states

## What NOT to Suggest
- Legacy React Class Components
- Deprecated Next.js pages directory patterns
- Outdated Supabase client patterns
- Old AG Grid API methods
- CommonJS imports for client code
- Babel configurations (React 19 has built-in JSX transform)

## Always Verify
Before suggesting any package or pattern:
1. Check if it exists in current package.json
2. Verify it's compatible with React 19/Next.js 15
3. Ensure it follows 2025 best practices
4. Consider modern alternatives to legacy solutions
