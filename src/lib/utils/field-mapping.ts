/**
 * Field mapping utilities for consistent database field naming
 * Database uses lowercase (itemid), TypeScript uses camelCase (itemId)
 */

/**
 * Maps TypeScript camelCase fields to database lowercase fields
 */
export const toDatabaseFields = <T extends Record<string, any>>(obj: T): T => {
  const mapped: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const dbKey = camelToDatabase(key);
    mapped[dbKey] = value;
  }
  
  return mapped;
};

/**
 * Maps database lowercase fields to TypeScript camelCase fields
 */
export const fromDatabaseFields = <T extends Record<string, any>>(obj: T): T => {
  const mapped: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const tsKey = databaseToCamel(key);
    mapped[tsKey] = value;
  }
  
  return mapped;
};

/**
 * Convert camelCase to database lowercase format
 * Examples: itemId -> itemid, purchaseId -> purchaseid
 */
export const camelToDatabase = (field: string): string => {
  // Common field mappings
  const mappings: Record<string, string> = {
    itemId: 'itemid',
    itemIds: 'itemids',
    purchaseId: 'purchaseid',
    purchaseIds: 'purchaseids',
    supplierId: 'supplierid',
    supplierIds: 'supplierids',
    recipeId: 'recipeid',
    recipeIds: 'recipeids',
    batchId: 'batchid',
    batchIds: 'batchids',
    templateId: 'templateid',
    templateIds: 'templateids',
    transactionId: 'transactionid',
    transactionIds: 'transactionids',
    lineItemId: 'lineitemid',
    lineItemIds: 'lineitemids',
    currentQuantity: 'currentquantity',
    primarySupplierId: 'primarysupplierid',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    trackingMode: 'tracking_mode',
    alertType: 'alert_type',
    alertMessage: 'alert_message',
    weightedAverageCost: 'weightedaveragecost',
    displayId: 'displayid',
    lowStockThreshold: 'lowstockthreshold',
    isCostAddedProduct: 'iscostaddedproduct',
    isNonInventory: 'isnoninventory',
    taxAllocated: 'tax_allocated',
    shippingAllocated: 'shipping_allocated',
    expenseAllocated: 'expense_allocated',
    unitPrice: 'unit_price',
    unitCost: 'unit_cost',
    salesPeriodId: 'salesperiodid',
    scaleFactor: 'scalefactor',
  };
  
  return mappings[field] || field;
};

/**
 * Convert database lowercase format to camelCase
 * Examples: itemid -> itemId, purchaseid -> purchaseId
 */
export const databaseToCamel = (field: string): string => {
  // Reverse mapping
  const mappings: Record<string, string> = {
    itemid: 'itemId',
    itemids: 'itemIds',
    purchaseid: 'purchaseId',
    purchaseids: 'purchaseIds',
    supplierid: 'supplierId',
    supplierids: 'supplierIds',
    recipeid: 'recipeId',
    recipeids: 'recipeIds',
    batchid: 'batchId',
    batchids: 'batchIds',
    templateid: 'templateId',
    templateids: 'templateIds',
    transactionid: 'transactionId',
    transactionids: 'transactionIds',
    lineitemid: 'lineItemId',
    lineitemids: 'lineItemIds',
    currentquantity: 'currentQuantity',
    primarysupplierid: 'primarySupplierId',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    tracking_mode: 'trackingMode',
    alert_type: 'alertType',
    alert_message: 'alertMessage',
    weightedaveragecost: 'weightedAverageCost',
    displayid: 'displayId',
    lowstockthreshold: 'lowStockThreshold',
    iscostaddedproduct: 'isCostAddedProduct',
    isnoninventory: 'isNonInventory',
    tax_allocated: 'taxAllocated',
    shipping_allocated: 'shippingAllocated',
    expense_allocated: 'expenseAllocated',
    unit_price: 'unitPrice',
    unit_cost: 'unitCost',
    salesperiodid: 'salesPeriodId',
    scalefactor: 'scaleFactor',
  };
  
  return mappings[field] || field;
};

/**
 * Type-safe field mapper for specific entity types
 */
export const fieldMappers = {
  item: {
    toDb: (item: any) => ({
      ...item,
      itemid: item.itemId || item.itemid,
      primarysupplierid: item.primarySupplierId || item.primarysupplierid,
      currentquantity: item.currentQuantity || item.currentquantity,
      tracking_mode: item.trackingMode || item.tracking_mode,
      weightedaveragecost: item.weightedAverageCost || item.weightedaveragecost,
      lowstockthreshold: item.lowStockThreshold || item.lowstockthreshold,
      iscostaddedproduct: item.isCostAddedProduct || item.iscostaddedproduct,
      created_at: item.createdAt || item.created_at,
      updated_at: item.updatedAt || item.updated_at,
    }),
    fromDb: (item: any) => ({
      ...item,
      itemId: item.itemid,
      primarySupplierId: item.primarysupplierid,
      currentQuantity: item.currentquantity,
      trackingMode: item.tracking_mode,
      weightedAverageCost: item.weightedaveragecost,
      lowStockThreshold: item.lowstockthreshold,
      isCostAddedProduct: item.iscostaddedproduct,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }),
  },
  purchase: {
    toDb: (purchase: any) => ({
      ...purchase,
      purchaseid: purchase.purchaseId || purchase.purchaseid,
      supplierid: purchase.supplierId || purchase.supplierid,
      displayid: purchase.displayId || purchase.displayid,
      tax_allocated: purchase.taxAllocated || purchase.tax_allocated,
      shipping_allocated: purchase.shippingAllocated || purchase.shipping_allocated,
      expense_allocated: purchase.expenseAllocated || purchase.expense_allocated,
      created_at: purchase.createdAt || purchase.created_at,
      updated_at: purchase.updatedAt || purchase.updated_at,
    }),
    fromDb: (purchase: any) => ({
      ...purchase,
      purchaseId: purchase.purchaseid,
      supplierId: purchase.supplierid,
      displayId: purchase.displayid,
      taxAllocated: purchase.tax_allocated,
      shippingAllocated: purchase.shipping_allocated,
      expenseAllocated: purchase.expense_allocated,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at,
    }),
  },
  supplier: {
    toDb: (supplier: any) => ({
      ...supplier,
      supplierid: supplier.supplierId || supplier.supplierid,
      created_at: supplier.createdAt || supplier.created_at,
      updated_at: supplier.updatedAt || supplier.updated_at,
    }),
    fromDb: (supplier: any) => ({
      ...supplier,
      supplierId: supplier.supplierid,
      createdAt: supplier.created_at,
      updatedAt: supplier.updated_at,
    }),
  },
};