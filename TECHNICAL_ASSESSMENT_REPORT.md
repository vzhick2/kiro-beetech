## System Overview

BTINV is an internal inventory management system for small manufacturing businesses (2-5 person operations) that prioritizes Cost of Goods Sold (COGS) tracking over traditional inventory management approaches. The system implements three core innovations:

1. **Multi-Modal Tracking**: Three different tracking modes based on business impact
2. **Smart Cycle Counts**: Weekly recommendations with intelligent prioritization 
3. **Statement-Based Workflows**: Monthly data entry aligned with bookkeeping cycles

---

## Business Problem and Solution

### Traditional System Limitations
Small manufacturing businesses require accurate COGS tracking but struggle with traditional inventory systems that:
- Require real-time data entry during production
- Treat all items uniformly regardless of cost impact
- Force full inventory counts causing business disruption
- Don't accommodate monthly statement-based bookkeeping
- Assume perfect data accuracy without correction mechanisms

### BTINV's Pragmatic Approach

### BTINV's Pragmatic Approach

**Intelligent Item Classification System**:
- **Tracked**: Full quantity and cost tracking for critical ingredients requiring exact inventory management
- **Costed**: Cost tracking per unit for packaging materials that affect COGS but don't require quantity management
- **Consumable**: Purchase tracking for overhead calculation of supplies that don't directly impact product costs

**User-Friendly Setup Process**:
The system eliminates technical complexity through a simple two-question workflow during item creation:

1. **"Do you need to track the exact quantity of this item on your shelf?"**
   - **YES** → Item becomes **Tracked** (full inventory management)
   - **NO** → Proceeds to question 2

2. **"Is this item part of the final, packaged product?"**
   - **YES** → Item becomes **Costed** (COGS tracking without quantities)
   - **NO** → Item becomes **Consumable** (overhead tracking only)

This approach captures user intent directly without requiring technical knowledge of tracking modes.

**Smart Cycle Count Innovation**:
- Weekly recommendations of 5-15 items based on priority scoring algorithm
- Prevents error accumulation through regular corrections
- Learns from variance patterns to improve future recommendations
- Integrates seamlessly with production schedules

**Statement-Based Data Entry**:
- Monthly entry sessions during bookkeeping cycles using bank statements
- Mixed purchase processing automatically separates COGS from business expenses
- Draft-to-final workflow prevents accidental data commits
- Back-dating support for delayed entry

---

## Core System Workflows

### 1. Purchase Entry and Cost Allocation

**Problem**: Mixed invoices contain both inventory items (COGS) and business expenses (office supplies, services). Traditional systems require manual separation for accurate cost accounting.

**Solution Process**:
1. User enters purchase as draft during monthly bookkeeping session
2. System suggests suppliers based on bank transaction descriptions
3. COGS vs expense items are designated for each line item
4. Shipping, taxes, and fees are isolated as overhead costs
5. Overhead is distributed proportionally based on base cost ratios
6. User previews allocation results and adjusts if needed
7. Purchase finalization triggers WAC updates and transaction recording

**Cost Allocation Algorithm**:
```
1. Sum base costs of all inventory items on invoice
2. Calculate each item's percentage of total base cost  
3. Multiply overhead costs by each percentage
4. Add allocated overhead to item's base cost
5. Update WAC with new cost including overhead
```

### 2. Smart Cycle Count System

**Problem Addressed**: Real manufacturing operations have inevitable discrepancies from spillage, measurement errors, theft, damaged goods, and data entry mistakes. Without regular corrections, these small errors compound into significant COGS inaccuracies.

**Weekly Recommendation Algorithm**:
```
Priority Score = (Usage Frequency × 0.3) + (Cost Impact × 0.25) + 
                 (Historical Variance × 0.2) + (Days Since Count × 0.15) + 
                 (Tracking Mode Weight × 0.1)
```

**Cycle Count Process**:
1. **Weekly List Generation**: System provides prioritized list of 5-15 items to count
2. **Count Scheduling**: Recommendations include optimal timing based on production schedule
3. **Physical Counting**: User performs counts during production downtime
4. **Variance Recording**: System compares actual vs. recorded quantities
5. **Automatic Adjustments**: Inventory quantities updated with transaction explanations
6. **WAC Recalculation**: Cost basis adjusted for quantity changes
7. **Learning Algorithm**: Variance patterns update future recommendation priorities

