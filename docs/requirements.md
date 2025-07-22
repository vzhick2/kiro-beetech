---
title: 'Requirements'
description: 'Functional and non-functional requirements for internal inventory management system'
purpose: 'Reference for feature specifications and business requirements'
last_updated: 'July 21, 2025'
do#### **Data Entry Rules**

#### **Workflow Support**

- **Statement-Based Entry**: Support monthly batch entry from financial statements
- **Back-Dating**: All transactions support historical effective dates
- **Corrections**: All records editable with audit trail
- **Partial Data**: Support incomplete data entry with warnings
- **Mixed Purchases**: Handle COGS and non-COGS items on same invoicerequirements-specification'
related: ['data-model.md', 'technical-design.md', 'ui-blueprint.md']
---

# Requirements

Comprehensive requirements specification for the internal BTINV inventory management system, including functional requirements, non-functional requirements, and business rules.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 🎯 **Business Requirements**

### **Core Business Objectives**

1. **COGS Tracking**: Focus on cost tracking for ingredients and core materials that impact product margins
2. **Purchase Workflows**: Support statement-based bookkeeping with monthly inventory detail batching
3. **Cost Allocation**: Automatically distribute shipping, taxes, and fees proportionally to inventory items
4. **Multi-Modal Tracking**: Support full tracking for core ingredients, cost-only tracking for packaging, and estimation for consumables
5. **Business Operations**: Accommodate real-world workflows with flexible data entry and flexible timing

### **Target Users**

- **Primary**: Small business owners (2-10 person operations)
- **Secondary**: Production staff for batch logging and cycle counts
- **Workflow**: Statement-based bookkeeping with monthly inventory sessions

### **Business Context**

- **Scale**: Small businesses with mixed COGS/non-COGS purchases
- **Industry**: Manufacturing, food production, cosmetics, craft businesses
- **Bookkeeping**: Statement-based entry, not real-time purchase logging
- **Focus**: 80/20 rule - capture 80% of COGS value with 20% of data entry effort

## 📋 **Functional Requirements**

### **1. Flexible Inventory Tracking**

#### **1.1 Two-Mode Item Management**

- **Fully Tracked Mode**: Exact quantities with traditional low-stock alerts (core ingredients)
- **Cost-Added Mode**: Purchase history alerts, quantities hidden in UI (packaging materials)
- **Mode Assignment**: Business decision based on cost impact and tracking effort
- **Mode Switching**: Change tracking modes with data preservation (no snapshots needed)
- **UI Quantity Hiding**: Cost-only items show "Cost only" instead of quantity values

#### **1.2 Items Interface**

- **Mixed Tracking Display**: Show different alert types based on tracking mode
- **Time-Based Alerts**: "Check supply" alerts for cost-only items based on purchase history
- **Quantity vs Cost Focus**: Emphasize relevant metrics per tracking mode
- **Mobile-responsive design with 44px touch targets**
- **Keyboard navigation support**

### **2. Smart Purchase Management**

#### **2.1 Proportional Cost Allocation**

- **Allocation Algorithm**: Distribute shipping/taxes proportional to item base costs
- **Cost Breakdown Tracking**: Separate base cost from allocated overhead
- **Non-Inventory Support**: Handle office supplies and equipment purchases
- **Mixed Invoice Handling**: Support COGS and non-COGS items on same purchase
- **Variance Validation**: Prevent finalization if calculated total differs significantly from actual

#### **2.2 Statement-Based Workflow**

- **Monthly Batch Entry**: Support for entering multiple purchases from statements
- **COGS vs Non-COGS Split**: Clear separation of inventory-affecting purchases
- **Purchase Variance Checking**: Validate totals before finalizing
- **Flexible Entry Timing**: Support for back-dating and delayed entry
- **Draft Purchase System**: Create and modify purchases before finalizing

#### **2.3 Purchase Workflow**

- **Preview Allocation**: See cost distribution before finalizing
- **Base Cost Entry**: Enter actual item costs before overhead allocation
- **Automatic WAC Updates**: Update weighted average costs with allocated totals
- **Error Prevention**: Comprehensive validation and variance checking
- **Audit Trail**: Complete tracking of cost allocation decisions

### **3. Business Logic**

#### **3.1 Alert System**

- **Single Source of Truth**: Unified cycle count alert calculation
- **Mixed Tracking Alerts**: Different alert types for different tracking modes
- **Priority Scoring**: Standardized algorithm for alert prioritization
- **Time-Based Alerts**: Purchase history alerts for cost-only items
- **Configurable Thresholds**: Adjustable alert sensitivity

#### **3.2 WAC Calculation**

