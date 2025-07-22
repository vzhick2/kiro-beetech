---
title: 'Google Sheets Alternative'
description: 'Complete Google Sheets implementation as alternative to the Next.js application'
purpose: 'Alternative inventory management solution using Google Sheets and Apps Script'
last_updated: 'July 22, 2025'
doc_type: 'alternative-implementation'
related: ['README.md', 'technical-design.md']
---

# Google Sheets Inventory Hub

Complete Google Sheets implementation as an alternative to the Next.js application, featuring full inventory management with recipes, batches, sales, and advanced cost allocation.

## Overview

This Google Sheets implementation provides the same core functionality as the main Next.js application but using Google Sheets and Apps Script. It's designed for small teams who prefer spreadsheet-based workflows while maintaining data integrity and business logic.

### Key Features
- **Purchase Management**: Full purchase workflow with overhead allocation
- **Recipe & Batch Production**: Convert ingredients to finished goods with cost tracking
- **Sales & Revenue Tracking**: Track sales with automatic inventory deduction
- **Weighted Average Cost (WAC)**: Automatic calculation and manual recalculation tools
- **Inventory Adjustments**: Manual corrections with audit trail
- **Comprehensive Reporting**: Item history, supplier analysis, recipe costing, batch history

## Implementation Guide

### Core Design Principles

1. **Controlled Mutability**: Allows correction of past mistakes through dedicated scripts that safely reverse and re-apply transactions
2. **Maximum Visibility**: All core data sheets are visible by default with protection preventing accidental edits
3. **UI-Driven Workflows**: Complex actions handled through custom sidebar UI that guides users and validates data
4. **Single Source of Truth**: The `Transactions` sheet serves as the definitive log for every inventory movement

### Workbook Setup

#### 1. Create the Workbook
Create a new Google Sheet named **"KIRO Inventory Hub"**.

#### 2. Create the Sheets
Create the following tabs (sheets):

**User-Facing Sheets:**
- `Dashboard` - High-level overview with charts and metrics
- `Purchases` - Purchase order log
- `Batches` - Production run log
- `Recipes` - Product recipe definitions
- `Sales` - Sales transaction log
- `Item_Dashboard` - Interactive item history report
- `Supplier_Dashboard` - Interactive supplier report
- `Recipe_Dashboard` - Recipe cost analysis
- `Batch_Dashboard` - Production history and costs

**Core Data Sheets:**
- `Items` - Master inventory list
- `Suppliers` - Supplier information
- `PurchaseLineItems` - Purchase detail records
- `RecipeLineItems` - Recipe ingredient details
- `BatchLineItems` - Batch consumption records (audit)
- `Transactions` - Complete audit log
- `Config` - Dropdown menu data

#### 3. Sheet Configuration

##### Dashboard
- **Purpose**: High-level business overview
- **Setup**: Create charts and graphs using "Insert > Chart" based on data from Transactions, Items, and Sales sheets
- **Buttons**: Add action buttons using "Insert > Drawing" linked to scripts

##### Items
- **Purpose**: Master inventory list
- **Columns**:
  - `A`: `ItemID` (Locked)
  - `B`: `Name` (Editable)
  - `C`: `SKU` (Editable)
  - `D`: `Category` (Editable, validation from Config)
  - `E`: `Type` (Editable, validation: 'ingredient', 'packaging', 'product')
  - `F`: `Tracking Mode` (Editable, validation: 'Full', 'Cost-Only')
  - `G`: `Current Stock` (Locked - calculated)
  - `H`: `Weighted Average Cost` (Locked - calculated)
  - `I`: `Low Stock Threshold` (Editable)
- **Protection**: Protect columns A, G, H

##### Purchases
- **Purpose**: Purchase order log
- **Columns**:
  - `A`: `PurchaseID` (Locked)
  - `B`: `Date` (Editable)
  - `C`: `Supplier` (Editable, validation from Suppliers)
  - `D`: `Status` (Locked: "Draft", "Finalized")
  - `E`: `Invoice #` (Editable)
  - `F`: `Shipping Cost` (Editable)
  - `G`: `Taxes & Fees` (Editable)
  - `H`: `Total Cost` (Locked - calculated)
  - `I`: `Notes` (Editable)
