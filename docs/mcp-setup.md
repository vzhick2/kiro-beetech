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

# MCP (Model Context Protocol) Setup Guide

## Overview

This project is configured with MCP servers for enhanced AI development workflow in both **VS Code** and **Cursor IDE**:

- **Supabase MCP Server**: Database operations, schema management, real-time queries
- **GitHub MCP Server**: Repository operations, fast commits, code search

## Quick Setup

### 1. Install Required Extensions

**VS Code:**

- Install the official MCP extension from Microsoft

**Cursor:**

- MCP is built-in, no additional extensions needed

### 2. Get Access Tokens

#### Supabase Access Token

1. Go to [Supabase Dashboard → Account → Access Tokens](https://supabase.com/dashboard/account/tokens)
2. Click "Generate New Token"
3. Give it a name (e.g., "MCP Development")
4. Select "Full access" scope
5. Copy the token

#### GitHub Personal Access Token

1. Go to [GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click "Generate new token"
3. Select repository: `vzhick2/kiro-beetech`
4. Required permissions:
   - **Repository permissions**: Contents (Read/Write), Metadata (Read), Pull requests (Read/Write)
   - **Account permissions**: Git SSH keys (Read)
5. Copy the token

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your tokens:

```bash
# Copy the template
cp .env.example .env.local

# Edit with your tokens
# VS Code users: code .env.local
# Cursor users: cursor .env.local
```

Required variables:

```bash
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_personal_access_token_here
```

### 4. Test MCP Servers

#### Test Supabase MCP

```bash
npx -y @supabase/mcp-server-supabase@latest --help
```

#### Test GitHub MCP

```bash
npx -y @modelcontextprotocol/server-github@latest --help
```

## Configuration Files

### For Both VS Code and Cursor

- `mcp.json` - Root-level MCP configuration (uses environment variables)
- `.env.local` - Your personal environment variables (not committed to git)

### VS Code Specific

- `.vscode/mcp.json` - VS Code MCP configuration (prompts for tokens)

### Cursor Specific

- Cursor reads from `mcp.json` automatically
- Uses environment variables from `.env.local`

## MCP Server Details

### Supabase MCP Server (@supabase/mcp-server-supabase@latest)

**Project**: `jjpklpivpvywagmjjwpu`

**Available Functions:**

- `supabase_db_query` - Execute SELECT queries
- `supabase_db_execute` - Execute INSERT/UPDATE/DELETE commands
- `supabase_list_tables` - List all tables in database
- `supabase_describe_table` - Get table schema and constraints
- `supabase_run_sql` - Execute raw SQL commands
- `supabase_read_logs` - Read application logs
- `supabase_read_security_logs` - Read security audit logs

### GitHub MCP Server (@modelcontextprotocol/server-github@latest)

**Repository**: `vzhick2/kiro-beetech`

**Available Functions:**

- `create_or_update_file` - Create or update files in repository
- `push_files` - Batch commit multiple files (~85% faster than git)
- `get_file` - Get file contents from repository
- `list_files` - List files in repository or directory
- `search_code` - Search for code patterns across repository
- `create_issue` - Create GitHub issues
- `list_issues` - List repository issues
- `get_pull_request` - Get pull request details
- `list_commits` - List repository commits

## Usage Examples

### Database Operations

```
AI: "Show me all tables in the database"
AI: "Add a test supplier with name 'Test Supplier' to suppliers table"
AI: "Check which items have low inventory"
AI: "Show me the schema for the purchases table"
AI: "Execute this SQL: SELECT COUNT(*) FROM items WHERE quantity < 10"
```

### Repository Operations

```
AI: "Commit these changes with message 'feat: Add inventory alerts'"
AI: "Search for 'calculateWAC' function in the codebase"
AI: "Create a new file src/utils/inventory-helpers.ts with helper functions"
AI: "Show me the latest commits on main branch"
AI: "Update multiple files and commit them as a batch"
```

## Advanced Configuration

### Auto-Approval (Optional)

Add to your MCP configuration to auto-approve safe operations:

```json
{
  "autoApprove": [
    "supabase_db_query",
    "supabase_list_tables",
    "supabase_describe_table",
    "get_file",
    "list_files",
    "search_code"
  ]
}
```

### Environment Variable Precedence

1. `.env.local` (highest priority)
2. `.env.development`
3. `.env`
4. System environment variables

## Troubleshooting

### Common Issues

#### "Cannot find MCP servers"

- Verify tokens are set in `.env.local`
- Check MCP configuration files exist
- Restart your IDE after configuration changes

#### "Authentication failed"

- Verify Supabase token has correct permissions
- Verify GitHub token has repository access
- Check token expiration dates

#### "Command not found" errors

- Ensure npm/npx is available in PATH
- Try installing packages globally: `npm install -g @supabase/mcp-server-supabase@latest`

#### VS Code Specific Issues

- Install the official MCP extension
- Check VS Code settings for MCP configuration
- Use Command Palette: "MCP: Restart Servers"

#### Cursor Specific Issues

- Ensure `mcp.json` is in project root
- Check Cursor settings: Cursor Tab → Features → Enable Model Context Protocol
- Environment variables should be in `.env.local`

### Performance Tips

1. **Use GitHub MCP for commits**: ~85% faster than traditional git workflow
2. **Batch operations**: Use `push_files` for multiple file updates
3. **Database queries**: Use `supabase_db_query` for read operations, `supabase_db_execute` for writes
4. **Code search**: Use `search_code` instead of manual file browsing

## Security Best Practices

- Never commit `.env.local` to version control
- Regularly rotate access tokens (recommended: every 90 days)
- Use fine-grained GitHub tokens with minimal required permissions
- Monitor token usage in respective dashboards
- Use read-only tokens when possible for development

## Latest Versions

This setup uses the latest stable versions:

- **Supabase MCP**: `@supabase/mcp-server-supabase@latest`
- **GitHub MCP**: `@modelcontextprotocol/server-github@latest`

The configuration automatically pulls the latest versions using `@latest` tag.

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
