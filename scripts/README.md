# 🚀 KIRO-BEETECH Development Scripts

## 📋 **Script Overview**

This directory contains essential development scripts for the KIRO-BEETECH inventory management system.

## 🎯 **Core Scripts**

### **1. `deploy.js` - Production Deployment**
**Purpose**: Deploy to Vercel with proper error handling
**Usage**:
```bash
# Deploy preview
npm run deploy

# Deploy production
npm run deploy:prod
```

**Features**:
- ✅ Type checking before deployment
- ✅ Linting before deployment
- ✅ Build verification
- ✅ Error handling and rollback
- ✅ Production vs preview deployment

## 🛠️ **Standard Development Commands**

### **Modern Development Workflow**
```bash
# Development
pnpm dev          # Start development server with Turbo
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Code linting
pnpm type-check   # TypeScript checking
```

### **Modern Deployment (Vercel CLI)**
```bash
# Preview deployment
pnpm run deploy:preview

# Production deployment  
pnpm run deploy
```

**What Vercel CLI Provides:**
- ✅ Automatic type checking and linting
- ✅ Automatic builds and optimizations
- ✅ Preview deployments for testing
- ✅ Production deployments
- ✅ Environment variable management
- ✅ Domain and SSL management
- ✅ Analytics and monitoring
- ✅ Automatic rollbacks on failure

## 🎯 **Why This is Better**

1. **🚀 Simpler** - No custom scripts needed
2. **⚡ Faster** - Vercel CLI is optimized for speed
3. **🛡️ Reliable** - Built-in error handling and rollbacks
4. **📊 Better** - Built-in analytics and monitoring
5. **🔧 Maintained** - Vercel team maintains the CLI

## 📝 **Notes**

- The old custom `deploy.js` script has been replaced with Vercel CLI
- All deployment features are now handled automatically by Vercel
- No need for custom error handling or build verification
