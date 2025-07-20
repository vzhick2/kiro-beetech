# MCP (Model Context Protocol) Setup Guide

## Overview

This project is configured with two MCP servers for enhanced development workflow:

- **Supabase MCP Server**: Database operations and management
- **GitHub MCP Server**: Repository operations and fast commits

## Configuration Files

### Main Configuration

- `.vscode/mcp.json` - VS Code MCP configuration
- `mcp.json` - Root-level MCP configuration

### Environment Variables

- `mcp-env.example` - Example environment variables file
- `start-mcp.ps1` - PowerShell script to start MCP servers

## MCP Servers

### Supabase MCP Server

- **Package**: `@supabase/mcp-server-supabase@0.4.5`
- **Project**: `jjpklpivpvywagmjjwpu`
- **Functions**: Database queries, table management, schema operations

### GitHub MCP Server

- **Package**: `@modelcontextprotocol/server-github`
- **Repository**: `vzhick2/kiro-beetech`
- **Functions**: Fast commits, file operations, repository management

## Available MCP Functions

### Supabase Functions

- `supabase_db_query` - Execute database queries
- `supabase_db_execute` - Execute database commands
- `supabase_list_tables` - List all tables
- `supabase_describe_table` - Get table schema
- `supabase_db_list_tables` - List database tables
- `supabase_db_describe_table` - Describe table structure
- `supabase_db_query_sql` - Execute SQL queries
- `supabase_db_execute_sql` - Execute SQL commands

### GitHub Functions

- `github_push_files` - Fast batch commits (~85% faster than git)
- `github_update_file` - Update repository files
- `github_create_issue` - Create GitHub issues
- `github_get_file` - Get file contents
- `github_list_files` - List repository files
- `github_search_code` - Search codebase
- `github_list_commits` - List commits
- `github_get_commit` - Get commit details

## Setup Instructions

### 1. Environment Variables

Set the following environment variables:

```bash
SUPABASE_ACCESS_TOKEN=your_supabase_token
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
```

### 2. Start MCP Servers

Run the startup script:

```powershell
powershell -ExecutionPolicy Bypass -File start-mcp.ps1
```

### 3. Verify Installation

Test both servers:

```bash
npx -y @supabase/mcp-server-supabase@0.4.5 --version
npx -y @modelcontextprotocol/server-github --help
```

## Usage Examples

### Database Operations

```
"Show me all tables in the database"
"Add a new supplier to the suppliers table"
"Check cycle count alerts"
"Deploy this migration"
```

### Repository Operations

```
"Commit these changes with message 'feat: Add new feature'"
"Search for function 'calculateWAC' in codebase"
"Create branch for feature 'inventory-alerts'"
"Push files to main branch"
```

## Benefits

### Supabase MCP

- Real-time database inspection
- Direct schema modifications
- Query performance analysis
- Security advisor checks

### GitHub MCP

- ~85% faster commits than traditional git
- Single API call for batch operations
- Direct push to main branch
- Atomic commits with multiple files

## Troubleshooting

### Common Issues

1. **Terminal hangs**: Kill hanging git processes with `taskkill /F /PID <pid>`
2. **Pager issues**: Set `git config --global core.pager cat`
3. **Git hooks**: Disable with `git config core.hooksPath /dev/null`

### MCP Server Issues

1. **Authentication errors**: Check environment variables
2. **Connection issues**: Verify network connectivity
3. **Version conflicts**: Update to latest MCP server versions

## Security Notes

- Never commit hardcoded tokens to version control
- Use environment variables for sensitive data
- Regularly rotate access tokens
- Monitor MCP server logs for security issues
