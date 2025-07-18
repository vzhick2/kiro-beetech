# Implementation Plan

- [x] 1. Set up project structure and navigation layout





  - [x] 1.1 Create Next.js project foundation


    - Initialize Next.js 14+ project with TypeScript and required dependencies
    - Set up shadcn/ui components and Tailwind CSS configuration
    - Configure TanStack Query, Zustand, and TanStack Table
    - Create Supabase client setup and environment configuration
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Build main application layout and navigation


    - Create AppLayout component with sidebar navigation (desktop) and bottom nav (mobile)
    - Build navigation menu with sections: Dashboard, Items, Purchases, Recipes, Batches, Sales, Reports
    - Implement responsive navigation: collapsible sidebar on desktop, hamburger menu on mobile
    - Add command palette (Cmd+K) for quick navigation and actions
    - Create breadcrumb navigation for deep pages (e.g., Recipe → Recipe Detail → Edit)
    - _Requirements: 4.1, 4.4_

  - [x] 1.3 Define core TypeScript interfaces and utilities



    - Create comprehensive interfaces for Items, Purchases, Recipes, Batches, Suppliers
    - Define business logic interfaces: CycleCountAlert, ForecastingData, BusinessError
    - Build utility functions: display ID generation, date formatting, unit conversions
    - Create validation schemas using Zod for form validation and API responses
    - _Requirements: 1.1, 1.2_

- [ ] 2. Implement database schema and core functions
  - [ ] 2.1 Create complete database schema in Supabase
    - Execute all CREATE TABLE statements for items, suppliers, purchases, etc.
    - Create enums for item_type, inventory_unit, and transaction_type
    - Set up foreign key relationships and constraints
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 2.2 Implement core business logic functions
    - Create calculate_wac function for weighted average cost calculation
    - Implement get_cycle_count_alerts function with priority scoring
    - Create calculate_forecasting function with automatic mode checking
    - Write unit tests for all business logic functions
    - _Requirements: 2.2, 2.3, 3.2_

- [ ] 3. Build core data management components
  - [ ] 3.1 Create Items management page with table view
    - Build full-page ItemsTable with header containing: search bar, type filter dropdown, "Add Item" button
    - Create table columns: SKU, Name, Type, Current Qty, Unit, WAC, Reorder Point, Last Counted, Actions
    - Implement inline quantity editing: click quantity → input field with +/- buttons and save/cancel
    - Add row actions dropdown: Edit, Archive, Quick Reorder, Manual Count
    - Create "Add Item" modal with form fields: name, SKU, type, unit, initial quantity, reorder point
    - Build item detail modal showing: full item info, recent transactions, forecasting data
    - Add mobile responsive: stack columns, expandable rows, swipe actions for edit/archive
    - _Requirements: 1.2, 1.3, 2.1_

  - [ ] 3.2 Create Suppliers management page
    - Build suppliers list page with table: Name, Contact Email, Phone, Active Purchases, Actions
    - Create "Add Supplier" button opening modal with fields: name, email, phone, address, notes
    - Implement supplier detail view showing: contact info, purchase history, edit/archive actions
    - Add supplier selection component for purchase forms: searchable dropdown with contact preview
    - Build supplier edit modal with same fields as creation plus archive toggle
    - _Requirements: 1.1, 2.1_

- [ ] 4. Build purchase management workflow
  - [ ] 4.1 Create Purchase Inbox component with master-detail layout
    - Build desktop layout: left sidebar with purchase list, right panel with selected purchase details
    - Create mobile layout: single-column view with purchase list → detail navigation
    - Implement purchase list with columns: displayId, supplier, date, total, status (draft/completed)
    - Add purchase detail panel showing: supplier info, dates, totals, line items table
    - Include CSV import button in header with file upload and supplier matching workflow
    - _Requirements: 1.1, 1.4, 2.1, 2.4_

  - [ ] 4.2 Implement CSV import and draft purchase workflow
    - Create CSV upload modal with drag-drop and file selection
    - Build supplier matching interface: auto-match by name, manual selection for unmatched
    - Implement draft purchase creation with editable header fields (supplier, dates, totals)
    - Add line item completion workflow: map CSV rows to inventory items with quantity/cost editing
    - Create purchase approval flow: review → finalize → inventory update trigger
    - _Requirements: 1.1, 1.4, 2.1, 2.4_

  - [ ] 4.3 Build purchase line items management interface
    - Create line items table within purchase detail panel
    - Add columns: item name/SKU, quantity, unit cost, total cost, notes
    - Implement inline editing for quantity and cost with real-time total updates
    - Build item selection dropdown with search and filtering by type
    - Add cost allocation logic that excludes non-inventory items from WAC calculation
    - Include validation for purchase totals matching line item sums
    - _Requirements: 1.1, 2.1, 2.2_

