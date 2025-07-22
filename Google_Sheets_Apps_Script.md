# Google Sheets Inventory Hub: Apps Script Code

This file contains all the Google Apps Script and HTML code required for the "KIRO Inventory Hub" workbook.

## How to Use
1.  Open your Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Create each file listed below (`UiMenu.gs`, `PurchaseWorkflow.gs`, etc.) using the `+` icon in the editor.
4.  Copy the code from this document into the corresponding file in the Apps Script editor.
5.  Save the project.

---

### File: `UiMenu.gs`
*Purpose: Creates the custom menu in the Google Sheets UI.*

```javascript
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('KIRO Tools')
    .addItem('Create New Purchase', 'createNewPurchase')
    .addItem('Edit Selected Purchase', 'editSelectedPurchase')
    .addSeparator()
    .addItem('Correct Finalized Purchase', 'correctFinalizedPurchase')
    .addToUi();
}

function createNewPurchase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Purchases');
  const newRow = sheet.getLastRow() + 1;
  const purchaseId = 'PID-' + new Date().getTime(); // Simple unique ID
  
  sheet.getRange(newRow, 1).setValue(purchaseId);
  sheet.getRange(newRow, 4).setValue('Draft');
  
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet, true);
  sheet.getRange(newRow, 2).activate();
  
  SpreadsheetApp.getUi().alert('New draft purchase created. Please fill in the details and use "Edit Selected Purchase" to add items.');
}

function editSelectedPurchase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Purchases');
  const activeRow = sheet.getActiveCell().getRow();
  const status = sheet.getRange(activeRow, 4).getValue();
  
  if (status !== 'Draft') {
    SpreadsheetApp.getUi().alert('Only "Draft" purchases can be edited this way. For completed orders, use the "Correct Finalized Purchase" tool.');
    return;
  }
  
  const purchaseId = sheet.getRange(activeRow, 1).getValue();
  
  const html = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle(`Edit Purchase: ${purchaseId}`)
      .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function correctFinalizedPurchase() {
    SpreadsheetApp.getUi().alert('This feature is a work in progress. It will allow you to safely edit a completed purchase by reversing and re-applying the associated transactions.');
    // In a real implementation, this would trigger the complex correction workflow.
}
```

---

### File: `PurchaseWorkflow.gs`
*Purpose: Handles the core logic for fetching data and finalizing purchases.*

```javascript
// This function is called from the sidebar's JavaScript to get data
function getPurchaseDetails(purchaseId) {
  // In a real app, you'd fetch line items associated with the purchaseId
  // For now, we'll return dummy data for demonstration
  const itemsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Items');
  const items = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 2).getValues(); // ID and Name
  
  return {
    lineItems: [
      { id: 'LID-1', itemId: 'ITEM-101', name: 'Flour', quantity: 10, cost: 2.50 },
      { id: 'LID-2', itemId: 'ITEM-102', name: 'Sugar', quantity: 5, cost: 1.75 }
    ],
    allItems: items.map(item => ({id: item[0], name: item[1]}))
  };
}

// This is the main "transactional" function
function finalizePurchase(data) {
  const { purchaseId, lineItems, shipping, taxes } = data;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const transSheet = ss.getSheetByName('Transactions');
    const itemsSheet = ss.getSheetByName('Items');
    const purchasesSheet = ss.getSheetByName('Purchases');

    // 1. Find the purchase row to update its status later
    const purchaseRow = findRowByValue(purchasesSheet, 1, purchaseId);
    if (!purchaseRow) throw new Error('Could not find the purchase.');

    // 2. Calculate total base cost for allocation
    const totalBaseCost = lineItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const totalOverhead = parseFloat(shipping) + parseFloat(taxes);

    // 3. Process each line item
    lineItems.forEach(item => {
      const itemBaseCost = item.quantity * item.cost;
      const allocatedOverhead = (itemBaseCost / totalBaseCost) * totalOverhead;
      const finalLineCost = itemBaseCost + allocatedOverhead;
      
      // Append to Transactions sheet
      const transId = 'TRN-' + new Date().getTime();
      transSheet.appendRow([
        transId,
        new Date(),
        'PURCHASE',
        item.itemId,
        item.name,
        item.quantity,
        finalLineCost,
        'WAC_CALC_PENDING', // WAC calculation is complex and would be another step
        purchaseId,
        Session.getActiveUser().getEmail()
      ]);
      
      // Update stock in Items sheet (simplified)
      // A real version would need to find the item row and update it carefully
    });

    // 4. Update purchase status
    purchasesSheet.getRange(purchaseRow, 4).setValue('Finalized');

    SpreadsheetApp.getUi().alert('Purchase has been finalized successfully!');

  } catch (e) {
    SpreadsheetApp.getUi().alert('An error occurred: ' + e.message);
  } finally {
    lock.releaseLock();
  }
}

// Helper to find a row based on a value in a column
function findRowByValue(sheet, column, value) {
  const data = sheet.getRange(1, column, sheet.getLastRow()).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == value) {
      return i + 1; // Return 1-based row index
    }
  }
  return null;
}
```