- **Inventory-Aware WAC**: Weighted average cost calculation
- **Allocation Integration**: Include allocated overhead in WAC calculation
- **Atomic Updates**: Consistent inventory and cost updates
- **Purchase Integration**: Automatic WAC recalculation on purchase finalization
- **Cost Breakdown Preservation**: Maintain base cost vs overhead distinction

#### **3.3 Inventory Operations**

- **Sales Deduction**: Inventory deduction for sales transactions
- **Recipe Consumption**: Ingredient deduction for batch production
- **Inventory Adjustments**: Manual adjustments with reason tracking
- **Waste Tracking**: Record and track material waste
- **Transaction Logging**: Complete audit trail for all inventory changes

### **4. Data Entry**

#### **4.1 Bookkeeping Integration**

- **Statement-Based Entry**: Design for monthly inventory sessions
- **COGS Identification**: Flagging of inventory-affecting purchases
- **Batch Processing**: Entry of multiple purchases
- **Mixed Purchase Handling**: Workflows for COGS/non-COGS splits
- **Receipt Reconciliation**: Match inventory details to bookkeeping entries

#### **4.2 Import/Export**

- **QBO Sales CSV Import**: Current CSV import functionality
- **Purchase CSV Templates**: Templates for batch entry
- **Bookkeeping Export**: Export for tax and accounting purposes
- **COGS Reporting**: Reports for cost analysis
- **Cost Allocation Reports**: Breakdown of base costs vs overhead

### **5. Recipe and Production**

#### **5.1 Recipe Management**

- **Mixed Tracking Support**: Recipes using items with different tracking modes
- **Cost Estimation**: Include estimated costs for consumable items
- **Cost Tracking**: Use allocated costs for product costing
- **Recipe Scaling**: Proportional scaling with cost updates
- **Version Control**: Track recipe changes over time

#### **5.2 Production Workflows**

- **Selective Deduction**: Only deduct inventory for full-tracking items
- **Cost Allocation**: Apply estimated costs for cost-only items
- **Yield Analysis**: Compare expected vs actual yields
- **Labor Integration**: Include labor costs in production tracking
- **Batch Templates**: Reusable production configurations

## 🔧 **Non-Functional Requirements**

### **Performance Requirements**

#### **Response Time**

- **Page Load**: < 3 seconds for initial page load
- **Search Results**: < 1 second for filtered results
- **Data Updates**: < 500ms for inline edits
- **Allocation Preview**: < 2 seconds for cost allocation calculations

#### **Scalability**

- **Items**: Handle 1,000+ items with mixed tracking modes
- **Purchases**: Process 100+ purchases per month efficiently
- **Transactions**: Support 10,000+ historical transactions
- **File Upload**: Support CSV files up to 10MB

### **Usability Requirements**

#### **Workflow Efficiency**

- **Monthly Sessions**: Complete inventory entry in 1-2 hours monthly
- **Tracking Mode Clarity**: Indicators for different tracking modes
- **Cost Allocation Preview**: Understand allocation before committing
- **Error Prevention**: Prevent common entry mistakes
- **Mobile Compatibility**: Essential functions work on mobile

### **Business Logic Requirements**

#### **Cost Allocation Rules**

- **Proportional Distribution**: Overhead allocated by base cost ratios
- **COGS Focus**: Only inventory items receive overhead allocation
- **Variance Tolerance**: Accept variances under $0.50
- **Base Cost Preservation**: Maintain separation of base vs allocated costs
- **Audit Trail**: Track all allocation decisions

#### **Tracking Mode Rules**

- **Fully Tracked**: Traditional quantity tracking with low-stock alerts
- **Cost Added**: Time-based supply check alerts, quantities hidden in UI
- **Mode Flexibility**: Allow mode changes with data preservation
- **Smart Suggestions**: Recommend modes based on item characteristics

## 📊 **Business Rules**

### **Purchase Management Rules**

#### **Cost Allocation Logic**

- **Inventory Items Only**: Shipping/taxes allocated only to COGS items
- **Proportional Distribution**: Based on base cost ratios
- **Non-Inventory Handling**: Office supplies and equipment excluded from allocation
- **Variance Checking**: Calculated total must match actual within tolerance
- **Base Cost Tracking**: Maintain original item costs separate from allocation

#### **Purchase Workflow Rules**

- **Draft System**: All purchases start as drafts until finalized
- **Allocation Preview**: Show allocation before finalization
- **Variance Resolution**: Require manual adjustment if variance exceeds threshold
- **WAC Integration**: Finalization automatically updates item costs
- **Audit Requirements**: Complete tracking of all cost allocation decisions

### **Inventory Tracking Rules**

#### **Tracking Mode Guidelines**