- **Protection**: Protect columns A, D, H

##### Recipes
- **Purpose**: Product recipe definitions
- **Columns**:
  - `A`: `RecipeID` (Locked)
  - `B`: `Name` (Editable)
  - `C`: `Produces ItemID` (Editable, validation from Items where Type='product')
  - `D`: `Target Quantity` (Editable)
  - `E`: `Notes` (Editable)
- **Protection**: Protect column A

##### Batches
- **Purpose**: Production run log
- **Columns**:
  - `A`: `BatchID` (Locked)
  - `B`: `Date` (Editable)
  - `C`: `Recipe Used` (Editable, validation from Recipes)
  - `D`: `Quantity Made` (Editable)
  - `E`: `Status` (Locked: "Planned", "Completed")
  - `F`: `Total Material Cost` (Locked - calculated)
  - `G`: `Notes` (Editable)
- **Protection**: Protect columns A, E, F

##### Sales
- **Purpose**: Sales transaction log
- **Columns**:
  - `A`: `SaleID` (Locked)
  - `B`: `Date` (Editable)
  - `C`: `ItemID` (Editable, validation from Items)
  - `D`: `Quantity Sold` (Editable)
  - `E`: `Sale Price` (Editable)
  - `F`: `Channel` (Editable, validation: 'QBO', 'BigCommerce', 'Manual')
- **Protection**: Protect column A

##### Transactions
- **Purpose**: Complete audit log of all inventory movements
- **Columns**:
  - `A`: `TransactionID`
  - `B`: `Timestamp`
  - `C`: `Type` ('PURCHASE', 'SALE', 'ADJUSTMENT', 'BATCH_CONSUMPTION', 'BATCH_PRODUCTION')
  - `D`: `ItemID`
  - `E`: `Item Name`
  - `F`: `Quantity Change`
  - `G`: `Value Change`
  - `H`: `New WAC`
  - `I`: `Related ID`
  - `J`: `User`
- **Protection**: Protect entire sheet

##### Interactive Dashboards

**Item_Dashboard**:
- Cell A1: "Select Item:"
- Cell B1: Data validation dropdown from Items!B:B
- Cell A3: Formula: `=QUERY(Transactions!A:J, "SELECT * WHERE E = '"&B1&"' ORDER BY B DESC", 1)`

**Supplier_Dashboard**:
- Cell A1: "Select Supplier:"
- Cell B1: Data validation dropdown from Suppliers!B:B
- Cell A3: Formula: `=QUERY(Purchases!A:I, "SELECT * WHERE C = '"&B1&"' ORDER BY B DESC", 1)`

**Recipe_Dashboard**:
- Cell A1: "Select Recipe:"
- Cell B1: Data validation dropdown from Recipes!B:B
- Cell F1: "Current Recipe Cost:"
- Cell F2: WAC-based cost calculation formula

#### 4. Advanced Formulas

##### WAC Calculation (for verification)
```
=IF(SUMIF(Transactions!D:D, "ITEM-ID", Transactions!F:F) > 0, 
    SUMIF(Transactions!D:D, "ITEM-ID", Transactions!G:G) / SUMIF(Transactions!D:D, "ITEM-ID", Transactions!F:F), 
    0)
```

##### Low Stock Alert
In Items sheet column J:
```
=IF(G2 < I2, "LOW STOCK", IF(G2 < 0, "NEGATIVE", "OK"))
```

##### Monthly COGS Report
```
=SUMIFS(Transactions!G:G, Transactions!C:C, "SALE", Transactions!B:B, ">="&DATE(YEAR(TODAY()), MONTH(TODAY()), 1))
```

## Apps Script Implementation

### Installation Steps

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete default `Code.gs` content
4. Create the following files and copy the corresponding code sections below

### Script Files

