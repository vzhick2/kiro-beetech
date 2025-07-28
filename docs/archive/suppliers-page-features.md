# Suppliers Page: Features & Design Choices

## Core Features

- **Modern Data Table (TanStack Table v8)**
  - All supplier fields are presented as columns (no expandable rows).
  - Columns: Supplier Name, Website, Phone, Email, Address, Notes, Status, Created Date.
  - Column visibility is user-configurable via a gear icon dropdown (ViewOptionsPanel).
  - "Supplier Name" is always visible (cannot be hidden).

- **Column Visibility Management**
  - Users can toggle columns on/off instantly via checkboxes in the ViewOptionsPanel.
  - Column visibility state is managed and synced with TanStack Table’s native system.
  - Only columns with `enableHiding: true` can be toggled.

- **ViewOptionsPanel (Gear Icon Dropdown)**
  - Notion-inspired dropdown with checkboxes for columns, density selector, and inactive toggle.
  - "Include inactive suppliers" toggle for showing/hiding archived suppliers.
  - Responsive, mobile-friendly design.

- **SmartCell Component**
  - All table cells use a single adaptive component for rendering.
  - Handles text, multiline, website, phone, email, and status types.
  - Density-aware truncation and tooltips for overflow content.

- **Row Editing**
  - Inline editing for all fields (no modal or expanding row).
  - "Add new supplier" row at the top for quick entry.
  - Edit/save/cancel actions for each row.
  - Optimistic updates with React Query.

- **Selection and Bulk Actions**
  - Checkbox in header for "select all" on current page.
  - Row selection for bulk actions (archive, delete, export, etc.).
  - Floating controls for bulk actions and spreadsheet mode.

- **Search and Filtering**
  - Search bar filters suppliers by all visible fields.

- **Pagination**
  - Pagination controls at the bottom of the table.
  - Page size selector and navigation.

- **Loading and Empty States**
  - Loading spinner and message when fetching data.

- **Responsive Design**
  - Mobile-first layout with touch-friendly controls.
  - Table and controls adapt to screen size.

---

## Design Choices

- **No Expanding Rows**
  - All data is visible in columns; no hidden details or row expansion.

- **Gear Icon for View Options**
  - Space-efficient, familiar UI pattern for column and display controls.

- **Notion-Inspired Dropdown**
  - Clean, modern, and visually consistent with popular productivity tools.

- **Forgiving Validation**
  - Designed for fast workshop entry; validation is efficient, not strict.

- **Performance Optimizations**
  - React.memo and useCallback used for key components.
  - useMemo for columns and data to avoid unnecessary re-renders.

- **Batch Operations**
  - Designed for high-efficiency workflows (bulk select, edit, archive, etc.).

- **Visual Feedback**
  - Immediate UI updates for column toggles, edits, and actions.

Spreadsheet Mode on this suppliers page allows users to rapidly edit multiple supplier rows in a grid-like, Excel-style interface. When activated:

All rows become editable at once, with input fields replacing display cells.
Users can navigate between cells using the keyboard (Tab, Enter, arrow keys).
Bulk changes can be made quickly without opening individual row editors.
There are controls to save all changes at once or cancel/revert edits.
Visual cues (such as row highlighting) indicate which rows have unsaved changes.
Designed for high-efficiency data entry and correction, especially useful for batch updates in workshop/field scenarios.