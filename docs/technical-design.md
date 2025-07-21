---
title: 'Technical Design'
description: 'Architecture decisions, patterns, and technical specifications for internal inventory management'
purpose: 'Reference for development decisions and system architecture'
last_updated: 'January 20, 2025'
doc_type: 'technical-specification'
related:
  [
    'data-model.md',
    'api-documentation.md',
    'development-guide.md',
    'requirements.md',
    'ui-blueprint.md',
  ]
---

# Technical Design

Comprehensive technical design documentation for the internal KIRO inventory management system, focusing on simplified COGS tracking, smart cost allocation, and multi-mode inventory management.

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
│   │   ├── purchases-enhanced.ts # Smart allocation features
│   │   ├── inventory-deductions.ts # Deduction operations
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

## 🧮 **Smart Cost Allocation Architecture**

### **Allocation Engine Design**

```
Purchase Entry → Base Cost Calculation → Overhead Distribution → WAC Update
      │                    │                       │              │
      │                    │                       │              └── Inventory Valuation
      │                    │                       └── Proportional Allocation
      │                    └── Line Item Base Costs
      └── Mixed Invoice Handling
```

### **Core Allocation Functions**

#### **Smart Allocation RPC**

```sql
-- Core allocation logic (in database)
CREATE OR REPLACE FUNCTION calculate_smart_allocation(
  p_purchase_id UUID,
  p_total_shipping DECIMAL DEFAULT 0,
  p_total_tax DECIMAL DEFAULT 0,
  p_total_fees DECIMAL DEFAULT 0
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_line_item RECORD;
  v_total_base_cost DECIMAL := 0;
  v_allocation_result JSON[];
BEGIN
  -- Calculate total base cost for inventory items only
  SELECT COALESCE(SUM(quantity * unit_cost), 0)
  INTO v_total_base_cost
  FROM purchase_line_items pli
  JOIN items i ON pli.item_id = i.item_id
  WHERE pli.purchase_id = p_purchase_id
    AND i.type != 'non-inventory';

  -- Calculate proportional allocation for each line item
  FOR v_line_item IN
    SELECT pli.*, i.type, i.sku
    FROM purchase_line_items pli
    JOIN items i ON pli.item_id = i.item_id
    WHERE pli.purchase_id = p_purchase_id
  LOOP
    -- Process allocation logic...
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

#### **TypeScript Interface**

```typescript
// Smart allocation service
export interface AllocationPreview {
  lineItemId: string;
  itemSku: string;
  baseCost: number;
  allocatedShipping: number;
  allocatedTax: number;
  allocatedFees: number;
  totalCost: number;
  allocationPercentage: number;
}

export interface AllocationResult {
  preview: AllocationPreview[];
  totalAllocated: {
    shipping: number;
    tax: number;
    fees: number;
  };
  variance: {
    shipping: number;
    tax: number;
    fees: number;
  };
  warnings: string[];
}