#### UiMenu.gs
*Purpose: Creates the custom menu in Google Sheets*

```javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('KIRO Tools')
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Purchases')
      .addItem('Create New Purchase', 'createNewPurchase')
      .addItem('Edit Selected Purchase', 'editSelectedPurchase')
      .addItem('Correct Finalized Purchase', 'correctFinalizedPurchase'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Production')
      .addItem('Create New Recipe', 'createNewRecipe')
      .addItem('Edit Selected Recipe', 'editSelectedRecipe')
      .addItem('Log New Batch', 'logNewBatch')
      .addItem('Edit Selected Batch', 'editSelectedBatch'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Sales & Inventory')
      .addItem('Log a Sale', 'logSale')
      .addItem('Manual Inventory Adjustment', 'inventoryAdjustment')
      .addItem('Calculate WAC for All Items', 'recalculateAllWAC'))
    .addToUi();
}

function createNewPurchase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Purchases');
  const newRow = sheet.getLastRow() + 1;
  const purchaseId = 'PUR-' + new Date().getTime();
  
  sheet.getRange(newRow, 1).setValue(purchaseId);
  sheet.getRange(newRow, 2).setValue(new Date());
  sheet.getRange(newRow, 4).setValue('Draft');
  
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet, true);
  sheet.getRange(newRow, 3).activate();
  
  SpreadsheetApp.getUi().alert('New draft purchase created. Please fill in the supplier and use "Edit Selected Purchase" to add items.');
}

function editSelectedPurchase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Purchases');
  const activeRow = sheet.getActiveCell().getRow();
  
  if (activeRow === 1) {
    SpreadsheetApp.getUi().alert('Please select a purchase row, not the header.');
    return;
  }
  
  const status = sheet.getRange(activeRow, 4).getValue();
  
  if (status !== 'Draft') {
    SpreadsheetApp.getUi().alert('Only "Draft" purchases can be edited this way. For completed orders, use the "Correct Finalized Purchase" tool.');
    return;
  }
  
  const purchaseId = sheet.getRange(activeRow, 1).getValue();
  
  const html = HtmlService.createTemplateFromFile('PurchaseSidebar')
      .evaluate()
      .setTitle(`Edit Purchase: ${purchaseId}`)
      .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
  
  PropertiesService.getScriptProperties().setProperty('currentPurchaseId', purchaseId);
}

// Additional menu functions
function createNewRecipe() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recipes');
  const newRow = sheet.getLastRow() + 1;
  const recipeId = 'RCP-' + new Date().getTime();
  
  sheet.getRange(newRow, 1).setValue(recipeId);
  
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet, true);
  sheet.getRange(newRow, 2).activate();
  
  SpreadsheetApp.getUi().alert('New recipe created. Fill in the basic details and use "Edit Selected Recipe" to add ingredients.');
}

function logNewBatch() {
  const html = HtmlService.createTemplateFromFile('BatchSidebar')
      .evaluate()
      .setTitle('Log New Batch')
      .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}

function logSale() {
  const html = HtmlService.createTemplateFromFile('SaleSidebar')
      .evaluate()
      .setTitle('Log Sale')
      .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function inventoryAdjustment() {
  const html = HtmlService.createTemplateFromFile('AdjustmentSidebar')
      .evaluate()
      .setTitle('Inventory Adjustment')
      .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function recalculateAllWAC() {
  const result = SpreadsheetApp.getUi().alert(
    'Recalculate WAC',
    'This will recalculate Weighted Average Cost for all items based on transaction history. This may take a while. Continue?',
    SpreadsheetApp.getUi().Button.YES_NO
  );
  
  if (result === SpreadsheetApp.getUi().Button.YES) {
    try {
      recalculateWACForAllItems();
      SpreadsheetApp.getUi().alert('WAC recalculation completed successfully.');
    } catch (e) {
      SpreadsheetApp.getUi().alert('Error during WAC recalculation: ' + e.message);
    }
  }
}
```

#### PurchaseWorkflow.gs
*Purpose: Core purchase management logic*

