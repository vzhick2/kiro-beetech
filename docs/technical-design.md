---
title: 'Technical Design'
description: 'Architecture decisions, patterns, and technical specifications for internal inventory management'
purpose: 'Reference for development decisions and system architecture'
last_updated: 'July 18, 2025'
doc_type: 'technical-specification'
related: ['data-model.md', 'api-documentation.md', 'development-guide.md']
---

# Technical Design

Comprehensive technical design documentation for the internal KIRO inventory management system, including architecture decisions, patterns, and implementation specifications.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 🏗️ **System Architecture**

### **High-Level Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │    │   Supabase      │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   TanStack      │◄─────────────┘
                        │   Query         │
                        │   (Caching)     │
                        └─────────────────┘
```

### **Technology Stack**

#### **Frontend Layer**
- **Next.js 15.4.1** with App Router and Turbopack
- **React 19.1.0** with Server Components
- **TypeScript 5.8.3** for type safety
- **Tailwind CSS 4.1.11** for styling
- **Radix UI** for accessible components

#### **Backend Layer**
- **Supabase** for database and authentication
- **Server Actions** for form handling and mutations
- **PostgreSQL** for data persistence
- **Row Level Security (RLS)** for data protection

#### **Data Layer**
- **TanStack Query** for server state management
- **Zod** for runtime validation
- **Atomic database operations** for data consistency

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js 15 App Router
│   ├── actions/           # Server Actions
│   │   ├── csv-import.ts  # CSV import functionality
│   │   ├── items.ts       # Items CRUD operations
│   │   ├── purchases.ts   # Purchase management
│   │   └── seed-data.ts   # Sample data generation
│   ├── components/        # Reusable UI components
│   │   ├── import-export/ # Import/Export components
│   │   ├── items/         # Items-specific components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Base UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase/      # Supabase client setup
│   │   ├── utils/         # Business logic utilities
│   │   └── validations/   # Zod validation schemas
│   └── types/             # TypeScript type definitions
```

## 🔄 **Data Flow Patterns**

### **Server Actions Pattern**

```typescript
// Standard server action structure
'use server';

export async function actionName(formData: FormData) {
  try {
    // 1. Validate input
    const validated = Schema.parse(data);
    
    // 2. Perform business logic
    const result = await performOperation(validated);
    
    // 3. Handle success
    revalidatePath('/relevant-path');
    return createSuccessResponse(result);
  } catch (error) {
    // 4. Handle errors consistently
    return createErrorResponse('Operation failed', error);
  }
}
```

### **TanStack Query Pattern**

```typescript
// Standard query hook structure
export function useResource(filters?: Filters) {
  return useQuery({
    queryKey: ['resource', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table')
        .select('*')
        .match(filters);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 🎨 **UI Component Architecture**

### **Component Hierarchy**

```
AppLayout
├── ResponsiveSidebar
├── InteractiveHeader
│   ├── NotificationsDropdown
│   └── UserMenuDropdown
└── PageContent
    ├── Breadcrumb
    ├── SearchBar
    └── MainContent
        ├── SpreadsheetTable (Items)
        ├── CSVImportModal (Import/Export)
        └── ActionModals
```

### **Component Patterns**

#### **Spreadsheet-Style Table**
- **Purpose**: Excel-like interface for data management
- **Features**: Inline editing, bulk operations, filtering
- **Implementation**: `src/components/items/spreadsheet-table.tsx`

```typescript
interface SpreadsheetTableProps {
  searchQuery?: string;
  typeFilter?: string;
  onItemAdded?: () => void;
}

// Features:
// - Inline cell editing
// - Bulk selection and operations
// - Real-time filtering
// - Keyboard navigation
// - Mobile-responsive design
```

#### **Modal Workflow Pattern**
- **Purpose**: Multi-step processes with validation
- **Features**: Step-by-step progression, error handling
- **Implementation**: `src/components/import-export/csv-import-modal.tsx`

```typescript
type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

// Workflow:
// 1. File upload with validation
// 2. Data preview and confirmation
// 3. Processing with progress
// 4. Results and error reporting
```

## 📊 **Import/Export Architecture**

### **CSV Import System**

#### **Architecture Overview**
```
CSV File → Validation → Parsing → Preview → Processing → Database
    │           │          │         │          │           │
    │           │          │         │          │           └── Transaction Logging
    │           │          │         │          └── Inventory Updates
    │           │          │         └── User Confirmation
    │           │          └── Data Transformation
    │           └── Format Validation
    └── File Upload
```

#### **Key Components**

1. **CSV Parser** (`src/lib/utils/csv-parser.ts`)
   - QBO format validation
   - Robust CSV parsing with quoted values
   - Error reporting and recovery

2. **Import Actions** (`src/app/actions/csv-import.ts`)
   - Preview functionality
   - Atomic import processing
   - Transaction logging

3. **Import UI** (`src/components/import-export/csv-import-modal.tsx`)
   - Multi-step workflow
   - Real-time validation
   - Progress tracking

#### **Data Flow**

```typescript
// 1. File Upload and Validation
const formatValidation = validateQBOFormat(csvContent);
if (!formatValidation.isValid) {
  return createErrorResponse('Invalid format', formatValidation.errors);
}

// 2. Data Parsing
const parsingResult = parseQBOSalesCSV(csvContent);
if (!parsingResult.success) {
  return createErrorResponse('Parsing failed', parsingResult.errors);
}

// 3. Preview Generation
const itemSummary = groupSalesByItem(parsingResult.data);
return createSuccessResponse({ summary: itemSummary });

