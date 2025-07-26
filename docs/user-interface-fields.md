---
title: 'User Interface Fields Guide'
description: 'What database fields should be visible to users in the finished KIRO inventory management app'
purpose: 'UI/UX guidance for field visibility and progressive disclosure - matches current Supabase schema'
last_updated: 'January 27, 2025'
doc_type: 'ui-guidance'
related: ['technical-reference.md', 'product-specification.md']
---

# User Interface Fields Guide

This document outlines which database fields should be visible to users in the finished KIRO inventory management app, and which should remain hidden as technical implementation details.

**General Principle**: Show users what they need to make decisions and take action, while hiding the technical complexity that powers the system behind the scenes.

**Schema Alignment**: This guide reflects the exact fields available in the current Supabase database as of January 27, 2025.

## 🛍️ Items Management

### Always Visible Fields

- **Item Name** (`name`) - Primary identifier users will recognize ("Organic Rose Hip Oil", "2oz Glass Jars")
- **Current Quantity** (`currentquantity`) - Critical for inventory decisions and day-to-day operations
- **Unit of Measure** (`inventoryunit`) - Essential context ("oz", "pieces", "ml") so users know what the quantity means
- **Tracking Mode** (`tracking_mode`) - Users need to understand if an item is "fully_tracked" or "cost_added" to set expectations
- **Item Type** (`type`) - Basic categorization: "ingredient", "packaging", "product"

### Conditionally Visible Fields

- **SKU** (`sku`) - Show if users want detailed tracking, hide if it clutters the interface
- **Reorder Point** (`reorderpoint`) - Important for inventory management but could be in an "advanced" section
- **Weighted Average Cost** (`weightedaveragecost`) - Show to managers or in cost-focused views only
- **Primary Supplier** (`primarysupplierid`) - Useful for reordering but not always needed
- **Lead Time Days** (`leadtimedays`) - Planning information, conditionally visible
- **Last Counted Date** (`lastcounteddate`) - Useful for cycle count planning

### Hidden from Users

- **Item ID** (`itemid`) - Technical UUID primary key
- **Database timestamps** (`created_at`, `updated_at`) - Replace with user-friendly "Last modified" when relevant
- **Last Inventory Snapshot** (`last_inventory_snapshot`) - Technical field for tracking mode changes
- **Archive Status** (`isarchived`) - Handle through filtering, not direct display

## 🏢 Supplier Management

### Always Visible Fields

- **Supplier Name** (`name`) - Primary identifier for selecting suppliers
- **Contact Email** (`email`) - Primary contact method for supplier communication
- **Contact Phone** (`contactphone`) - Essential for quick communication  
- **Website** (`website`) - Useful for checking product catalogs or placing online orders

### Conditionally Visible Fields

- **Address** (`address`) - Important for shipping but might be collapsed/expandable to save screen space
- **Notes** (`notes`) - Valuable for context but might be in a detail view rather than list view
- **Archive Status** (`isarchived`) - Show through filtering rather than explicit field

### Hidden from Users

- **Supplier ID** (`supplierid`) - Technical UUID primary key
- **Created At** (`created_at`) - Technical timestamp

## 📦 Purchase Management

### Always Visible Fields

- **Purchase Number** (`displayid`) - Reference for tracking and communication ("PO-2025-001")
- **Supplier Name** (via `supplierid` relationship) - Who the order is from
- **Purchase Date** (`purchasedate`) - When the purchase was placed
- **Status** (`isdraft`) - Show as "Draft" or "Finalized" for workflow management
- **Total Amount** (`total`) - Financial overview of the purchase

### Conditionally Visible Fields

- **Effective Date** (`effectivedate`) - When inventory impact occurs, might be different from purchase date
- **Shipping Cost** (`shipping`) - Important for cost analysis but might be in detail view
- **Tax Amount** (`taxes`) - Important for cost analysis but might be in detail view
- **Other Costs** (`othercosts`) - Additional fees, important for managers
- **Notes** (`notes`) - Valuable but space-consuming

### Hidden from Users

- **Purchase ID** (`purchaseid`) - Technical UUID primary key
- **Database timestamps** (`created_at`, `updated_at`) - Users care about business dates, not system processing times

## 📦 Purchase Line Items

### Always Visible Fields (in Purchase Detail View)

- **Item Name** (via `itemid` relationship) - What was purchased
- **Quantity** (`quantity`) - How much was ordered
- **Unit Cost** (`unitcost`) - Cost per unit
- **Total Cost** (`totalcost`) - Line item total

### Conditionally Visible Fields

- **Notes** (`notes`) - Item-specific purchase notes

### Hidden from Users

- **Line Item ID** (`lineitemid`) - Technical UUID primary key
- **Purchase ID** (`purchaseid`) - Technical foreign key

## 🍽️ Recipe Management

### Always Visible Fields

- **Recipe Name** (`name`) - What users call the product ("Anti-Aging Night Cream")
- **Display Version** (`displayversion`) - User-friendly version identifier
- **Expected Yield** (`expectedyield`) - How many units the recipe makes
- **Output Product** (via `outputproductid` relationship) - What product this recipe creates

### Conditionally Visible Fields

- **Version Number** (`version`) - Technical version for tracking changes
- **Labor Minutes** (`laborminutes`) - Production planning information
- **Projected Material Cost** (`projectedmaterialcost`) - Cost estimation, might be manager-only
- **Archive Status** (`isarchived`) - Handle through filtering

### Hidden from Users

- **Recipe ID** (`recipeid`) - Technical UUID primary key
- **Database timestamps** (`created_at`, `updated_at`) - Technical metadata