```javascript
function getPurchaseDetails(purchaseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = ss.getSheetByName('Items');
  const purchaseLineItemsSheet = ss.getSheetByName('PurchaseLineItems');
  
  // Get all items for dropdown
  const itemsData = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 3).getValues();
  const allItems = itemsData.map(item => ({
    id: item[0],
    name: item[1],
    sku: item[2]
  }));
  
  // Get existing line items
  const lineItemsData = purchaseLineItemsSheet.getDataRange().getValues();
  const existingLineItems = lineItemsData
    .filter(row => row[1] === purchaseId)
    .map(row => ({
      id: row[0],
      itemId: row[2],
      name: row[3],
      quantity: row[4],
      cost: row[5]
    }));
  
  return {
    lineItems: existingLineItems,
    allItems: allItems
  };
}

function finalizePurchase(data) {
  const { purchaseId, lineItems, shipping, taxes } = data;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const transSheet = ss.getSheetByName('Transactions');
    const itemsSheet = ss.getSheetByName('Items');
    const purchasesSheet = ss.getSheetByName('Purchases');
    const purchaseLineItemsSheet = ss.getSheetByName('PurchaseLineItems');

    // Find purchase row
    const purchaseRow = findRowByValue(purchasesSheet, 1, purchaseId);
    if (!purchaseRow) throw new Error('Could not find the purchase.');

    // Clear existing line items
    clearPurchaseLineItems(purchaseId);

    // Calculate overhead allocation
    const totalBaseCost = lineItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const totalOverhead = parseFloat(shipping || 0) + parseFloat(taxes || 0);

    // Process each line item
    lineItems.forEach(item => {
      const itemBaseCost = item.quantity * item.cost;
      const allocatedOverhead = totalOverhead > 0 ? (itemBaseCost / totalBaseCost) * totalOverhead : 0;
      const finalLineCost = itemBaseCost + allocatedOverhead;
      const finalUnitCost = finalLineCost / item.quantity;
      
      // Add to PurchaseLineItems
      const lineItemId = 'PLI-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2, 5);
      purchaseLineItemsSheet.appendRow([
        lineItemId, purchaseId, item.itemId, item.name, item.quantity, item.cost, finalLineCost
      ]);
      
      // Create transaction
      const transId = 'TRN-P-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2, 5);
      transSheet.appendRow([
        transId, new Date(), 'PURCHASE', item.itemId, item.name,
        item.quantity, finalLineCost, finalUnitCost, purchaseId, Session.getActiveUser().getEmail()
      ]);
      
      // Update inventory
      updateInventory(item.itemId, item.quantity, finalUnitCost, 'PURCHASE');
    });

    // Update purchase status
    purchasesSheet.getRange(purchaseRow, 4).setValue('Finalized');
    purchasesSheet.getRange(purchaseRow, 6).setValue(parseFloat(shipping || 0));
    purchasesSheet.getRange(purchaseRow, 7).setValue(parseFloat(taxes || 0));

    SpreadsheetApp.getUi().alert('Purchase has been finalized successfully!');

  } catch (e) {
    SpreadsheetApp.getUi().alert('An error occurred: ' + e.message);
  } finally {
    lock.releaseLock();
  }
}
```

#### BatchWorkflow.gs
*Purpose: Production batch management*