- [ ] 5. Build recipe and batch management system
  - [ ] 5.1 Create Recipe Manager page with list and detail views
    - Build recipes list page with table: Name, Version, Output Product, Expected Yield, Actions
    - Create "Add Recipe" button opening modal with fields: name, output product selection, expected yield
    - Implement recipe detail view with two sections: recipe info header + ingredients table below
    - Build ingredients table with columns: Item Name/SKU, Quantity, Unit, Notes, Actions (edit/remove)
    - Add "Add Ingredient" button opening item selection modal with quantity input
    - Create recipe scaling interface: scale factor input with real-time ingredient quantity updates
    - Implement recipe versioning: "Edit Recipe" creates new version, preserves old versions
    - Add "Max Batches" calculator showing how many batches possible with current inventory
    - Build batch template creation: "Save as Template" with template name and scale factor
    - _Requirements: 1.5, 3.1, 3.3_

  - [ ] 5.2 Create Batch Logger page with creation workflow
    - Build batch creation page with recipe selection dropdown and template options
    - Create batch form with fields: recipe, scale factor, expected quantity, effective date, notes
    - Add ingredient requirements preview table showing: item, required qty, available qty, shortage warnings
    - Implement "Proceed with Negatives" option for insufficient inventory scenarios
    - Build batch execution interface: confirm ingredient consumption → create batch → update inventory
    - Create batch history table with columns: Batch ID, Recipe, Date, Qty Made, Yield %, Cost Variance
    - Add batch detail modal showing: full batch info, ingredient consumption, cost breakdown, yield analysis
    - Implement yield percentage calculation: (actual output / expected output) × 100
    - Build cost variance tracking: compare actual material cost vs projected recipe cost
    - _Requirements: 1.5, 3.1, 3.3_

- [ ] 6. Create main Dashboard with Action Center
  - [ ] 6.1 Build 30-second business health check dashboard
    - Create dashboard layout with 4 main sections: Alerts, Quick Actions, Key Metrics, Recent Activity
    - Build Cycle Count Alerts card showing top 5 items with: SKU, name, current qty, shortage amount, "Count Now" button
    - Add Quick Actions section with buttons: "Add Purchase", "Log Batch", "Quick Adjustment", "Export Data"
    - Create Key Metrics cards showing: Total Items, Low Stock Count, Recent Purchases, This Month's Batches
    - Build Recent Activity feed showing: latest purchases, batches, adjustments with timestamps
    - Add mobile optimization: stack cards vertically, touch targets ≥44px, swipe for more actions
    - _Requirements: 2.2, 2.3, 4.1_

  - [ ] 6.2 Implement cycle count alert system and priority scoring
    - Build alert priority algorithm: (days since last count / 30) + (1 - current qty / reorder point)
    - Create alert types: NEGATIVE_INVENTORY (red), LOW_STOCK (yellow), OVERDUE_COUNT (blue)
    - Add alert filtering in ItemsTable: "Show Alerts Only" toggle, sort by priority score
    - Build manual cycle count modal: item selection, actual count input, variance calculation, notes
    - Implement count logging: update item quantity, record transaction, reset lastCountedDate
    - _Requirements: 2.2, 2.3_

- [ ] 7. Build forecasting and reorder point management
  - [ ] 7.1 Create forecasting calculation and display system
    - Implement automatic forecasting: 3-month sales average, seasonal adjustment, 20% buffer
    - Build forecasting data table showing: item, predicted demand, seasonal index, recommended reorder point
    - Create manual vs automatic toggle: "Auto" badge (green) vs "Manual" badge (blue) in ItemsTable
    - Add forecasting detail modal: sales history chart, seasonal trends, calculation breakdown
    - Implement forecasting trigger: run calculations monthly or on-demand via dashboard button
    - _Requirements: 2.2, 2.3, 3.2_

  - [ ] 7.2 Build quick reorder and supplier integration
    - Add "Quick Reorder" buttons in ItemsTable for items below reorder point
    - Create quick reorder modal: item info, suggested quantity, supplier selection, estimated cost
    - Build reorder suggestions based on: lead time, seasonal trends, recent usage patterns
    - Add bulk reorder functionality: select multiple low-stock items, create single purchase draft
    - _Requirements: 2.2, 2.3, 3.2_

- [ ] 8. Create sales tracking and reporting system
  - [ ] 8.1 Build sales data import and management
    - Create Sales page with table: Item, Period Start, Period End, Qty Sold, Revenue, Actions
    - Add "Import Sales" button opening CSV upload modal with column mapping interface
    - Build sales period form: item selection, date range picker, quantity sold, revenue inputs
    - Implement sales data validation: check for overlapping periods, negative quantities
    - Create sales history view per item: timeline chart showing sales trends over time
    - _Requirements: 2.2, 2.4_

  - [ ] 8.2 Build basic reporting and export functionality
    - Create Reports page with sections: Inventory Summary, Sales Analysis, Cost Analysis
    - Build Inventory Summary: total value, items by type, low stock count, negative inventory alerts
    - Add Sales Analysis: top selling items, revenue trends, seasonal patterns
    - Create Cost Analysis: WAC trends, purchase cost analysis, margin calculations
    - Implement export functionality: CSV export for all data tables, date range filtering
    - Add "Export Recent Changes" showing all transactions from last 30 days
    - _Requirements: 2.4, 4.1_

