1.  **~~Potential Race Condition in `updateItemQuantity`~~ - RESOLVED:** ✅
    *   **Resolution:** Updated API to use atomic database operations with `update_item_quantity_atomic` RPC
    *   **Change:** Function now accepts `quantityChange` (±N) instead of `newQuantity` and uses atomic `UPDATE items SET current_quantity = current_quantity + ?` operation
    *   **Implementation:** Added new RPC function in `api-documentation.md` and updated server action specification

2.  **WAC Calculation on Historical Edits:** The "mutable logs" concept is great for flexibility.
    *   **Observation:** The `calculate_wac` function correctly uses all non-draft purchase history.
    *   **Question for the Future:** What is the desired behavior if a user edits a purchase from six months ago? Technically, this could alter the WAC for every transaction that followed. For an internal app, the current approach of on-demand calculation is likely sufficient, but it's worth being aware of this accounting nuance. You might consider adding a "recalculate WAC history" utility down the line if needed.

3.  **~~Schema Consistency in `suppliers` table~~ - RESOLVED:** ✅
    *   **Resolution:** Synchronized supplier schema across all documentation files
    *   **Standardized Schema:** All documents now use: `name`, `storeUrl`, `phone`, `isArchived`, `created_at`
    *   **Files Updated:** `technical-design.md` schema aligned with `data-model.md` specification

4.  **Explicit Testing for RPCs:** The `development-guide.md` mentions testing with Vitest for critical business logic, which is perfect.
    *   **Suggestion:** As you implement the core business logic functions in `tasks.md` (Task 2.2), consider writing tests for these RPCs early. Supabase has guides on testing functions, and confirming that `get_cycle_count_alerts` and `calculate_wac` handle edge cases (like no purchase history or division by zero) will build even more confidence in the data integrity.