```javascript
function finalizeBatch(data) {
  const { recipeId, quantityMade, batchDate } = data;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const transSheet = ss.getSheetByName('Transactions');
    const itemsSheet = ss.getSheetByName('Items');
    const recipesSheet = ss.getSheetByName('Recipes');
    const recipeLineItemsSheet = ss.getSheetByName('RecipeLineItems');
    const batchesSheet = ss.getSheetByName('Batches');

    // Create batch ID
    const batchId = 'BAT-' + new Date().getTime();
    
    // Get recipe details
    const recipeRow = findRowByValue(recipesSheet, 1, recipeId);
    if (!recipeRow) throw new Error('Recipe not found.');
    
    const recipeName = recipesSheet.getRange(recipeRow, 2).getValue();
    const producedItemId = recipesSheet.getRange(recipeRow, 3).getValue();
    const targetQuantity = recipesSheet.getRange(recipeRow, 4).getValue();
    const scaleFactor = quantityMade / targetQuantity;
    
    // Get ingredients
    const recipeItemsData = recipeLineItemsSheet.getDataRange().getValues();
    const ingredients = recipeItemsData.filter(row => row[1] === recipeId);

    let totalBatchCost = 0;

    // Process ingredient consumption
    ingredients.forEach(ingredient => {
      const ingredientId = ingredient[2];
      const ingredientName = ingredient[3];
      const quantityNeeded = ingredient[4] * scaleFactor;
      
      const itemRow = findRowByValue(itemsSheet, 1, ingredientId);
      if (!itemRow) throw new Error(`Ingredient ${ingredientId} not found.`);
      
      const ingredientWac = itemsSheet.getRange(itemRow, 8).getValue();
      const consumptionCost = ingredientWac * quantityNeeded;
      totalBatchCost += consumptionCost;

      // Create consumption transaction
      const transId = 'TRN-BC-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2, 5);
      transSheet.appendRow([
        transId, new Date(batchDate), 'BATCH_CONSUMPTION', ingredientId, ingredientName,
        -quantityNeeded, -consumptionCost, ingredientWac, batchId, Session.getActiveUser().getEmail()
      ]);

      // Update inventory
      updateInventory(ingredientId, quantityNeeded, 0, 'CONSUMPTION');
    });

    // Create production transaction
    const producedUnitCost = totalBatchCost / quantityMade;
    const prodTransId = 'TRN-BP-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2, 5);
    
    const producedItemRow = findRowByValue(itemsSheet, 1, producedItemId);
    const producedItemName = itemsSheet.getRange(producedItemRow, 2).getValue();
    
    transSheet.appendRow([
      prodTransId, new Date(batchDate), 'BATCH_PRODUCTION', producedItemId, producedItemName,
      quantityMade, totalBatchCost, producedUnitCost, batchId, Session.getActiveUser().getEmail()
    ]);

    // Update produced item inventory
    updateInventory(producedItemId, quantityMade, producedUnitCost, 'PURCHASE');

    // Create batch record
    batchesSheet.appendRow([
      batchId, new Date(batchDate), recipeName, quantityMade, 'Completed', totalBatchCost,
      `Produced ${quantityMade} units of ${producedItemName}`
    ]);

    SpreadsheetApp.getUi().alert(`Batch completed successfully! Produced ${quantityMade} units at $${producedUnitCost.toFixed(4)} per unit.`);

  } catch (e) {
    SpreadsheetApp.getUi().alert('An error occurred: ' + e.message);
  } finally {
    lock.releaseLock();
  }
}
```

#### InventoryUtils.gs
*Purpose: Utility functions for inventory management*