- **Fully Tracked Criteria**: Core ingredients, expensive items (>$5), high-impact materials
- **Cost Added Criteria**: Packaging materials, consumables, items where exact quantities don't matter
- **Mode Assignment**: Business decision based on cost impact and tracking effort
- **Mode Changes**: Allowed with data preservation - quantities reappear when switching back to fully tracked
- **UI Display**: Cost-added items show costs but hide quantity values and stock alerts

#### **Alert System Rules**

- **Fully Tracked Alerts**: Traditional low-stock based on quantity and reorder points
- **Cost Added Alerts**: Time-based, trigger when no purchase for 45+ days
- **Priority Scoring**: Higher priority for negative inventory and overdue items
- **Alert Consolidation**: Single standardized alert system for both modes
- **Cost-Added Alerts**: Time-based, trigger when no purchase for 45+ days
- **Priority Scoring**: Higher priority for negative inventory and overdue items
- **Alert Consolidation**: Single standardized alert system for both modes

### **Data Entry Rules**

#### **Flexible Workflow Support**

- **Statement-Based Entry**: Support monthly batch entry from financial statements
- **Back-Dating**: All transactions support historical effective dates
- **Corrections**: All records editable with audit trail
- **Partial Data**: Support incomplete data entry with warnings
- **Mixed Purchases**: Handle COGS and non-COGS items on same invoice

#### **Validation Rules**

- **Required Fields**: Minimal required data, focus on information
- **Cost Validation**: Cost ranges with warnings for outliers
- **Allocation Validation**: Prevent finalization with significant variances
- **Business Logic**: Validate tracking mode assignments and changes
- **Cross-Reference**: Ensure supplier and item relationships are valid

## 🎨 **User Experience Requirements**

### **Workflow Design**

#### **Monthly Inventory Session**

- **Entry**: Complete month's inventory in 1-2 hour session
- **Statement Integration**: Design around existing bookkeeping workflow
- **Batch Operations**: Process multiple purchases
- **Separation**: Distinction between COGS and non-COGS items
- **Progress Tracking**: Show completion status during batch entry

#### **Tracking Mode Clarity**

- **Visual Indicators**: Badges or icons for tracking modes
- **Contextual Actions**: Different actions based on tracking mode
- **Mode Explanations**: Help text explaining each tracking mode
- **Change Workflows**: Process for changing tracking modes
- **Mixed Displays**: Handle mixed tracking modes in lists and reports

### **Error Prevention**

#### **Cost Allocation Guidance**

- **Preview Functionality**: Show allocation before committing
- **Variance Warnings**: Alerts when totals don't match
- **Allocation Breakdown**: View of how costs are distributed
- **Manual Adjustment**: Correction of allocation issues
- **Tooltips**: Explain allocation logic to users

## 📈 **Success Metrics**

### **Business Metrics**

- **Data Entry Efficiency**: Complete monthly inventory entry in <2 hours
- **Cost Accuracy**: Product costing including allocated overhead
- **Workflow Adoption**: 90%+ usage of tracking modes
- **Error Reduction**: <5% variance in cost allocations
- **Statement Integration**: Workflow with existing bookkeeping

### **Technical Metrics**

- **Allocation Performance**: Cost allocation calculations <2 seconds
- **Data Consistency**: Zero data corruption in cost allocation
- **Mode Flexibility**: Successful tracking mode changes without data loss
- **System Reliability**: 99.9% uptime for critical allocation functions

## 🔄 **Future Requirements**

### **Phase 2 Features**

- **Reporting**: Cost allocation reports and analysis
- **Bookkeeping Integration**: Direct export to accounting systems
- **Recipe Cost Analysis**: Product costing with allocated overhead
- **Supplier Analysis**: Cost trends and supplier performance metrics

### **Phase 3 Features**

- **Allocation Rules**: Customizable allocation formulas
- **Multi-Currency Support**: Handle international suppliers
- **Analytics**: Predictive costing and trend analysis
- **Mobile App**: Native mobile for production floor use

---

_For technical implementation details, see [technical-design.md](./technical-design.md). For database schema, see [data-model.md](./data-model.md). For development task tracking, see [tasks.md](./tasks.md)._

### **Security and Optimization (2025-07-21)**

- Server actions are now restricted to trusted domains via `serverActions.allowedOrigins` in `next.config.ts`.
- No images currently used in the UI; if added in the future, use Next.js `<Image />` for performance and LCP.

### **Spreadsheet-Lite Bulk Editing** (2025-07-21)

- All major data tables (suppliers, items, purchases, batches, etc.) will support inline, spreadsheet-like editing and batch operations.
- Implementation will use TanStack Table v8 for robust grid features.
- Each table will be bespoke, with master-detail views as needed.
- Focus is on minimizing user time and maximizing flexibility for small business workflows.