- [ ] 9. Implement transaction logging and audit trail
  - [ ] 9.1 Create comprehensive transaction logging system
    - Build transaction history page with table: Date, Type, Item, Quantity, Reference, User, Notes
    - Add transaction filtering: by date range, transaction type, item, user
    - Create transaction detail modal showing: full transaction info, before/after quantities, related records
    - Implement search functionality: by item SKU/name, reference ID, notes content
    - _Requirements: 1.3, 1.4, 4.2_

  - [ ] 9.2 Build transaction editing and audit capabilities
    - Add transaction editing interface with approval workflow for corrections
    - Implement audit trail showing: who made changes, when, what changed, why (notes)
    - Create transaction reversal functionality for purchase/batch corrections
    - Build "Recent Changes" view showing last 30 days of all inventory movements
    - _Requirements: 1.3, 1.4, 4.2_

- [ ] 10. Build error handling and validation system
  - [ ] 10.1 Implement standardized error handling
    - Create BusinessError types and error handling utilities
    - Build inline validation with clear resolution steps
    - Implement negative inventory warnings that allow proceeding
    - Add network error retry mechanisms with user feedback
    - _Requirements: 4.3, 4.4_

  - [ ] 10.2 Create alert and notification system
    - Build customizable notification rules interface
    - Implement Supabase Edge Functions for email delivery
    - Create in-app notification system with real-time updates
    - Add alert configuration for different event types
    - _Requirements: 2.3, 4.3_

- [ ] 11. Implement mobile-first responsive design
  - Create mobile-optimized layouts for all major components
  - Implement touch-friendly interactions with proper target sizes
  - Build expandable rows and swipe actions for mobile tables
  - Add responsive navigation with mobile hamburger menu
  - Test and optimize performance on mobile devices
  - _Requirements: 4.1, 4.4_

- [ ] 12. Add data import/export functionality
  - Build CSV export for all major data entities
  - Create data backup and restore functionality
  - Implement bulk data import with validation and error reporting
  - Add export scheduling and automated backup options
  - _Requirements: 2.4, 4.2_

- [ ] 13. Implement authentication and security
  - Set up Supabase authentication with email/password
  - Implement row-level security policies for multi-user access
  - Create user management interface for business owners
  - Add session management and secure logout functionality
  - _Requirements: 4.3, 4.4_

- [ ] 14. Create comprehensive testing suite
  - [ ] 14.1 Write unit tests for business logic
    - Test WAC calculations with various purchase scenarios
    - Test forecasting algorithms with mock sales data
    - Test cycle count alert priority scoring
    - Test cost allocation logic with edge cases
    - _Requirements: All requirements validation_

  - [ ] 14.2 Implement integration tests
    - Test complete purchase workflow from CSV import to inventory update
    - Test batch creation workflow with ingredient consumption
    - Test forecasting calculation and reorder point updates
    - Test error handling and recovery scenarios
    - _Requirements: All requirements validation_

- [ ] 15. Add real-time updates and offline capabilities
  - [ ] 15.1 Implement Supabase real-time subscriptions
    - Set up real-time listeners for inventory quantity changes
    - Add live updates for cycle count alerts and low stock notifications
    - Implement real-time purchase status updates for collaborative editing
    - Create live activity feed showing other users' actions
    - _Requirements: 4.1, 4.4_

  - [ ] 15.2 Build offline-first mobile experience
    - Implement service worker for offline functionality
    - Add local storage for critical data caching
    - Create offline queue for actions (purchases, adjustments, counts)
    - Build sync mechanism when connection is restored
    - _Requirements: 4.1, 4.4_

- [ ] 16. Create user onboarding and setup experience
  - [ ] 16.1 Build first-time setup wizard
    - Create welcome screen with business setup (name, currency, units)
    - Add sample data import option for demo/testing
    - Build guided tour of main features with interactive tooltips
    - Create initial supplier and item setup workflow
    - _Requirements: 4.4_

  - [ ] 16.2 Add help system and documentation
    - Build in-app help tooltips and contextual guidance
    - Create keyboard shortcuts reference (accessible via ?)
    - Add feature discovery notifications for new functionality
    - Build troubleshooting guides for common issues
    - _Requirements: 4.4_

- [ ] 17. Performance optimization and deployment preparation
  - Optimize database queries and add appropriate indexes
  - Implement caching strategies for frequently accessed data
  - Add loading states and skeleton loaders for better UX
  - Prepare production deployment configuration for Vercel
  - Set up monitoring and error tracking (Sentry/similar)
  - _Requirements: 4.1, 4.4_