// Smart allocation action
export async function previewAllocation(
  purchaseId: string,
  overheadCosts: {
    shipping?: number;
    tax?: number;
    fees?: number;
  }
): Promise<AppResult<AllocationResult>> {
  try {
    const { data, error } = await supabase.rpc('calculate_smart_allocation', {
      p_purchase_id: purchaseId,
      p_total_shipping: overheadCosts.shipping || 0,
      p_total_tax: overheadCosts.tax || 0,
      p_total_fees: overheadCosts.fees || 0,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return handleError(error, 'previewAllocation');
  }
}
```

### **Variance Detection System**

```typescript
// Allocation variance checking
interface VarianceCheck {
  type: 'shipping' | 'tax' | 'fees';
  expected: number;
  allocated: number;
  variance: number;
  percentageVariance: number;
  warningLevel: 'info' | 'warning' | 'error';
}

export function calculateVariance(
  expected: number,
  allocated: number,
  tolerance = 0.05 // 5% tolerance
): VarianceCheck {
  const variance = Math.abs(expected - allocated);
  const percentageVariance = expected > 0 ? variance / expected : 0;

  let warningLevel: 'info' | 'warning' | 'error' = 'info';
  if (percentageVariance > tolerance * 2) warningLevel = 'error';
  else if (percentageVariance > tolerance) warningLevel = 'warning';

  return {
    expected,
    allocated,
    variance,
    percentageVariance,
    warningLevel,
  };
}
```

## 📊 **Multi-Mode Tracking Architecture**

### **Tracking Mode Design**

```
Item Setup → Mode Selection → Alert Configuration → Operational Workflow
     │            │               │                      │
     │            │               │                      └── Mode-Specific UI
     │            │               └── Alert Thresholds
     │            └── Full/Cost-Only/Estimate
     └── Business Categorization
```

### **Mode-Specific Database Schema**

```sql
-- Extended items table for tracking modes
ALTER TABLE items ADD COLUMN tracking_mode tracking_mode_enum DEFAULT 'full';
ALTER TABLE items ADD COLUMN last_counted_date TIMESTAMP;
ALTER TABLE items ADD COLUMN count_frequency_days INTEGER DEFAULT 30;
ALTER TABLE items ADD COLUMN fixed_cost_estimate DECIMAL(10,2);

-- Tracking mode enumeration
CREATE TYPE tracking_mode_enum AS ENUM ('full', 'cost_only', 'estimate');

-- Mixed tracking alerts function
CREATE OR REPLACE FUNCTION get_mixed_tracking_alerts()
RETURNS TABLE(
  item_id UUID,
  sku TEXT,
  name TEXT,
  tracking_mode tracking_mode_enum,
  alert_type TEXT,
  alert_priority INTEGER,
  days_since_count INTEGER,
  suggested_action TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.item_id,
    i.sku,
    i.name,
    i.tracking_mode,
    CASE
      WHEN i.tracking_mode = 'full' AND i.current_quantity <= COALESCE(i.reorder_point, 0)
        THEN 'low_stock'
      WHEN i.tracking_mode = 'cost_only' AND (CURRENT_DATE - COALESCE(i.last_counted_date, i.created_at::date)) > i.count_frequency_days
        THEN 'count_due'
      WHEN i.tracking_mode = 'estimate' AND (CURRENT_DATE - COALESCE(i.last_counted_date, i.created_at::date)) > 90
        THEN 'cost_review'
      ELSE 'none'
    END as alert_type,
    -- Priority logic for mixed alerts...
  FROM items i
  WHERE i.is_archived = false;
END;
$$ LANGUAGE plpgsql;
```

### **Mode-Aware UI Components**

```typescript
// Tracking mode component
interface TrackingModeIndicatorProps {
  mode: 'full' | 'cost_only' | 'estimate';
  alertType?: string;
  className?: string;
}

export function TrackingModeIndicator({
  mode,
  alertType,
  className
}: TrackingModeIndicatorProps) {
  const modeConfig = {
    full: {
      label: 'Full',
      color: 'green',
      icon: '🟢'
    },
    cost_only: {
      label: 'Cost-Only',
      color: 'yellow',
      icon: '🟡'
    },
    estimate: {
      label: 'Estimate',
      color: 'orange',
      icon: '🟠'
    },
  };

  const config = modeConfig[mode];

  return (
    <Badge
      variant={alertType ? 'destructive' : 'secondary'}
      className={cn('text-xs', className)}
    >
      {config.icon} {config.label}
      {alertType && ` - ${alertType}`}
    </Badge>
  );
}

// Mode-specific action buttons
export function ModeSpecificActions({ item }: { item: Item }) {
  switch (item.tracking_mode) {
    case 'full':
      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => adjustQuantity(item.id, -1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-3 py-1 bg-muted rounded">
            {item.current_quantity}
          </span>
          <Button size="sm" onClick={() => adjustQuantity(item.id, 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );

    case 'cost_only':
      return (
        <Button size="sm" onClick={() => recordCount(item.id)}>
          <Clock className="h-4 w-4 mr-2" />
          Count Now
        </Button>
      );

    case 'estimate':
      return (
        <Button size="sm" onClick={() => reviewCost(item.id)}>
          <DollarSign className="h-4 w-4 mr-2" />
          Review Cost
        </Button>
      );
  }
}
```

## 💱 **Enhanced WAC Calculation**

### **Fixed WAC Architecture**

```sql
-- Corrected WAC calculation function
CREATE OR REPLACE FUNCTION calculate_weighted_average_cost(
  p_item_id UUID,
  p_new_quantity DECIMAL,
  p_new_unit_cost DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  v_current_quantity DECIMAL;
  v_current_wac DECIMAL;
  v_new_wac DECIMAL;
BEGIN
  -- Get current inventory state
  SELECT current_quantity, weighted_average_cost
  INTO v_current_quantity, v_current_wac
  FROM items
  WHERE item_id = p_item_id;

  -- Handle initial inventory or zero inventory scenarios
  IF v_current_quantity IS NULL OR v_current_quantity <= 0 THEN
    RETURN p_new_unit_cost;
  END IF;

  -- Calculate new WAC using proper formula:
  -- New WAC = (Current Value + New Value) / (Current Qty + New Qty)
  v_new_wac := (
    (v_current_quantity * v_current_wac) +
    (p_new_quantity * p_new_unit_cost)
  ) / (v_current_quantity + p_new_quantity);

  RETURN ROUND(v_new_wac, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### **WAC Integration with Purchases**

```typescript
// Enhanced purchase finalization with WAC
export async function finalizePurchaseWithWAC(
  purchaseId: string,
  allocationData: AllocationResult
): Promise<AppResult<void>> {
  try {
    // Start transaction
    const { error } = await supabase.rpc(
      'finalize_purchase_with_smart_allocation',
      {
        p_purchase_id: purchaseId,
        p_allocation_data: JSON.stringify(allocationData),
      }
    );

    if (error) throw error;

    // Revalidate affected queries
    revalidatePath('/purchases');
    revalidatePath('/items');

    return { success: true, data: undefined };
  } catch (error) {
    return handleError(error, 'finalizePurchaseWithWAC');
  }
}
```

## 🔄 **Statement-Based Workflow Integration**

### **Bank Statement Import Architecture**

```
Bank CSV → Supplier Matching → Auto-Draft Creation → Review & Allocation → Finalization
    │            │                    │                    │                │
    │            │                    │                    │                └── WAC Update
    │            │                    │                    └── Smart Allocation
    │            │                    └── Line Item Generation
    │            └── Confidence Scoring
    └── Format Detection
```

### **Automated Supplier Matching**

```sql
-- Intelligent supplier matching function
CREATE OR REPLACE FUNCTION match_supplier_from_statement(
  p_description TEXT,
  p_amount DECIMAL
) RETURNS TABLE(
  supplier_id UUID,
  confidence_score DECIMAL,
  match_reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH supplier_matches AS (
    SELECT
      s.supplier_id,
      s.name,
      s.website,
      -- Exact name match (highest confidence)
      CASE WHEN LOWER(p_description) LIKE '%' || LOWER(s.name) || '%'
           THEN 0.9 ELSE 0 END +
      -- Website domain match
      CASE WHEN s.website IS NOT NULL AND LOWER(p_description) LIKE '%' || LOWER(SPLIT_PART(s.website, '.', 1)) || '%'
           THEN 0.7 ELSE 0 END +
      -- Previous transaction amount match
      CASE WHEN EXISTS(
        SELECT 1 FROM purchases p2
        WHERE p2.supplier_id = s.supplier_id
          AND ABS(p2.total_amount - p_amount) < 1.00
          AND p2.purchase_date > CURRENT_DATE - INTERVAL '90 days'
      ) THEN 0.5 ELSE 0 END as confidence,

      -- Match reason explanation
      CASE
        WHEN LOWER(p_description) LIKE '%' || LOWER(s.name) || '%' THEN 'Name match'
        WHEN s.website IS NOT NULL AND LOWER(p_description) LIKE '%' || LOWER(SPLIT_PART(s.website, '.', 1)) || '%' THEN 'Website match'
        ELSE 'Amount history match'
      END as reason

    FROM suppliers s
    WHERE s.is_archived = false
  )
  SELECT
    sm.supplier_id,
    sm.confidence,
    sm.reason
  FROM supplier_matches sm
  WHERE sm.confidence > 0.3
  ORDER BY sm.confidence DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;
```

### **Monthly Reconciliation Workflow**

```typescript
// Monthly inventory session support
export interface MonthlySession {
  sessionId: string;
  month: string;
  year: number;
  status: 'planning' | 'in_progress' | 'completed';
  trackingModeBreakdown: {
    full: { itemCount: number; completedCount: number };
    cost_only: { itemCount: number; completedCount: number };
    estimate: { itemCount: number; completedCount: number };
  };
  cogsSummary: {
    totalCogs: number;
    cogsPercentage: number;
    previousMonthComparison: number;
  };
}

export async function startMonthlySession(
  month: number,
  year: number
): Promise<AppResult<MonthlySession>> {
  try {
    const { data, error } = await supabase.rpc('start_monthly_session', {
      p_month: month,
      p_year: year,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return handleError(error, 'startMonthlySession');
  }
}
```

## 🎨 **Enhanced UI Architecture**

### **Allocation Preview Component**

```typescript
// Real-time allocation preview
interface AllocationPreviewProps {
  purchaseId: string;
  overheadCosts: {
    shipping?: number;
    tax?: number;
    fees?: number;
  };
  onApprove: (allocation: AllocationResult) => void;
  onReject: () => void;
}

export function AllocationPreview({
  purchaseId,
  overheadCosts,
  onApprove,
  onReject
}: AllocationPreviewProps) {
  const { data: preview, isLoading } = useQuery({
    queryKey: ['allocation-preview', purchaseId, overheadCosts],
    queryFn: () => previewAllocation(purchaseId, overheadCosts),
    enabled: !!(purchaseId && Object.keys(overheadCosts).length > 0),
  });

  if (isLoading) return <AllocationSkeleton />;
  if (!preview?.success) return <AllocationError error={preview?.error} />;

  const { data: allocation } = preview;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cost Allocation Preview
          <VarianceIndicator variances={allocation.variance} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AllocationTable preview={allocation.preview} />
        <AllocationSummary
          totalAllocated={allocation.totalAllocated}
          variance={allocation.variance}
          warnings={allocation.warnings}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReject}>
          Modify Purchase
        </Button>
        <Button onClick={() => onApprove(allocation)}>
          Approve & Save
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### **Tracking Mode Dashboard**

```typescript
// Mixed tracking mode dashboard
export function TrackingModeDashboard() {
  const { data: alerts } = useQuery({
    queryKey: ['mixed-tracking-alerts'],
    queryFn: () => getMixedTrackingAlerts(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  const groupedAlerts = useMemo(() => {
    if (!alerts?.success) return {};

    return alerts.data.reduce((acc, alert) => {
      const mode = alert.tracking_mode;
      if (!acc[mode]) acc[mode] = [];
      acc[mode].push(alert);
      return acc;
    }, {} as Record<string, Alert[]>);
  }, [alerts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TrackingModeCard
        mode="full"
        alerts={groupedAlerts.full || []}
        title="Full Tracking"
        description="Exact quantity management"
      />
      <TrackingModeCard
        mode="cost_only"
        alerts={groupedAlerts.cost_only || []}
        title="Cost-Only Tracking"
        description="Time-based inventory checks"
      />
      <TrackingModeCard
        mode="estimate"
        alerts={groupedAlerts.estimate || []}
        title="Estimate Tracking"
        description="Fixed cost items"
      />
    </div>
  );
}
```

## 🔧 **Performance Optimizations**

### **Database Optimizations for New Features**

#### **Smart Allocation Indexes**

```sql
-- Optimized indexes for allocation queries
CREATE INDEX idx_purchase_line_items_purchase_allocation
ON purchase_line_items(purchase_id, item_id)
INCLUDE (quantity, unit_cost);

CREATE INDEX idx_items_type_archived
ON items(type, is_archived)
WHERE is_archived = false;

CREATE INDEX idx_items_tracking_mode_alerts
ON items(tracking_mode, last_counted_date, count_frequency_days)
WHERE is_archived = false;
```

#### **WAC Calculation Optimization**

```sql
-- Materialized view for WAC performance
CREATE MATERIALIZED VIEW item_wac_cache AS
SELECT
  item_id,
  current_quantity,
  weighted_average_cost,
  last_updated
FROM items
WHERE is_archived = false AND tracking_mode IN ('full', 'cost_only');

-- Refresh trigger for cache
CREATE OR REPLACE FUNCTION refresh_wac_cache()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY item_wac_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### **Frontend Performance Enhancements**

#### **Optimistic Updates for Allocations**

```typescript
// Optimistic allocation updates
export function useOptimisticAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allocation: AllocationResult) => applyAllocation(allocation),

    onMutate: async allocation => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['purchases'] });

      // Snapshot previous value
      const previousPurchases = queryClient.getQueryData(['purchases']);

      // Optimistically update
      queryClient.setQueryData(['purchases'], (old: any) =>
        updatePurchaseWithAllocation(old, allocation)
      );

      return { previousPurchases };
    },

    onError: (err, allocation, context) => {
      // Revert on error
      queryClient.setQueryData(['purchases'], context?.previousPurchases);
    },

    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
}
```

## 🛡️ **Enhanced Security Architecture**

### **Allocation Security Policies**

```sql
-- Secure allocation operations
CREATE POLICY "Users can preview their own allocations" ON purchase_line_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM purchases p
    WHERE p.purchase_id = purchase_line_items.purchase_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can finalize their own purchases" ON purchases
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### **Input Validation for Enhanced Features**

```typescript
// Enhanced validation schemas
const AllocationSchema = z.object({
  purchaseId: z.string().uuid(),
  overheadCosts: z.object({
    shipping: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    fees: z.number().min(0).optional(),
  }),
  variance_tolerance: z.number().min(0).max(1).default(0.05),
});

const TrackingModeSchema = z.object({
  itemId: z.string().uuid(),
  mode: z.enum(['full', 'cost_only', 'estimate']),
  countFrequencyDays: z.number().min(1).max(365).optional(),
  fixedCostEstimate: z.number().min(0).optional(),
});
```

## 📱 **Mobile-Optimized Architecture**

### **Touch-Friendly Allocation Interface**

```typescript
// Mobile allocation approval
export function MobileAllocationApproval({
  allocation,
  onApprove,
  onReject
}: MobileAllocationApprovalProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-background border-t p-4 safe-area-pb">
      <div className="flex flex-col gap-3">
        <AllocationSummaryMobile allocation={allocation} />
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onReject}
          >
            Modify
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={onApprove}
          >
            Approve ${allocation.totalAllocated.total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### **Gesture-Based Mode Switching**

```typescript
// Swipe gestures for tracking mode switching
export function useTrackingModeGestures(itemId: string) {
  const [mode, setMode] = useState<TrackingMode>('full');

  const handlers = useSwipeable({
    onSwipedLeft: () => nextMode(),
    onSwipedRight: () => previousMode(),
    trackMouse: true,
  });

  const nextMode = () => {
    const modes: TrackingMode[] = ['full', 'cost_only', 'estimate'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return { mode, handlers };
}
```

---

_This technical design reflects the simplified, business-focused approach prioritizing meaningful COGS tracking over perfectionist inventory management. For implementation details, see [development-guide.md](./development-guide.md). For database schema, see [data-model.md](./data-model.md)._
