# Project Development Scripts 🛠️

This directory contains PowerShell scripts for efficient development workflow across all subprojects in the WindsurfBT repository. Now with **beginner-friendly "vibe coding" tools** for a more enjoyable development experience!

## 🚀 Quick Start

### 🎵 Beginner-Friendly Tools
```powershell
# Chill coding vibes - perfect for beginners
.\scripts\vibe.ps1

# Focus mode - 25min distraction-free coding
.\scripts\focus.ps1 25

# Explore your codebase like an adventure
.\scripts\explore.ps1
```

### 🛠️ Professional Development Tools
```powershell
# Interactive menu
.\scripts\dev.ps1

# Quick commit
.\scripts\dev.ps1 quick "fix: Update WAC formula" sheetsapp

# Start auto-save
.\scripts\dev.ps1 auto

# Check status
.\scripts\dev.ps1 status
```

## 📜 Available Scripts

### 1. `dev.ps1` - Master Development Tool
**Purpose**: Menu-driven interface for all development operations
**Features**:
- 🎯 Interactive menu system
- 📊 Git status overview grouped by subproject
- 📚 Recent commit history
- 📁 Subproject listing and analysis
- 🔧 Development environment setup

**Usage**:
```powershell
# Interactive mode
.\scripts\dev.ps1

# Direct commands
.\scripts\dev.ps1 quick "commit message" [subproject]
.\scripts\dev.ps1 auto [subproject]
.\scripts\dev.ps1 status
.\scripts\dev.ps1 push
.\scripts\dev.ps1 history
.\scripts\dev.ps1 projects
```

### 2. `quick-commit.ps1` - Fast Git Commits
**Purpose**: Streamlined git add, commit, and optional push
**Features**:
- 🏷️ Auto-enhanced commit messages with subproject tags
- 📊 File count and change summary
- 🎯 Subproject filtering
- 🚀 Optional immediate push
- 🆔 Commit hash display

**Usage**:
```powershell
# Basic commit
.\scripts\quick-commit.ps1 "fix: Update formula"

# Subproject-specific
.\scripts\quick-commit.ps1 "feat: Add recipe scaling" sheetsapp

# Interactive (prompts for message)
.\scripts\quick-commit.ps1
```

**Output Example**:
```
✅ Commit successful!
🆔 Commit hash: a1b2c3d
💾 Committing with message: '[sheetsapp] fix: Update WAC formula (3 files)'
```

### 3. `auto-save.ps1` - Background Auto-Commits
**Purpose**: Automatic periodic commits during development sessions
**Features**:
- ⏰ Configurable interval (default 15 minutes)
- 🎯 Subproject filtering
- 🧪 Dry-run mode for testing
- 📊 Session statistics
- 🛑 Graceful Ctrl+C handling

**Usage**:
```powershell
# Basic auto-save (15 min intervals)
.\scripts\auto-save.ps1

# Custom interval
.\scripts\auto-save.ps1 -IntervalMinutes 30

# Focus on specific subproject
.\scripts\auto-save.ps1 -Subproject "sheetsapp"

# Test mode (no actual commits)
.\scripts\auto-save.ps1 -DryRun
```

**Session Output**:
```
🤖 Auto-save git monitor starting...
📁 Working directory: C:\WindsurfBT
🎯 Focusing on subproject: sheetsapp
📅 Checking for changes every 15 minutes
🛑 Press Ctrl+C to stop

[14:23:15] 📝 Found 3 changes in sheetsapp
✅ Auto-committed: '[sheetsapp] Auto-save: Jul 16 14:23 - 3 files changed'
```

### 4. `vibe.ps1` - Beginner-Friendly Coding Vibes 🎵
**Purpose**: Fun, welcoming project setup for beginners
**Features**:
- 🌟 Colorful, encouraging interface
- 🎯 Auto-detect workspace and suggest projects
- 📊 Visual git status with emojis
- 💡 Quick action suggestions
- 🎨 Makes coding feel less intimidating

**Usage**:
```powershell
# Auto-detect and choose project
.\scripts\vibe.ps1

# Go directly to specific project
.\scripts\vibe.ps1 sheetsapp
```

