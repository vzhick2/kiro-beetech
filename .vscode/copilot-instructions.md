# KIRO-BEETECH VS Code Configuration

This project uses **modern multi-IDE AI rules** with primary rules in `.cursor/rules/` and fallback support for VS Code.

## AI Rules Hierarchy

**Modern Cursor (0.46+)**: `.cursor/rules/*.mdc` files
**VS Code Copilot**: This file + `.cursorrules` fallback
**Other IDEs**: `.cursorrules` fallback

## Quick Reference for VS Code Copilot

### Core Project Rules

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.x only
- **Database**: Supabase
- **State**: Zustand + TanStack Query

### Key Development Standards

- Server components by default, 'use client' only when necessary
- TypeScript for ALL code, prefer interfaces over types
- Early returns for better readability
- Component interfaces match component name
- Always ask before implementing changes

### VS Code Specific Workflow

1. Use `Ctrl+Shift+P` for command palette
2. Leverage built-in TypeScript IntelliSense
3. Use integrated ESLint/Prettier for code quality
4. Reference `.cursor/rules/` or `.cursorrules` for complete standards

**For complete AI coding instructions, see `.cursor/rules/` directory or `.cursorrules` fallback.**
