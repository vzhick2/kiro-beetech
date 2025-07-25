---
title: 'Database Sample Data'
description: 'Sample database tables and realistic data for KIRO natural skincare inventory management'
purpose: 'Database design reference with realistic examples for face creams, lotions, and lip balm business'
last_updated: 'July 24, 2025'
doc_type: 'database-reference'
related: ['technical-reference.md', 'user-interface-fields.md']
---

# Database Sample Data

Sample database tables with realistic data for a natural skincare company producing face creams, lotions, and lip balms from organic ingredients in small batches.

## 📦 Items Table

| name                | description                                           | sku     | category      | unit_of_measure | tracking_mode | current_quantity | reorder_point | base_cost | is_active |
| ------------------- | ----------------------------------------------------- | ------- | ------------- | --------------- | ------------- | ---------------- | ------------- | --------- | --------- |
| Organic Rosehip Oil | Cold-pressed rosehip seed oil for anti-aging products | RHO-001 | Base Oils     | oz              | fully_tracked | 45.50            | 10.00         | 12.50     | true      |
| Organic Coconut Oil | Virgin coconut oil for moisturizing creams            | CCO-001 | Base Oils     | oz              | fully_tracked | 128.75           | 25.00         | 3.20      | true      |
| Vitamin E Oil       | Natural antioxidant preservative                      | VTE-001 | Preservatives | oz              | fully_tracked | 8.25             | 2.00          | 18.90     | true      |
| 2oz Glass Jars      | Clear glass jars with black lids for face creams      | JAR-2OZ | Packaging     | pieces          | cost_added    | 245              | 50            | 0.85      | true      |
| Lip Balm Tubes      | White 0.15oz tubes with black caps                    | LBT-001 | Packaging     | pieces          | cost_added    | 156              | 100           | 0.32      | true      |

## 🏢 Suppliers Table

| name                       | contact_person | phone          | website                   | address_line_1     | city       | state_province | payment_terms | is_active | last_used_date |
| -------------------------- | -------------- | -------------- | ------------------------- | ------------------ | ---------- | -------------- | ------------- | --------- | -------------- |
| Mountain Rose Herbs        | Sarah Chen     | (541) 741-7307 | mountainroseherbs.com     | 2000 Old Stage Rd  | Eugene     | OR             | Net 30        | true      | 2025-01-15     |
| Wholesale Supplies Plus    | Mike Rodriguez | (800) 359-0944 | wholesalesuppliesplus.com | 5035 Raines Rd     | Youngstown | OH             | Net 15        | true      | 2025-01-10     |
| Camden-Grey Essential Oils | Lisa Thompson  | (305) 500-9630 | camdengrey.com            | 5751 Halifax Ave   | Doral      | FL             | COD           | true      | 2024-12-28     |
| Specialty Bottle           | James Wilson   | (206) 382-1100 | specialtybottle.com       | 3220 Fifth Ave S   | Seattle    | WA             | Net 30        | true      | 2025-01-08     |
| Nature's Garden Candles    | Amanda Foster  | (330) 920-3249 | naturesgardencandles.com  | 2630 Poseyville Rd | Midland    | MI             | Net 45        | false     | 2024-11-15     |

## 🛒 Purchases Table

| purchase_number | supplier_id | status   | order_date | expected_delivery_date | total_amount | notes                                               |
| --------------- | ----------- | -------- | ---------- | ---------------------- | ------------ | --------------------------------------------------- |
| PO-2025-001     | 1           | received | 2025-01-15 | 2025-01-22             | 287.50       | Essential oils and base oils for January production |
| PO-2025-002     | 2           | ordered  | 2025-01-18 | 2025-01-25             | 156.80       | Packaging supplies for lip balm line                |
| PO-2025-003     | 4           | draft    | 2025-01-20 | 2025-01-27             | 89.25        | Additional glass jars for winter collection         |
| PO-2025-004     | 1           | ordered  | 2025-01-22 | 2025-01-29             | 425.00       | Bulk order of carrier oils for February             |
| PO-2025-005     | 3           | draft    | 2025-01-23 | 2025-01-30             | 195.75       | Specialty essential oils for new formulations       |

## 📋 Purchase Line Items Table

| purchase_id | item_id | quantity_ordered | quantity_received | unit_cost | line_total | notes                           |
| ----------- | ------- | ---------------- | ----------------- | --------- | ---------- | ------------------------------- |
| 1           | 1       | 16.00            | 16.00             | 12.50     | 200.00     | Premium grade A rosehip oil     |
| 1           | 3       | 4.00             | 4.00              | 18.90     | 75.60      | Non-GMO vitamin E oil           |
| 2           | 5       | 500              | 0                 | 0.32      | 160.00     | Standard white tubes            |
| 3           | 4       | 100              | 0                 | 0.85      | 85.00      | 2oz clear glass with black lids |
| 4           | 2       | 64.00            | 0                 | 3.20      | 204.80     | Organic virgin coconut oil      |

