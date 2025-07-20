# Supabase Setup Guide - KIRO-BEETECH

## Overview

This project is configured for **remote Supabase development** using the cloud-hosted Supabase instance.

## Current Configuration

### Remote Project

- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `kiro-beetech`
- **Region**: `us-east-2`
- **Status**: ✅ Linked and configured

## Available Scripts

### Remote Development

```bash
# Generate types from remote database
pnpm supabase:types
```

## Development Workflow

### Remote Development

1. **Start development**: `pnpm dev`
2. **Generate types**: `pnpm supabase:types` (when schema changes)
3. **Make changes** in your code
4. **Test with remote data**
5. **Deploy changes** when ready

## Environment Variables

### Remote Development

```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

## Troubleshooting

### Remote Development Issues

#### Authentication Issues

```bash
# Re-link to remote project
npx supabase link --project-ref jjpklpivpvywagmjjwpu
```

#### Schema Sync Issues

```bash
# Force pull latest schema
npx supabase db pull --force
```

## Database Schema

The current schema includes:

- **Items**: Inventory items with SKU, quantities, and metadata
- **Transactions**: Inventory movement tracking
- **Purchases**: Purchase order management
- **Batches**: Production batch tracking
- **Recipes**: Product recipe definitions
- **Suppliers**: Supplier information
- **Sales Periods**: Sales data aggregation

## Next Steps

1. **Set up environment variables** for remote development
2. **Start building features** using the available scripts
3. **Monitor database changes** through Supabase Studio

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Database Schema Reference](docs/data-model.md)
- [API Documentation](docs/api-documentation.md)