## 🧪 Recipe Ingredients

### Always Visible Fields (in Recipe Detail View)

- **Ingredient Name** (via `itemid` relationship) - What ingredient is used
- **Quantity** (`quantity`) - How much is needed
- **Unit** (via item relationship) - Unit of measurement

### Conditionally Visible Fields

- **Notes** (`notes`) - Preparation instructions or substitution notes

### Hidden from Users

- **Ingredient ID** (`ingredientid`) - Technical UUID primary key
- **Recipe ID** (`recipeid`) - Technical foreign key

## 🏭 Batch Production

### Always Visible Fields

- **Batch Number** (`displayid`) - Reference for tracking ("BATCH-2025-001")
- **Recipe** (via `recipeid` relationship) - What was produced
- **Date Created** (`datecreated`) - When batch was made
- **Quantity Made** (`qtymade`) - Actual output
- **Material Cost** (`materialcost`) - Cost of ingredients used
- **Actual Cost** (`actualcost`) - Total production cost

### Conditionally Visible Fields

- **Effective Date** (`effectivedate`) - When inventory impact occurs
- **Yield Percentage** (`yieldpercentage`) - Efficiency metric
- **Labor Cost** (`laborcost`) - Production labor costs
- **Cost Variance** (`costvariance`) - Difference from projected cost
- **Expiry Date** (`expirydate`) - Product shelf life
- **Notes** (`notes`) - Production notes

### Hidden from Users

- **Batch ID** (`batchid`) - Technical UUID primary key
- **Created At** (`created_at`) - Technical timestamp

## 💰 Sales Tracking

### Always Visible Fields

- **Display ID** (`displayid`) - Sale reference number
- **Item** (via `itemid` relationship) - What was sold
- **Sales Channel** (`channel`) - "qbo" or "bigcommerce"
- **Period Start/End** (`periodstart`, `periodend`) - Sales period dates
- **Quantity Sold** (`quantitysold`) - Amount sold
- **Revenue** (`revenue`) - Sales amount

### Conditionally Visible Fields

- **Data Source** (`datasource`) - "manual" or "imported" - useful for tracking but not critical

### Hidden from Users

- **Sales Period ID** (`salesperiodid`) - Technical UUID primary key
- **Created At** (`created_at`) - Technical timestamp

## 🔄 Transaction Logs

### Always Visible Fields (in Audit Views)

- **Item** (via `itemid` relationship) - What was affected
- **Transaction Type** (`transactiontype`) - "purchase", "sale", "adjustment", "batch_consumption", "batch_production"
- **Quantity** (`quantity`) - Amount changed
- **Effective Date** (`effectivedate`) - When it happened

### Conditionally Visible Fields

- **Unit Cost** (`unitcost`) - Cost information when relevant
- **Reference Type/ID** (`referencetype`, `referenceid`) - What caused this transaction
- **Notes** (`notes`) - Additional context

### Hidden from Users

- **Transaction ID** (`transactionid`) - Technical UUID primary key
- **Created At** (`created_at`) - Technical timestamp

## 📊 Forecasting Data

### Conditionally Visible Fields (in Advanced Analytics)

- **Predicted Demand** (`predicteddemand`) - Forecasted usage
- **Seasonal Index** (`seasonalindex`) - Seasonal adjustment factor
- **Recommended Reorder Point** (`recommendedreorderpoint`) - System suggestion

### Hidden from Users

- **Forecasting ID** (`forecastingid`) - Technical UUID primary key
- **Is Automatic** (`isautomatic`) - System flag
- **Calculated At** (`calculatedat`) - Technical timestamp

## ⚙️ General UI Principles

### Always Hide

- **Primary keys, foreign keys** - All UUID fields (itemid, supplierid, purchaseid, etc.)
- **Created/updated timestamps** - Replace with user-friendly "Last modified" dates when relevant
- **Technical flags** - Internal system configuration fields
- **Archive flags** - Handle through filtering rather than explicit display

### Progressive Disclosure Strategy

- **Basic view** - Name, quantity/status, key actions
- **Detailed view** - Full information when user clicks for more details
- **Advanced/Manager view** - Financial data, cost breakdowns, system analytics

### Mobile Considerations

- **Prioritize essential fields** on small screens
- **Use expandable sections** for secondary information
- **Show critical alerts prominently** but collapse details
- **Make key actions easily accessible** with proper touch targets

## 🎯 Context-Specific Visibility

### Production View

- Show recipe ingredients, quantities, batch status
- Hide financial details unless specifically requested
- Emphasize timing and process steps

### Financial View

- Show costs, margins, purchasing data
- Hide production details unless relevant
- Emphasize trends and profitability

### Inventory View

- Show quantities, tracking modes, reorder points
- Hide recipe details unless managing ingredients
- Emphasize stock levels and movement

## 🔧 Current Database Limitations

### Missing Fields (for future enhancement)

- **Item Categories**: Currently only basic `type` enum, no detailed categorization
- **Item Descriptions**: No description field for detailed item information
- **Supplier Contact Person**: No separate contact person field
- **Purchase Status Enum**: Currently only `isdraft` boolean, not full status workflow

### Working Within Current Schema

- Use `type` field for basic categorization (ingredient/packaging/product)
- Use `notes` fields for additional context where needed
- Handle status workflows through `isdraft` boolean interpretation
- Leverage relationships for display names and additional context

The key principle remains **contextual relevance** - users should see exactly what they need for their current task, with the ability to drill down for more detail when needed, while working within the current database structure.
