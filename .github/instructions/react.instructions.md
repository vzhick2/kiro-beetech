---
applyTo: "**/*.ts,**/*.tsx"
description: "React 19 and Next.js 15 specific coding guidelines"
---

# React 19 & Next.js 15 Instructions

## React 19 Patterns
- Use Server Components by default
- Client Components only when needed (interactivity, browser APIs)
- Use `use()` hook for async operations in components
- Leverage automatic batching improvements
- Use concurrent features without Suspense wrapper complexity

## Next.js 15 App Router
- Use app/ directory structure
- Implement proper loading.tsx and error.tsx
- Use Server Actions for mutations
- Leverage route handlers for API endpoints
- Use proper metadata API for SEO

## TypeScript Patterns
- Use strict mode configuration
- Leverage const assertions and template literals
- Use proper generic constraints
- Implement proper error types

## Performance Optimization
- Use dynamic imports for code splitting
- Implement proper React.memo usage
- Use Suspense boundaries appropriately
- Optimize bundle size with modern imports
