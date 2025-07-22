# Google Sheets Inventory Hub: Implementation Guide

This document outlines the complete design and setup for the "KIRO Inventory Hub" Google Sheets workbook. It is designed for a small team of trusted users, prioritizing flexibility, ease of correction, and data visibility.

## Core Design Principles

1.  **Controlled Mutability**: Instead of a rigid, immutable log, the system allows for the correction of past mistakes. This is achieved through dedicated scripts that safely reverse and re-apply transactions, ensuring data integrity is maintained.
2.  **Maximum Visibility**: All core data sheets are visible by default. The system relies on cell and sheet protection to prevent accidental edits to critical data, rather than hiding information from users.
3.  **UI-Driven Workflows**: Complex actions, like creating or correcting a purchase, are handled through a custom sidebar UI. This guides the user through the process, validates data, and prevents the errors common with direct cell editing.
4.  **Single Source of Truth**: The `Transactions` sheet serves as the definitive log for every inventory movement. All reports and current stock levels are derived from this log.

---

## Workbook Setup: Step-by-Step

### 1. Create the Workbook
Create a new Google Sheet named **"KIRO Inventory Hub"**.

### 2. Create the Sheets
Create the following tabs (sheets). The order is a suggestion for usability.

**User-Facing Sheets:**
*   `Dashboard`
*   `Purchases`
*   `Item_Dashboard`
*   `Supplier_Dashboard`

**Core Data Sheets:**
*   `Items`
*   `Suppliers`
*   `PurchaseLineItems`
*   `Transactions`
*   `Config`

### 3. Sheet Configuration

#### `Dashboard`
*   **Purpose**: High-level overview of the business.
*   **Setup**: This sheet is for charts, graphs, and key metrics. Use the "Insert > Chart" tool to create visualizations based on data from the `Transactions` and `Items` sheets. Add buttons by going to "Insert > Drawing" and assigning scripts to them (e.g., a "Start New Purchase" button).

#### `Purchases`
*   **Purpose**: A log of all purchase orders.
*   **Columns**:
    *   `A`: `PurchaseID` (Locked)
    *   `B`: `Date` (Editable)
    *   `C`: `Supplier` (Editable, Data Validation from `Suppliers!B:B`)
    *   `D`: `Status` (Locked - e.g., "Draft", "Finalized")
    *   `E`: `Invoice #` (Editable)
    *   `F`: `Shipping Cost` (Editable)
    *   `G`: `Taxes & Fees` (Editable)
    *   `H`: `Total Cost` (Locked - Formula: `=SUM(F:G) + SUMIF(PurchaseLineItems!B:B, A:A, PurchaseLineItems!G:G)`)
    *   `I`: `Notes` (Editable)
*   **Protection**: Protect columns `A`, `D`, and `H` to prevent manual edits.

#### `Items`
*   **Purpose**: The master list of all inventory items.
*   **Columns**:
    *   `A`: `ItemID` (Locked)
    *   `B`: `Name` (Editable)
    *   `C`: `SKU` (Editable)
    *   `D`: `Category` (Editable, Data Validation from `Config!A:A`)
    *   `E`: `Tracking Mode` (Editable, Data Validation from `Config!B:B`)
    *   `F`: `Current Stock` (Locked)
    *   `G`: `Weighted Average Cost` (Locked)
    *   `H`: `Low Stock Threshold` (Editable)
*   **Protection**: Protect columns `A`, `F`, and `G`.

#### `Suppliers`
*   **Purpose**: Master list of suppliers.
*   **Columns**:
    *   `A`: `SupplierID` (Locked)
    *   `B`: `Name` (Editable)
    *   `C`: `Website` (Editable)
    *   `D`: `Payment Terms` (Editable)
*   **Protection**: Protect column `A`.

#### `PurchaseLineItems`
*   **Purpose**: Stores the individual items for every purchase. Managed via the UI.
*   **Columns**:
    *   `A`: `LineItemID`
    *   `B`: `PurchaseID`
    *   `C`: `ItemID`
    *   `D`: `Item Name`
    *   `E`: `Quantity`
    *   `F`: `Unit Cost`
    *   `G`: `Final Line Total` (includes allocated costs)
*   **Protection**: Protect the entire sheet. All edits should be done via the sidebar UI.

#### `Transactions`
*   **Purpose**: The complete, unabridged audit log of all inventory movements.
*   **Columns**:
    *   `A`: `TransactionID`
    *   `B`: `Timestamp`
    *   `C`: `Type` (e.g., 'PURCHASE', 'ADJUSTMENT')
    *   `D`: `ItemID`
    *   `E`: `Item Name`
    *   `F`: `Quantity Change`
    *   `G`: `Value Change`
    *   `H`: `New WAC`
    *   `I`: `Related ID` (e.g., PurchaseID)
    *   `J`: `User`
*   **Protection**: Protect the entire sheet. All edits must go through a scripted tool.

#### `Config`
*   **Purpose**: Stores lists for dropdown menus (Data Validation).
*   **Columns**:
    *   `A`: `Item Categories` (e.g., "Ingredients", "Packaging")
    *   `B`: `Tracking Modes` (e.g., "Full", "Cost-Only")
*   **Protection**: Protect the entire sheet.

#### `Item_Dashboard`
*   **Purpose**: An interactive report to view the full history of a single item.
*   **Setup**:
    *   Cell `A1`: "Select Item:"
    *   Cell `B1`: Create a Data Validation dropdown from the `Items!B:B` range.
    *   Cell `A3`: Place the following formula: `=QUERY(Transactions!A:J, "SELECT * WHERE E = '"&B1&"' ORDER BY B DESC", 1)`
*   **Protection**: Protect the entire sheet except for cell `B1`.

#### `Supplier_Dashboard`
*   **Purpose**: An interactive report to view all purchases from a single supplier.
*   **Setup**:
    *   Cell `A1`: "Select Supplier:"
    *   Cell `B1`: Create a Data Validation dropdown from the `Suppliers!B:B` range.
    *   Cell `A3`: Place the following formula: `=QUERY(Purchases!A:I, "SELECT * WHERE C = '"&B1&"' ORDER BY B DESC", 1)`
*   **Protection**: Protect the entire sheet except for cell `B1`.

---

### 4. Install the Scripts
1.  Go to **Extensions > Apps Script**.
2.  Delete the content of the default `Code.gs` file.
3.  Create the new script and HTML files as detailed in `Google_Sheets_Apps_Script.md`.
4.  Copy and paste the code from that document into the corresponding files in the Apps Script editor.
5.  Save the project.
6.  Reload the workbook. A "KIRO Tools" menu should appear in the menu bar. The first time you run a function, you will need to grant the script permission to access your sheet data.