```javascript
function findRowByValue(sheet, column, value) {
  const data = sheet.getRange(1, column, sheet.getLastRow()).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == value) {
      return i + 1;
    }
  }
  return null;
}

function updateInventory(itemId, quantityChange, newCost, transactionType) {
  const itemsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Items');
  const itemRow = findRowByValue(itemsSheet, 1, itemId);
  if (!itemRow) throw new Error(`Item ID ${itemId} not found.`);

  const stockRange = itemsSheet.getRange(itemRow, 7); // Current Stock
  const wacRange = itemsSheet.getRange(itemRow, 8);   // WAC

  const currentStock = stockRange.getValue();
  const currentWac = wacRange.getValue();

  let newStock = currentStock;
  let newWac = currentWac;

  if (transactionType === 'PURCHASE') {
    newStock = currentStock + quantityChange;
    if (newStock > 0) {
      const newTotalValue = (currentStock * currentWac) + (quantityChange * newCost);
      newWac = newTotalValue / newStock;
    } else {
      newWac = newCost;
    }
  } else if (transactionType === 'SALE' || transactionType === 'CONSUMPTION') {
    newStock = currentStock - quantityChange;
  } else if (transactionType === 'ADJUSTMENT') {
    newStock = currentStock + quantityChange;
    if (newCost > 0) {
      newWac = newCost;
    }
  }
  
  stockRange.setValue(newStock);
  wacRange.setValue(newWac);
}

function recalculateWACForAllItems() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = ss.getSheetByName('Items');
  const transSheet = ss.getSheetByName('Transactions');
  
  const itemsData = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 8).getValues();
  const transData = transSheet.getRange(2, 1, transSheet.getLastRow() - 1, 10).getValues();
  
  itemsData.forEach((item, index) => {
    const itemId = item[0];
    
    const itemTransactions = transData
      .filter(trans => trans[3] === itemId)
      .sort((a, b) => new Date(a[1]) - new Date(b[1]));
    
    let runningStock = 0;
    let runningValue = 0;
    let currentWac = 0;
    
    itemTransactions.forEach(trans => {
      const quantity = trans[5];
      const unitCost = trans[7];
      const transType = trans[2];
      
      if (transType === 'PURCHASE' || transType === 'BATCH_PRODUCTION') {
        runningValue += (quantity * unitCost);
        runningStock += quantity;
        if (runningStock > 0) {
          currentWac = runningValue / runningStock;
        }
      } else {
        runningStock += quantity; // quantity is negative for sales
        if (runningStock < 0) {
          runningValue = 0;
        }
      }
    });
    
    const itemRow = index + 2;
    itemsSheet.getRange(itemRow, 7).setValue(runningStock);
    itemsSheet.getRange(itemRow, 8).setValue(currentWac);
  });
}
```

### HTML Sidebar Files

