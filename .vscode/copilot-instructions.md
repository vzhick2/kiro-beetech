# WindsurfBT Workspace

This workspace contains multiple projects including business applications. Follow these guidelines when contributing to any project:

**Multi-Project Structure**: This workspace contains multiple subprojects (myapp/, sheetsapp/, etc.). Always identify which project you're working on and apply project-specific guidelines found in each project's docs/ folder.

## Universal Development Standards
- Use clear, descriptive names for functions, variables, and files
- Write unit tests for high-risk business logic and calculations  
- Keep functions focused and manageable (generally <50 lines)
- Handle errors gracefully with appropriate user feedback
- Document public APIs and complex logic

## File Management Rules
- **NEVER** create duplicate files across subprojects (sheetsapp/, myapp/, etc.)
- **ALWAYS** use list_dir to verify file locations before moving/deleting
- **Project-wide scripts**: Only in `scripts/` directory at workspace root
- **Subproject files**: Only project-specific files in their folders
- **Before file operations**: List directories to confirm current state
- **After file operations**: List directories again to verify success
- **When moving files**: Delete from source location immediately after copying

## AI Behavior Rules

### **MANDATORY WORKFLOW COMPLIANCE**
- **NEVER IMPLEMENT CHANGES WITHOUT EXPLICIT USER APPROVAL**
- **ALWAYS ASK "Should I implement this?" BEFORE making any file changes**
- **WHEN USER ASKS FOR SUGGESTIONS: Provide options, then STOP and WAIT for approval**

### Core Collaboration Rules
- **ASK BEFORE ACTING**: When user asks "should I..." or "can you...", provide the suggestion but **WAIT** for explicit approval before making changes
- **ONE STEP AT A TIME**: Don't assume next steps - wait for user confirmation
- **PLAN BEFORE IMPLEMENTATION**: When asked to "find fixes" or "identify improvements," propose a plan first and **WAIT** for approval

### **CRITICAL STOPPING POINTS** - Always ask for approval before:
- Making any file edits (create, modify, delete)
- Implementing suggestions or recommendations  
- Moving to next steps in a workflow
- Running terminal commands that modify files
- Installing packages or dependencies

### File Operations
- **CONFIRM FILE OPERATIONS**: Always ask before deleting, moving, or creating files unless explicitly instructed
- **VERIFY BEFORE READING**: Before using read_file, verify files exist with list_dir or file_search to avoid creating phantom files
- **VERIFY BEFORE REMOVAL**: Before proposing to remove files, verify they actually exist using file_search or list_dir

### **IMPLEMENTATION WORKFLOW**
```
1. User asks for suggestions/improvements
2. AI provides options with clear explanations
3. AI asks: "Which of these would you like me to implement?"
4. AI WAITS for explicit user choice
5. AI implements ONLY the approved items
6. If user says "brainstorm" or "suggest" - STOP after providing options
```

### **NEXT.JS DEVELOPMENT SPECIFIC RULES**
- **NEVER edit files while dev server is running** - Always check server status first
- **ALWAYS validate file syntax after edits** - Use get_errors to check for compilation issues
- **BEFORE large file replacements**: Read the full file first to understand structure
- **WHEN editing React components**: Include sufficient context (5+ lines) in replace operations
- **TERMINAL COMMANDS**: Use proper path escaping for Windows paths with spaces
- **DEV SERVER**: Check if server is already running before starting new instances
- **FILE CORRUPTION PREVENTION**: After any edit, immediately check for errors with get_errors

### **WINDOWS PATH HANDLING**
- Use PowerShell-compatible path escaping: `cd 'c:\path with spaces'`
- Always check current directory before running commands
- Kill existing dev servers before starting new ones

### Communication Standards  
- **USE ESTABLISHED TERMS**: Never create or use made-up industry terms, labels, or unnecessary characterizations
- **FACTUAL LANGUAGE**: Describe what you observe without inventing labels like "obsession," "ritual," "theater"
- **NEVER SAY "READY"**: Avoid terms like "ready for implementation," "production-ready" - use "planned," "specified," or "documented"
- **PRESERVE AI REPORTS**: Implement approved changes to documentation but NEVER edit original AI reports - leave as historical record