**Operational Benefits**:
- Manageable workload: 5-15 items weekly instead of full inventory monthly
- Error correction: Regular adjustments prevent compounding inaccuracies
- Cost accuracy: Frequent WAC updates maintain accurate COGS data
- Production integration: Counts scheduled during natural production breaks

### 3. Intelligent Item Classification

**Tracked Mode** (Critical ingredients):
- Exact quantity tracking with decimal precision
- WAC recalculation on each purchase including allocated overhead
- Inventory levels updated in real-time
- Reorder alerts based on usage patterns
- Included in weekly cycle count recommendations with high priority
- Production usage tracked through recipe consumption

**Costed Mode** (Packaging materials):
- Purchase history maintained without quantity tracking
- Alert system for unusual purchase patterns or prices
- Cost per unit calculations based on recent purchases
- Excluded from physical counts but purchase pattern monitoring
- Recent purchase costs validated against historical patterns

**Consumable Mode** (Overhead supplies):
- Purchase tracking for overhead cost calculation
- No quantity management or inventory tracking
- Contributes to total overhead costs for accurate product costing
- No physical counting required
- Periodic review of spending patterns

**Classification Workflow**:
Items are classified through a simple two-question process that captures business intent:
1. Quantity tracking needs assessment
2. Product inclusion determination
3. Automatic mode assignment based on responses

### 4. Production and Recipe Management

**Recipe Cost Calculation**:
1. Recipe defines ingredients and quantities needed
2. System retrieves current WAC for each ingredient
3. Fixed estimates applied for Estimate Tracking items
4. Total recipe cost calculated including all components
5. Production batch records actual quantities used
6. Variance analysis compares estimated vs actual costs

**Production Workflow**:
1. Recipe selection determines ingredient requirements
2. Inventory availability checked for Full Tracking items
3. Production quantities recorded for cost allocation
4. Actual ingredient usage tracked against recipe specifications
5. Finished goods inventory updated with production costs
6. Transaction log records all inventory movements
7. Large variances between expected and actual usage flag items for priority counting

---

### Technology Stack

**Frontend Components**:
- Next.js 15.4.1 with App Router
- React 19.1.0 with Server Components  
- TypeScript 5.8.3
- Tailwind CSS 4.1.11
- TanStack Query for state management

**Backend Infrastructure**:
- Supabase for database and authentication
- PostgreSQL with stored procedures for business logic
- Row Level Security (RLS) for data protection
- Server Actions for form handling

### Database Architecture

**Core Tables**:
```
├── suppliers (6 records) - Supplier contact and payment information
├── items (37 records) - Inventory items with tracking mode designation
├── purchases - Purchase records with draft/finalized status
├── purchase_line_items - Individual item costs within purchases
├── recipes - Production formulas and ingredient lists
├── recipe_ingredients - Bill of materials with quantities
├── batches - Production run tracking and costs
├── sales_periods - Historical demand data
├── transactions - Complete audit trail of all inventory movements
└── forecasting_data - Automated reorder point calculations
```

**Key Features**:
- Complete transaction log for audit trail with correction capabilities
- Draft purchase workflow preventing accidental data commits
- Proportional cost allocation preserved in database functions
- Foreign key relationships maintaining referential integrity

**Business Logic Functions**:
- WAC (Weighted Average Cost) calculation with overhead allocation
- Cycle count alert generation with priority scoring algorithms
- Automated supplier matching for bank statement imports
- Cost distribution algorithms for mixed purchases

### Security Implementation

**Authentication**: Supabase Auth with manual user provisioning (no public registration)
**Authorization**: Admin client configuration bypasses RLS for trusted internal users
**Server Actions**: Domain restriction through Next.js configuration
**Data Protection**: RLS policies implemented for future multi-tenant scenarios

**Transaction Log Design**: The system implements a mutable transaction log rather than immutable records to accommodate real-world manufacturing operations where corrections, cycle count adjustments, and data entry fixes are necessary. This pragmatic approach allows businesses to maintain accurate records while supporting the inevitable need for corrections in small manufacturing environments.

---

## System Dependencies

### Technology Dependencies

**External Services**:
- Supabase provides database hosting and authentication services
- PostgreSQL functions contain core business logic
- Next.js framework handles routing and server-side rendering

**Risk Mitigation**:
- Database backup procedures for data protection
- Integration test coverage for cost allocation scenarios
- Version pinning for framework dependencies