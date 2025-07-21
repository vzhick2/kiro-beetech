# Symbolic Link Setup Instructions

This project uses symbolic links to eliminate duplicate configuration files:

## Current Symlinks

### AI Instructions
- **Target**: `.vscode/copilot-instructions.md` (master file)
- **Link**: `.cursorrules` → `.vscode/copilot-instructions.md`
- **Purpose**: Unified AI behavior rules for both VS Code and Cursor

### MCP Configuration
- **Target**: `mcp.json` (master file)
- **Link**: `.cursor/mcp.json` → `../mcp.json`
- **Purpose**: Single MCP configuration for both IDEs

## Creating Symlinks (Windows)

After cloning, run these PowerShell commands as Administrator:

```powershell
# Navigate to project root
cd "C:\BeeTech VSCODE PROJECTS\KIRO-BEETECH"

# Create AI instructions symlink
Remove-Item ".cursorrules" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path ".cursorrules" -Target ".vscode\copilot-instructions.md"

# Create MCP configuration symlink
Remove-Item ".cursor\mcp.json" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path ".cursor\mcp.json" -Target "..\mcp.json"
```

## Benefits

- ✅ **Single Source of Truth**: Edit one file, both IDEs see changes
- ✅ **Zero Maintenance**: No manual synchronization needed
- ✅ **Git Friendly**: Changes tracked in one location
- ✅ **IDE Compatibility**: Works seamlessly with both editors

## Verification

After creating symlinks:

1. **Check AI instructions**: Edit `.vscode/copilot-instructions.md`, verify `.cursorrules` reflects changes
2. **Check MCP config**: Edit `mcp.json`, verify `.cursor/mcp.json` reflects changes
3. **Test in both IDEs**: Confirm both VS Code and Cursor read configurations correctly