#### PurchaseSidebar.html
*Purpose: Purchase editing interface*

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: Arial, sans-serif; margin: 10px; font-size: 12px; }
      .line-item { display: flex; gap: 5px; margin-bottom: 8px; align-items: center; }
      .line-item select, .line-item input { flex: 1; padding: 4px; font-size: 11px; }
      .remove-btn { background: #ff4444; color: white; border: none; padding: 4px 8px; cursor: pointer; }
      button { padding: 8px 12px; margin: 5px 0; cursor: pointer; }
      .add-btn { background: #4CAF50; color: white; border: none; }
      .finalize-btn { background: #2196F3; color: white; border: none; }
      #summary { margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc; }
      .form-row { margin-bottom: 8px; }
      .form-row label { display: inline-block; width: 80px; font-size: 11px; }
      .form-row input { width: 100px; padding: 4px; }
      .header { font-weight: bold; margin-bottom: 10px; color: #333; }
      .error { color: red; font-size: 11px; margin-top: 5px; }
    </style>
  </head>
  <body>
    <div class="header">Purchase Line Items</div>
    <div id="line-items-container"></div>
    <button class="add-btn" onclick="addLineItem()">+ Add Item</button>
    
    <div id="summary">
      <div class="header">Overhead Costs</div>
      <div class="form-row">
        <label>Shipping:</label>
        <input type="number" id="shipping" value="0.00" step="0.01">
      </div>
      <div class="form-row">
        <label>Taxes/Fees:</label>
        <input type="number" id="taxes" value="0.00" step="0.01">
      </div>
    </div>

    <button class="finalize-btn" onclick="finalize()" id="finalizeBtn">Finalize Purchase</button>
    <button onclick="google.script.host.close()">Close</button>
    
    <div id="error-message" class="error"></div>

    <script>
      let allItems = [];

      window.addEventListener('load', function() {
        google.script.run
          .withSuccessHandler(onDataReceived)
          .withFailureHandler(showError)
          .getPurchaseDetails('DUMMY_ID');
      });

      function onDataReceived(data) {
        allItems = data.allItems;
        const container = document.getElementById('line-items-container');
        container.innerHTML = '';
        
        if (data.lineItems && data.lineItems.length > 0) {
          data.lineItems.forEach(item => addLineItem(item));
        } else {
          addLineItem();
        }
      }

      function addLineItem(existingItem = null) {
        const container = document.getElementById('line-items-container');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'line-item';
        
        let optionsHtml = '<option value="">Select Item...</option>';
        optionsHtml += allItems.map(item => 
          `<option value="${item.id}" ${existingItem && existingItem.itemId === item.id ? 'selected' : ''}>${item.name} (${item.sku})</option>`
        ).join('');

        itemDiv.innerHTML = `
          <select class="item-select">${optionsHtml}</select>
          <input type="number" class="qty-input" placeholder="Qty" value="${existingItem ? existingItem.quantity : 1}" step="any" min="0.001">
          <input type="number" class="cost-input" placeholder="Unit Cost" value="${existingItem ? existingItem.cost : 0.00}" step="0.01" min="0">
          <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(itemDiv);
      }

      function finalize() {
        const lineItems = [];
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = '';
        
        document.querySelectorAll('.line-item').forEach(div => {
          const select = div.querySelector('.item-select');
          const qtyInput = div.querySelector('.qty-input');
          const costInput = div.querySelector('.cost-input');
          
          if (!select.value) {
            errorDiv.textContent = 'Please select an item for all line items.';
            return;
          }
          
          const quantity = parseFloat(qtyInput.value);
          const cost = parseFloat(costInput.value);
          
          if (isNaN(quantity) || quantity <= 0) {
            errorDiv.textContent = 'Please enter valid quantities for all items.';
            return;
          }
          
          if (isNaN(cost) || cost < 0) {
            errorDiv.textContent = 'Please enter valid costs for all items.';
            return;
          }
          
          const selectedOption = select.options[select.selectedIndex];
          lineItems.push({
            itemId: select.value,
            name: selectedOption.text.split(' (')[0],
            quantity: quantity,
            cost: cost
          });
        });
        
        if (lineItems.length === 0) {
          errorDiv.textContent = 'Please add at least one line item.';
          return;
        }

        const data = {
          purchaseId: 'DUMMY_ID',
          lineItems: lineItems,
          shipping: document.getElementById('shipping').value || '0',
          taxes: document.getElementById('taxes').value || '0'
        };
        
        const btn = document.getElementById('finalizeBtn');
        btn.disabled = true;
        btn.textContent = 'Processing...';

        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .withFailureHandler((error) => {
            showError(error);
            btn.disabled = false;
            btn.textContent = 'Finalize Purchase';
          })
          .finalizePurchase(data);
      }
      
      function showError(error) {
        document.getElementById('error-message').textContent = 'Error: ' + error.message;
      }
    </script>
  </body>
</html>
```

## Comparison with Next.js Application

### Advantages of Google Sheets Implementation
- **Familiar Interface**: Most business users already know spreadsheets
- **No Hosting Required**: Uses Google's infrastructure
- **Collaborative**: Built-in sharing and collaboration features
- **Cost Effective**: No additional software licenses or hosting costs
- **Quick Setup**: Can be operational within hours

### Limitations Compared to Next.js App
- **Performance**: Will slow down with large transaction volumes (>10,000 records)
- **UI Limitations**: Basic HTML sidebars vs. modern React components
- **Scalability**: Google Sheets has row and performance limits
- **Mobile Experience**: Not optimized for mobile use
- **Advanced Features**: Limited compared to full web application

### When to Choose Google Sheets
- Small businesses with <5,000 transactions annually
- Teams comfortable with spreadsheet workflows
- Limited technical resources for web application maintenance
- Need for quick deployment without development cycles
- Budget constraints for custom software solutions

## Installation

1. **Create Google Sheet**: Follow the workbook setup instructions above
2. **Install Scripts**: Copy all Apps Script code from the sections above
3. **Configure Sheets**: Set up all sheet structures and protections
4. **Test Workflows**: Verify purchase, recipe, batch, and sales processes
5. **Train Users**: Provide training on the custom menu and sidebar interfaces

This Google Sheets implementation provides a complete alternative to the Next.js application while maintaining the same core business logic and data integrity principles.