---

### File: `Sidebar.html`
*Purpose: The HTML and client-side JavaScript for the purchase editor sidebar.*

```html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: sans-serif; margin: 10px; }
      .line-item { display: flex; gap: 5px; margin-bottom: 5px; }
      .line-item input, .line-item select { flex-grow: 1; }
      button { padding: 8px 12px; margin-top: 10px; }
      #summary { margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc; }
    </style>
  </head>
  <body>
    <h3>Purchase Line Items</h3>
    <div id="line-items-container"></div>
    <button onclick="addLineItem()">+ Add Item</button>
    
    <div id="summary">
      <h4>Overhead Costs</h4>
      <label>Shipping: <input type="number" id="shipping" value="0.00"></label><br>
      <label>Taxes/Fees: <input type="number" id="taxes" value="0.00"></label>
    </div>

    <button onclick="finalize()">Finalize Purchase</button>
    <button onclick="google.script.host.close()">Close</button>

    <script>
      let allItems = [];

      // When the sidebar loads, get data from the server
      window.addEventListener('load', function() {
        google.script.run.withSuccessHandler(onDataReceived).getPurchaseDetails('DUMMY_ID');
      });

      function onDataReceived(data) {
        allItems = data.allItems;
        const container = document.getElementById('line-items-container');
        // Clear existing
        container.innerHTML = '';
        // Populate with existing line items (if any)
        // For now, we'll just add one blank one to start
        addLineItem();
      }

      function addLineItem() {
        const container = document.getElementById('line-items-container');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'line-item';
        
        let optionsHtml = allItems.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

        itemDiv.innerHTML = `
          <select class="item-select">${optionsHtml}</select>
          <input type="number" class="item-qty" placeholder="Qty" value="1">
          <input type="number" class="item-cost" placeholder="Unit Cost" value="0.00">
          <button onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(itemDiv);
      }

      function finalize() {
        const lineItems = [];
        document.querySelectorAll('.line-item').forEach(div => {
          const select = div.querySelector('.item-select');
          lineItems.push({
            itemId: select.value,
            name: select.options[select.selectedIndex].text,
            quantity: parseFloat(div.querySelector('.item-qty').value),
            cost: parseFloat(div.querySelector('.item-cost').value)
          });
        });

        const data = {
          purchaseId: 'DUMMY_ID', // Would get this from the server
          lineItems: lineItems,
          shipping: document.getElementById('shipping').value,
          taxes: document.getElementById('taxes').value
        };
        
        // Disable button to prevent double-clicks
        this.disabled = true;
        this.textContent = 'Processing...';

        google.script.run.withSuccessHandler(() => {
          google.script.host.close();
        }).finalizePurchase(data);
      }
    </script>
  </body>
</html>
```