// 4. Import Processing
for (const sale of salesData) {
  await processSale(sale, options);
  await logTransaction(sale);
}
```

### **Seed Data System**

#### **Architecture**
```
Seed Button → Sample Data → Database Insertion → Success/Error Reporting
     │              │              │                    │
     │              │              │                    └── User Feedback
     │              │              └── Batch Processing
     │              └── Predefined Items
     └── User Action
```

#### **Implementation**
- **Sample Data**: 16 realistic items (ingredients + packaging)
- **Batch Processing**: Individual item insertion with error handling
- **User Feedback**: Real-time progress and results display

## 🔧 **Performance Optimizations**

### **Database Optimizations**

#### **Query Optimization**
```sql
-- Optimized items query with supplier information
SELECT 
  i.*,
  s.name as last_used_supplier,
  ps.name as primary_supplier_name
FROM items i
LEFT JOIN suppliers s ON s.supplierid = (
  SELECT supplierid FROM purchases p 
  JOIN purchase_line_items pli ON p.purchaseid = pli.purchaseid 
  WHERE pli.itemid = i.itemid 
  ORDER BY p.purchasedate DESC 
  LIMIT 1
)
LEFT JOIN suppliers ps ON ps.supplierid = i.primarysupplierid
WHERE i.isarchived = false;
```

#### **Indexing Strategy**
```sql
-- Performance indexes
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_archived ON items(is_archived);
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_date ON transactions(effective_date);
CREATE INDEX idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchases_draft ON purchases(is_draft);
```

### **Frontend Optimizations**

#### **React Optimizations**
- **Server Components**: Default for static content
- **Client Components**: Only for interactive elements
- **React Compiler**: Automatic memoization
- **Code Splitting**: Route-based and component-based

#### **Caching Strategy**
```typescript
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 2,
    },
  },
});
```

## 🛡️ **Error Handling Architecture**

### **Error Handling Patterns**

#### **Standardized Error Responses**
```typescript
interface AppError {
  success: false;
  error: string;
  code?: string;
}

interface AppSuccess<T> {
  success: true;
  data: T;
}

type AppResult<T> = AppSuccess<T> | AppError;
```

#### **Error Handling Utilities**
```typescript
// Centralized error handling
export function handleError(error: unknown, context: string): AppError {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: error.name,
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred',
  };
}
```

#### **Validation Patterns**
```typescript
// Zod validation with error handling
const ImportSchema = z.object({
  csvContent: z.string().min(1, 'CSV content is required'),
  effectiveDate: z.string().optional(),
  createMissingItems: z.boolean().default(true),
});

try {
  const validated = ImportSchema.parse(data);
  // Process validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    return createErrorResponse('Validation failed', error.errors);
  }
  throw error;
}
```

## 🔐 **Security Architecture**

### **Row Level Security (RLS)**

#### **Items Table Policies**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view their own items" ON items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" ON items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" ON items
FOR UPDATE USING (auth.uid() = user_id);
```

#### **Transaction Table Policies**
```sql
-- Secure transaction access
CREATE POLICY "Users can view their own transactions" ON transactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM items 
    WHERE items.itemid = transactions.itemid 
    AND items.user_id = auth.uid()
  )
);
```

### **Input Validation**

#### **Server-Side Validation**
- **Zod Schemas**: Runtime type checking
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Content Security Policy
- **CSRF Protection**: Next.js built-in protection

## 📱 **Responsive Design Architecture**

### **Mobile-First Approach**

#### **Breakpoint Strategy**
```css
/* Mobile-first responsive design */
.container {
  padding: 1rem; /* Mobile default */
}

@media (min-width: 768px) {
  .container {
    padding: 2rem; /* Tablet and up */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem; /* Desktop */
  }
}
```

#### **Touch-Friendly Interface**
- **Minimum Touch Targets**: 44px × 44px
- **Gesture Support**: Swipe navigation
- **Keyboard Navigation**: Full accessibility
- **Focus Management**: Clear focus indicators

### **Layout Patterns**

#### **Responsive Sidebar**
```typescript
// Adaptive sidebar behavior
const ResponsiveSidebar = ({ isOpen, onClose, isDesktop }) => {
  if (isDesktop) {
    return <DesktopSidebar />;
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left">
        <MobileSidebar />
      </SheetContent>
    </Sheet>
  );
};
```

## 🚀 **Development Workflow**

### **Code Quality Standards**

#### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  }
}
```

#### **ESLint Configuration**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error"
  }
}
```

### **Testing Strategy**

#### **Component Testing**
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Critical user journey testing

#### **Database Testing**
- **Migration Testing**: Schema change validation
- **RPC Testing**: Function behavior verification
- **Performance Testing**: Query optimization validation

## 📈 **Monitoring and Observability**

### **Error Tracking**
```typescript
// Instrumentation for error tracking
export async function onRequestError(
  error: Error,
  request: NextRequest,
  context: {
    routerKind: 'App Router' | 'Pages Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
  }
) {
  console.error('Request error:', {
    error: error.message,
    stack: error.stack,
    route: context.routePath,
    type: context.routeType,
  });
}
```

### **Performance Monitoring**
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Database Performance**: Query execution time monitoring
- **User Experience**: Interaction time tracking

## 🔄 **Deployment Architecture**

### **Environment Configuration**
```env
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### **Build Optimization**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

_For detailed API specifications, see [api-documentation.md](./api-documentation.md). For database schema, see [data-model.md](./data-model.md)._
