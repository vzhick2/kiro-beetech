# VS Code Configuration

This folder contains VS Code-specific settings and configurations for the BTINV-BEETECH project.

## Files Overview

- **`settings.json`** - VS Code workspace settings
- **`copilot-instructions.md`** - Multi-IDE AI rules reference
- **`copilot-setup-steps.yaml`** - Setup documentation

## AI Coding Rules (2025 Modern Approach)

This project uses **modern multi-IDE AI rules** following 2025 best practices:

### **Primary Sources (Hierarchical)**:

1. **`.cursor/rules/*.mdc`** - Modern Cursor 0.46+ rules (primary)
2. **`.cursorrules`** - Universal fallback for all IDEs
3. **`.vscode/copilot-instructions.md`** - VS Code specific guidance

### **Rule Files Structure**:

- **`001_workspace.mdc`** - Core project architecture & constraints
- **`002_cursor_rules.mdc`** - How .mdc files work (meta)
- **`100_typescript.mdc`** - TypeScript coding standards
- **`200_react_nextjs.mdc`** - React 19 & Next.js 15 standards

## Usage

When working in VS Code:

1. Refer to `.cursor/rules/` for modern standards
2. Use `.cursorrules` as fallback reference
3. Use VS Code's built-in features (ESLint, Prettier, TypeScript checking)
4. Leverage the copilot-instructions.md for quick guidance

## Multi-IDE Strategy (2025)

This setup ensures consistent AI behavior across:

- **Cursor 0.46+** - Reads `.cursor/rules/*.mdc` natively
- **VS Code** - References through `copilot-instructions.md` + `.cursorrules`
- **Windsurf** - Uses `.cursorrules` as context
- **Other IDEs** - Manual reference to `.cursorrules`

**Benefits**: Modern, maintainable, IDE-agnostic, future-proof