## 🧴 Recipes Table

| name                      | description                                     | category  | yield_quantity | yield_unit | prep_time_minutes | base_cost | selling_price |
| ------------------------- | ----------------------------------------------- | --------- | -------------- | ---------- | ----------------- | --------- | ------------- |
| Anti-Aging Night Cream    | Rich night cream with rosehip oil and vitamin E | Face Care | 12             | jars       | 45                | 8.75      | 24.99         |
| Daily Moisturizing Lotion | Light daily moisturizer with coconut oil        | Body Care | 8              | bottles    | 30                | 6.20      | 18.99         |
| Vanilla Mint Lip Balm     | Natural lip balm with vanilla and peppermint    | Lip Care  | 24             | tubes      | 25                | 2.40      | 3.99          |
| Sensitive Skin Face Cream | Gentle formula for sensitive skin types         | Face Care | 10             | jars       | 40                | 9.50      | 26.99         |
| Healing Hand Balm         | Intensive repair balm for dry hands             | Hand Care | 16             | tins       | 35                | 4.80      | 14.99         |

## 🥄 Recipe Ingredients Table

| recipe_id | item_id | quantity_needed | unit_of_measure | cost_per_unit | notes                         |
| --------- | ------- | --------------- | --------------- | ------------- | ----------------------------- |
| 1         | 1       | 2.5             | oz              | 12.50         | Primary anti-aging ingredient |
| 1         | 2       | 4.0             | oz              | 3.20          | Base moisturizer              |
| 1         | 3       | 0.25            | oz              | 18.90         | Natural preservative          |
| 2         | 2       | 6.0             | oz              | 3.20          | Main base oil                 |
| 3         | 2       | 1.5             | oz              | 3.20          | Moisturizing base             |

## 💰 Sales Table

| sale_number   | sale_date  | customer_name   | total_amount | payment_method | source         |
| ------------- | ---------- | --------------- | ------------ | -------------- | -------------- |
| SALE-2025-001 | 2025-01-15 | Sarah Johnson   | 73.97        | Card           | POS            |
| SALE-2025-002 | 2025-01-16 |                 | 24.99        | Cash           | POS            |
| SALE-2025-003 | 2025-01-17 | Emily Rodriguez | 142.94       | Card           | Online         |
| SALE-2025-004 | 2025-01-18 | Michael Chen    | 18.99        | Card           | POS            |
| SALE-2025-005 | 2025-01-19 | Lisa Thompson   | 89.95        | Card           | Farmers Market |

## 🛍️ Sale Line Items Table

| sale_id | recipe_id | product_name              | quantity_sold | unit_price | line_total | cost_of_goods_sold |
| ------- | --------- | ------------------------- | ------------- | ---------- | ---------- | ------------------ |
| 1       | 1         | Anti-Aging Night Cream    | 2             | 24.99      | 49.98      | 17.50              |
| 1       | 3         | Vanilla Mint Lip Balm     | 6             | 3.99       | 23.94      | 14.40              |
| 2       | 1         | Anti-Aging Night Cream    | 1             | 24.99      | 24.99      | 8.75               |
| 3       | 4         | Sensitive Skin Face Cream | 3             | 26.99      | 80.97      | 28.50              |
| 3       | 2         | Daily Moisturizing Lotion | 2             | 18.99      | 37.98      | 12.40              |

## 🔄 Inventory Transactions Table

| item_id | transaction_type   | reference_id | quantity_change | cost_per_unit | effective_date | reason                                     |
| ------- | ------------------ | ------------ | --------------- | ------------- | -------------- | ------------------------------------------ |
| 1       | PURCHASE           | 1            | 16.00           | 12.50         | 2025-01-15     | Received shipment from Mountain Rose Herbs |
| 2       | RECIPE_CONSUMPTION | 1            | -8.00           | 3.20          | 2025-01-16     | Used in Anti-Aging Night Cream batch       |
| 1       | RECIPE_CONSUMPTION | 1            | -5.00           | 12.50         | 2025-01-16     | Used in Anti-Aging Night Cream batch       |
| 4       | ADJUSTMENT         | NULL         | -5              | 0.85          | 2025-01-17     | Broken jars during handling                |
| 3       | PURCHASE           | 1            | 4.00            | 18.90         | 2025-01-15     | Vitamin E oil delivery                     |

## 📊 Inventory Adjustments Table