### 5. `focus.ps1` - Distraction-Free Coding Sessions 🎯
**Purpose**: Pomodoro-style focus timer for deep work
**Features**:
- ⏰ Customizable timer (default 25 minutes)
- 🧘‍♀️ Minimal, distraction-free interface
- 📊 Progress tracking in title bar
- 🔔 Completion celebration
- 💾 Auto-save reminders

**Usage**:
```powershell
# 25-minute focus session
.\scripts\focus.ps1

# Custom duration
.\scripts\focus.ps1 45
```

### 6. `explore.ps1` - Interactive Codebase Explorer 🗺️
**Purpose**: Make codebase exploration fun and educational
**Features**:
- 📊 Project overview with statistics
- 🎲 Random file discovery
- 🔍 Interactive file search
- 📄 File previews with syntax
- 🎮 Adventure-game style interface

**Usage**:
```powershell
# Start interactive exploration
.\scripts\explore.ps1
```

## 🎯 Subproject Support

These scripts are designed to work across multiple subprojects:

| **Subproject** | **Description** | **Key Files** |
|----------------|-----------------|---------------|
| `sheetsapp` | Google Sheets Inventory System | `Code.gs`, `AddItemDialog.html` |
| `myapp` | Next.js Supabase Application | `package.json`, components |
| `grokdocs` | Documentation and guides | Markdown files |

### Subproject-Specific Commands:
```powershell
# Work only on sheetsapp
.\scripts\dev.ps1 quick "fix: WAC formula" sheetsapp
.\scripts\auto-save.ps1 -Subproject "sheetsapp"

# Work only on myapp
.\scripts\dev.ps1 quick "feat: Add dashboard" myapp
.\scripts\auto-save.ps1 -Subproject "myapp"
```

## 🏆 Expert Workflow Recommendations

### 🔄 Development Session
```powershell
# 1. Start development session
.\scripts\dev.ps1 auto sheetsapp

# 2. Work on features (auto-commits every 15 min)

# 3. Major milestone reached
.\scripts\dev.ps1 quick "feat: Complete purchase reconciliation" sheetsapp

# 4. End session
Ctrl+C  # Stop auto-save
.\scripts\dev.ps1 push
```

### 📊 Status Checking
```powershell
# Quick overview
.\scripts\dev.ps1 status

# Detailed project analysis
.\scripts\dev.ps1 projects
```

### 🚀 Release Preparation
```powershell
# Check all changes
.\scripts\dev.ps1 status

# Final commit
.\scripts\dev.ps1 quick "release: v2.0 - Complete inventory system"

# Push to remote
.\scripts\dev.ps1 push
```

## 🔧 Configuration

### Customizing Auto-Save Intervals
Default intervals by development type:
- **Active coding**: 15 minutes (default)
- **Documentation**: 30 minutes
- **Experimentation**: 10 minutes

### Message Templates
The scripts automatically enhance commit messages:
- `"fix: Update formula"` → `"[sheetsapp] fix: Update formula (3 files)"`
- Auto-saves: `"[sheetsapp] Auto-save: Jul 16 14:23 - 3 files changed"`

## 🐛 Troubleshooting

### Common Issues:
1. **PowerShell Execution Policy**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Git Not Found**
   - Ensure Git is installed and in PATH
   - Restart PowerShell after Git installation

3. **Permission Errors**
   - Run PowerShell as Administrator if needed
   - Check file permissions in project directory

### Debug Mode:
```powershell
# Dry run to test without changes
.\scripts\auto-save.ps1 -DryRun
```

## 📈 Benefits

✅ **Never lose work**: Maximum 15 minutes of work lost  
✅ **Zero friction**: One command for commit + push  
✅ **Project organization**: Automatic subproject tagging  
✅ **Development insight**: Track progress with auto-commits  
✅ **Team collaboration**: Consistent commit message format  
✅ **AI-friendly**: Preserves all development iterations  

These scripts transform git from a chore into an automatic part of your development workflow! 🎉
