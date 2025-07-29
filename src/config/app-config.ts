/**
 * BTINV Application Configuration
 * Single source of truth for all app-wide settings and constants
 * 
 * PHILOSOPHY:
 * - Static configurations that rarely change go here
 * - User preferences (column visibility, themes) stay in localStorage/settings UI
 * - Business logic constants centralized for easy maintenance
 */

// =============================================================================
// TABLE CONFIGURATIONS
// =============================================================================

export const tableConfigs = {
  suppliers: {
    tableName: 'suppliers',
    displayName: 'Suppliers',
    columns: {
      supplierid: { 
        label: 'ID', 
        visible: false,  // UUIDs hidden by default
        required: false, 
        type: 'uuid' as const
      },
      name: { 
        label: 'Name', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      contactphone: { 
        label: 'Phone', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      website: { 
        label: 'Website', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      email: { 
        label: 'Email', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      address: { 
        label: 'Address', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      notes: { 
        label: 'Notes', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      isarchived: { 
        label: 'Status', 
        visible: false, // Controlled by includeInactive toggle
        required: false, 
        type: 'boolean' as const
      },
      created_at: { 
        label: 'Created Date', 
        visible: false, // Usually not needed
        required: false, 
        type: 'date' as const
      },
    }
  },
  
  items: {
    tableName: 'items',
    displayName: 'Items',
    columns: {
      itemid: { 
        label: 'Item ID', 
        visible: false, 
        required: false, 
        type: 'uuid' as const
      },
      name: { 
        label: 'Item Name', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      sku: { 
        label: 'SKU', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      type: { 
        label: 'Type', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      tracking_mode: { 
        label: 'Tracking Mode', 
        visible: true, 
        required: false, 
        type: 'text' as const
      },
      currentquantity: { 
        label: 'Quantity', 
        visible: true, 
        required: false, 
        type: 'number' as const
      },
      weightedaveragecost: { 
        label: 'WAC', 
        visible: true, 
        required: false, 
        type: 'currency' as const
      },
      reorderpoint: { 
        label: 'Reorder Point', 
        visible: true, 
        required: false, 
        type: 'number' as const
      },
      isarchived: { 
        label: 'Status', 
        visible: false, 
        required: false, 
        type: 'boolean' as const
      },
    }
  },
  
  purchases: {
    tableName: 'purchases',
    displayName: 'Purchase Orders',
    columns: {
      purchaseid: { 
        label: 'Purchase ID', 
        visible: false, 
        required: false, 
        type: 'uuid' as const
      },
      displayid: { 
        label: 'PO Number', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      supplierid: { 
        label: 'Supplier', 
        visible: true, 
        required: true, 
        type: 'text' as const
      },
      purchasedate: { 
        label: 'Purchase Date', 
        visible: true, 
        required: true, 
        type: 'date' as const
      },
      total: { 
        label: 'Total', 
        visible: true, 
        required: false, 
        type: 'currency' as const
      },
      isdraft: { 
        label: 'Status', 
        visible: true, 
        required: false, 
        type: 'boolean' as const
      },
    }
  }
} as const;

// =============================================================================
// DISPLAY & UI SETTINGS
// =============================================================================

export const displaySettings = {
  // Date format patterns
  dateFormat: 'MM/DD/YYYY' as const,
  dateFormatShort: 'MM/DD/YY' as const,
  
  // Currency formatting
  currencyFormat: {
    locale: 'en-US' as const,
    currency: 'USD' as const,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  
  // Number formatting
  numberFormat: {
    locale: 'en-US' as const,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  
  // Density modes with dimensions
  densityModes: {
    compact: {
      label: 'Compact',
      rowHeight: '44px',
      headerHeight: '48px',
      lineHeight: '1.3',
      maxLines: 1,
      characterLimits: {
        short: 40,
        medium: 50,
        long: 60,
      }
    },
    normal: {
      label: 'Normal', 
      rowHeight: '56px',
      headerHeight: '60px',
      lineHeight: '1.4',
      maxLines: 2,
      characterLimits: {
        short: 80,
        medium: 100,
        long: 120,
      }
    },
    comfortable: {
      label: 'Comfortable',
      rowHeight: '72px', 
      headerHeight: '76px',
      lineHeight: '1.4',
      maxLines: 3,
      characterLimits: {
        short: 120,
        medium: 150,
        long: 200,
      }
    }
  },
  
  // Default UI settings
  defaults: {
    densityMode: 'normal' as const,
    pageSize: 50,
    includeInactive: false,
  }
} as const;

// =============================================================================
// BUSINESS LOGIC CONSTANTS
// =============================================================================

export const businessRules = {
  // Inventory tracking
  inventory: {
    defaultTrackingMode: 'fully_tracked' as const,
    negativeInventoryAllowed: true,
    defaultLeadTimeDays: 7,
  },
  
  // Low stock thresholds by item type
  lowStockThresholds: {
    ingredient: 10,
    packaging: 5, 
    product: 3,
  },
  
  // Display ID generation patterns
  displayIdPatterns: {
    purchase: {
      prefix: 'PO-',
      dateFormat: 'YYYYMMDD', // Used in generatePurchaseDisplayId
      randomDigits: 3,
    },
    batch: {
      prefix: 'BATCH-',
      dateFormat: 'YYYYMMDD', // Used in generateBatchDisplayId  
      randomDigits: 3,
    },
    supplier: {
      prefix: 'SUP-',
      dateFormat: 'YYYYMMDD',
      randomDigits: 3,
    }
  },
  
  // Cycle count and alerting
  alerts: {
    cycleCountScoring: {
      maxDaysScore: 10, // Cap at 10 points
      daysDivisor: 30,  // daysSinceCount / 30
      stockScores: {
        outOfStock: 5,
        belowReorder: 3,
        normal: 1,
      }
    },
    duplicateDetection: {
      similarityThreshold: 0.8, // Used in formatting.ts
    }
  },
  
  // Weighted Average Cost calculation
  wac: {
    decimalPlaces: 4, // Internal precision
    displayDecimalPlaces: 2, // UI display
    roundingMode: 'round' as const, // 'round' | 'floor' | 'ceil'
  }
} as const;

// =============================================================================
// PAGINATION & LIMITS
// =============================================================================

export const paginationSettings = {
  // Default page sizes for different contexts
  pageSizes: {
    dashboard: {
      cycleCountAlerts: 5,
      recentActivity: 10, 
      recentActivityHomepage: 6, // Different on homepage
    },
    tables: {
      default: 50,
      minimum: 10,
      maximum: 100,
      options: [10, 20, 50, 100] as const,
    },
    previews: {
      csvImport: 10, // First 10 rows for preview
      csvPreview: 500, // Characters for content preview
      transactionHistory: 10, // In item detail modal
    },
    infiniteScroll: {
      initialLimit: 20,
      pageSize: 50,
    }
  }
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const featureFlags = {
  // Major features
  enableBulkOperations: true,
  enableMobileMode: true, 
  enableAdvancedFilters: true,
  
  // Experimental features
  enableExperimentalFeatures: false,
  enableDebugMode: false,
  
  // Table features
  enableColumnReordering: false, // Future feature
  enableColumnResizing: true,
  enableRowGrouping: false, // Future feature
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Extract types for use throughout the app
export type TableName = keyof typeof tableConfigs;
export type DensityMode = keyof typeof displaySettings.densityModes;
export type TrackingMode = typeof businessRules.inventory.defaultTrackingMode | 'cost_added';
export type ItemType = 'ingredient' | 'packaging' | 'product';

// Column configuration type  
export type ColumnConfig = {
  label: string;
  visible: boolean;
  required: boolean;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'uuid';
};

// Helper type for getting column keys for a specific table
export type ColumnKeys<T extends TableName> = keyof typeof tableConfigs[T]['columns'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get column configuration for a specific table
 */
export function getTableConfig<T extends TableName>(tableName: T) {
  return tableConfigs[tableName];
}

/**
 * Get default column visibility for a table
 */
export function getDefaultColumnVisibility<T extends TableName>(tableName: T) {
  const config = tableConfigs[tableName];
  const visibility: Record<string, boolean> = {};
  
  Object.entries(config.columns).forEach(([key, column]) => {
    visibility[key] = column.visible;
  });
  
  return visibility;
}

/**
 * Get user-friendly column label  
 */
export function getColumnLabel<T extends TableName>(
  tableName: T, 
  columnKey: ColumnKeys<T>
) {
  return (tableConfigs[tableName].columns as any)[columnKey]?.label || columnKey;
}

/**
 * Format currency using app settings
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(
    displaySettings.currencyFormat.locale,
    {
      style: 'currency',
      currency: displaySettings.currencyFormat.currency,
      minimumFractionDigits: displaySettings.currencyFormat.minimumFractionDigits,
      maximumFractionDigits: displaySettings.currencyFormat.maximumFractionDigits,
    }
  ).format(amount);
}

/**
 * Format number using app settings
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat(
    displaySettings.numberFormat.locale,
    displaySettings.numberFormat
  ).format(num);
}

// =============================================================================
// VALIDATION
// =============================================================================

// Runtime validation to ensure config consistency
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Validate that all required columns are marked as visible by default
  Object.entries(tableConfigs).forEach(([tableName, config]) => {
    Object.entries(config.columns).forEach(([columnKey, column]) => {
      if (column.required && !column.visible) {
        console.warn(
          `⚠️ Config Warning: Required column '${columnKey}' in table '${tableName}' is not visible by default`
        );
      }
    });
  });
}