| item_id | adjustment_type | old_quantity | new_quantity | quantity_difference | reason                    | adjustment_date | notes                   |
| ------- | --------------- | ------------ | ------------ | ------------------- | ------------------------- | --------------- | ----------------------- |
| 4       | WASTE           | 250          | 245          | -5                  | Broken during handling    | 2025-01-17      | Dropped box of jars     |
| 1       | CYCLE_COUNT     | 47.50        | 45.50        | -2.00               | Inventory recount         | 2025-01-18      | Annual inventory count  |
| 2       | SPOILAGE        | 130.75       | 128.75       | -2.00               | Oil went rancid           | 2025-01-19      | Old batch expired       |
| 5       | MANUAL          | 160          | 156          | -4                  | Found defective tubes     | 2025-01-20      | Quality control check   |
| 3       | CYCLE_COUNT     | 8.50         | 8.25         | -0.25               | Physical count difference | 2025-01-21      | Monthly inventory check |

## 🏭 Production Batches Table

| recipe_id | batch_number   | production_date | quantity_produced | total_ingredient_cost | labor_cost | total_cost | status      |
| --------- | -------------- | --------------- | ----------------- | --------------------- | ---------- | ---------- | ----------- |
| 1         | BATCH-2025-001 | 2025-01-16      | 12                | 105.00                | 25.00      | 130.00     | completed   |
| 3         | BATCH-2025-002 | 2025-01-17      | 24                | 57.60                 | 15.00      | 72.60      | completed   |
| 2         | BATCH-2025-003 | 2025-01-18      | 8                 | 49.60                 | 20.00      | 69.60      | in_progress |
| 4         | BATCH-2025-004 | 2025-01-19      | 10                | 95.00                 | 22.50      | 117.50     | planned     |
| 5         | BATCH-2025-005 | 2025-01-20      | 16                | 76.80                 | 18.00      | 94.80      | planned     |

## 🥄 Batch Ingredients Used Table

| batch_id | item_id | quantity_used | cost_per_unit | total_cost | notes                       |
| -------- | ------- | ------------- | ------------- | ---------- | --------------------------- |
| 1        | 1       | 5.00          | 12.50         | 62.50      | Rosehip oil for night cream |
| 1        | 2       | 8.00          | 3.20          | 25.60      | Coconut oil base            |
| 1        | 3       | 0.50          | 18.90         | 9.45       | Vitamin E preservative      |
| 2        | 2       | 3.00          | 3.20          | 9.60       | Coconut oil for lip balm    |
| 3        | 2       | 12.00         | 3.20          | 38.40      | Coconut oil for body lotion |

## 🚨 Reorder Alerts Table

| item_id | alert_type   | current_quantity | reorder_point | suggested_order_quantity | priority | alert_date | is_active |
| ------- | ------------ | ---------------- | ------------- | ------------------------ | -------- | ---------- | --------- |
| 3       | LOW_STOCK    | 8.25             | 2.00          | 8.00                     | MEDIUM   | 2025-01-20 | true      |
| 1       | LOW_STOCK    | 45.50            | 10.00         | 20.00                    | HIGH     | 2025-01-21 | true      |
| 5       | LOW_STOCK    | 156              | 100           | 200                      | LOW      | 2025-01-22 | true      |
| 4       | OUT_OF_STOCK | 245              | 50            | 150                      | MEDIUM   | 2025-01-18 | false     |
| 2       | LOW_STOCK    | 128.75           | 25.00         | 50.00                    | MEDIUM   | 2025-01-19 | true      |

## ⚙️ System Settings Table

| setting_key                | setting_value | data_type | description                                            | category   |
| -------------------------- | ------------- | --------- | ------------------------------------------------------ | ---------- |
| default_overhead_rate      | 15.5          | number    | Default overhead percentage for cost allocation        | inventory  |
| reorder_lead_time_days     | 7             | number    | Default lead time for reorder calculations             | purchasing |
| low_stock_threshold        | 0.8           | number    | Percentage of reorder point to trigger low stock alert | inventory  |
| batch_cost_rounding        | 2             | number    | Decimal places for batch cost calculations             | production |
| enable_expiration_tracking | true          | boolean   | Track expiration dates for organic ingredients         | inventory  |

---

## 📝 Notes on Sample Data

### Business Context

This data represents a small-batch natural skincare company focusing on:

- **Premium organic ingredients** with higher costs but better margins
- **Small production runs** typically 8-24 units per batch
- **Multiple sales channels** including POS, online, and farmers markets
- **Quality-focused operations** with careful inventory tracking

### Data Relationships

- Items are categorized by usage (Base Oils, Essential Oils, Packaging, Preservatives)
- Recipes use multiple ingredients with precise measurements
- Purchases track both ingredients and packaging supplies
- Production batches consume inventory and create finished goods
- Sales can be individual items or recipe-based products

### Tracking Modes

- **Fully Tracked**: Expensive ingredients like rosehip oil, essential oils
- **Cost Added**: Packaging materials where exact quantity tracking is less critical

### Cost Structure

- Base costs reflect wholesale ingredient prices
- Overhead allocation adds facility, labor, and indirect costs
- Selling prices include healthy margins typical of artisanal skincare products

This sample data provides a realistic foundation for testing all aspects of the KIRO inventory management system in a natural skincare business context.
