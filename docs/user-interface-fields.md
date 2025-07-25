---
title: 'User Interface Fields Guide'
description: 'What database fields should be visible to users in the finished KIRO inventory management app'
purpose: 'UI/UX guidance for field visibility and progressive disclosure'
last_updated: 'July 24, 2025'
doc_type: 'ui-guidance'
related: ['technical-reference.md', 'product-specification.md']
---

# User Interface Fields Guide

This document outlines which database fields should be visible to users in the finished KIRO inventory management app, and which should remain hidden as technical implementation details.

**General Principle**: Show users what they need to make decisions and take action, while hiding the technical complexity that powers the system behind the scenes.

## 🛍️ Items Management

### Always Visible Fields
- **Item Name** - Primary identifier users will recognize ("Organic Rose Hip Oil", "2oz Glass Jars")
- **Current Quantity** - Critical for inventory decisions and day-to-day operations
- **Unit of Measure** - Essential context ("oz", "pieces", "ml") so users know what the quantity means
- **Tracking Mode** - Users need to understand if an item is "Fully Tracked" or "Cost Added" to set expectations
- **Category** - Helps organize and filter items ("Base Oils", "Essential Oils", "Packaging", "Preservatives")

### Conditionally Visible Fields
- **SKU/Product Code** - Show if users want detailed tracking, hide if it clutters the interface
- **Description** - Useful for detailed item information but might be hidden in list views to save space
- **Reorder Point & Quantity** - Important for inventory management but could be in an "advanced" or "settings" section
- **Current Cost** - Sensitive information - might only show to managers or in specific cost-focused views

### Hidden from Users
- **Base Cost vs Allocated Cost** - Too complex for daily operations; this is backend calculation logic
- **Weighted Average Cost** - Calculated field that changes automatically; users don't need to see the math
- **Database timestamps** - Users care when something was last updated, but not precise database timestamps

## 🏢 Supplier Management

### Always Visible Fields
- **Supplier Name** - Primary identifier for selecting suppliers ("Mountain Rose Herbs", "Wholesale Supplies Plus")
- **Contact Person** - Who to call when placing orders
- **Phone Number** - Essential for quick communication
- **Website** - Useful for checking product catalogs or placing online orders

### Conditionally Visible Fields
- **Full Address** - Important for shipping but might be collapsed/expandable to save screen space
- **Payment Terms** - Relevant for purchasing decisions but not needed in all views
- **Last Used Date** - Helpful for "recently used" sorting but not critical information
- **Notes** - Valuable for context but might be in a detail view rather than list view

### Hidden from Users
- **Internal optimization flags** - Backend efficiency tools that don't affect user workflow

## 📦 Purchase Management

### Always Visible Fields
- **Purchase Number** - Reference for tracking and communication ("PO-2025-001")
- **Supplier Name** - Who the order is from
- **Order Date** - When the purchase was placed
- **Status** - "Draft", "Ordered", "Received" - critical for workflow management
- **Total Amount** - Financial overview of the purchase

### Conditionally Visible Fields
- **Expected vs Actual Delivery Date** - Important for planning but might clutter daily views
- **Individual Line Items** - Essential in detail view, summarized in list view
- **Unit Costs** - Important for cost analysis but might be manager-only information
- **Notes** - Valuable but space-consuming

### Hidden from Users
- **Overhead allocation calculations** - Backend business logic
- **Internal processing timestamps** - Users care about business dates, not system processing times

## 🍽️ Recipe Management

### Always Visible Fields
- **Recipe Name** - What users call the product ("Anti-Aging Night Cream", "Vanilla Lip Balm")
- **Yield** - How many units the recipe makes ("12 2oz jars", "24 lip balm tubes")
- **Prep & Mix Time** - Essential for production planning
- **Ingredient List with Quantities** - Core recipe information

### Conditionally Visible Fields
- **Cost Information** - Might be manager-only or in a separate "costing" view
- **Selling Price & Margins** - Business-sensitive information for authorized users only
- **Detailed Instructions** - Essential for production but might be collapsible for space
- **Category** - Useful for organization but not always needed ("Face Care", "Lip Care", "Body Care")

### Hidden from Users
- **Cost allocation breakdowns** - Complex calculations better handled behind the scenes

## 💰 Sales Tracking

### Always Visible Fields
- **Sale Date** - When the transaction occurred
- **Items Sold** - What was purchased
- **Quantities** - How much of each item
- **Total Sale Amount** - Financial summary

### Conditionally Visible Fields
- **Customer Name** - Optional field, might not always be collected
- **Payment Method** - Useful for reconciliation but not always needed in all views
- **Individual Item Prices** - Detailed breakdown vs. summary view
- **Source** - Whether from POS, manual entry, etc. - useful for tracking but not critical

### Hidden from Users
- **Cost of goods sold calculations** - Backend profitability analysis
- **Import metadata** - Technical details about data processing

## 🔄 Inventory Adjustments

### Always Visible Fields
- **Item Name** - What was adjusted
- **Old vs New Quantity** - What changed
- **Reason for Adjustment** - "Cycle Count", "Waste", "Correction", "Spoilage"
- **Adjustment Date** - When it happened

### Conditionally Visible Fields
- **Cost Impact** - Financial effect of the adjustment - might be manager-only
- **Detailed Notes** - Important context but space-consuming
- **Who Made the Change** - Useful for accountability but might be in audit logs rather than main interface

### Hidden from Users
- **System-generated transaction records** - Users see the result, not the database mechanics

## 📊 Reporting & Alerts

### Always Visible Fields
- **Alert Type** - "Low Stock", "Reorder Needed", "Expired Ingredients"
- **Item Name** - What needs attention
- **Current Quantity vs. Reorder Point** - The actual numbers driving the alert
- **Suggested Action** - What to do about it

### Conditionally Visible Fields
- **Priority Level** - Useful for sorting but might be shown through visual cues (colors) rather than text
- **Alert Date** - How long this has been an issue
- **Supplier Suggestions** - Who to order from, based on purchase history

### Hidden from Users
- **Alert processing metadata** - When alerts were generated, acknowledged, etc.

## ⚙️ General UI Principles

### Always Hide
- **Primary keys, foreign keys** - Technical database references (id, supplier_id, item_id, etc.)
- **Created/updated timestamps** - Replace with user-friendly "Last modified" dates when relevant
- **JSON fields and complex data structures** - Present the information in user-friendly formats
- **System configuration details** - Internal settings that don't affect daily operations

### Progressive Disclosure Strategy
- **Basic view** - Name, quantity, status, key actions
- **Detailed view** - Full information when user clicks for more details
- **Advanced/Manager view** - Financial data, cost breakdowns, system settings

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
- Show quantities, locations, reorder points
- Hide recipe details unless managing ingredients
- Emphasize stock levels and movement

The key principle is **contextual relevance** - users should see exactly what they need for their current task, with the ability to drill down for more detail when needed. 