// Core data types
export type ItemType = 'ingredient' | 'packaging' | 'product'
export type InventoryUnit = 'each' | 'lb' | 'oz' | 'kg' | 'g' | 'gal' | 'qt' | 'pt' | 'cup' | 'fl_oz' | 'ml' | 'l'
export type TransactionType = 'purchase' | 'sale' | 'adjustment' | 'batch_consumption' | 'batch_production'

// Core interfaces
export interface Item {
  itemId: string
  name: string
  SKU: string
  type: ItemType
  inventoryUnit: InventoryUnit
  currentQuantity: number
  weightedAverageCost: number
  reorderPoint?: number
  lastCountedDate?: Date
  primarySupplierId?: string
  leadTimeDays: number
  isArchived: boolean
  created_at: Date
  updated_at?: Date
  // Virtual fields for enhanced display
  lastUsedSupplier?: string
  primarySupplierName?: string
}

export interface Supplier {
  supplierId: string
  name: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  notes?: string
  isArchived: boolean
  created_at: Date
}

export interface Purchase {
  purchaseId: string
  displayId: string
  supplierId: string
  purchaseDate: Date
  effectiveDate: Date
  grandTotal: number
  shipping: number
  taxes: number
  otherCosts: number
  notes?: string
  isDraft: boolean
  lineItems: PurchaseLineItem[]
  created_at: Date
  updated_at?: Date
}

export interface PurchaseLineItem {
  lineItemId: string
  purchaseId: string
  itemId: string
  quantity: number
  unitCost: number
  totalCost: number
  notes?: string
}

export interface Recipe {
  recipeId: string
  name: string
  version: number
  displayVersion: string
  outputProductId: string
  expectedYield: number
  laborMinutes?: number
  projectedMaterialCost?: number
  ingredients: RecipeIngredient[]
  isArchived: boolean
  created_at: Date
  updated_at?: Date
}

export interface RecipeIngredient {
  ingredientId: string
  recipeId: string
  itemId: string
  quantity: number
  notes?: string
}

export interface Batch {
  batchId: string
  displayId: string
  recipeId: string
  dateCreated: Date
  effectiveDate: Date
  qtyMade: number
  yieldPercentage?: number
  materialCost: number
  laborCost: number
  actualCost: number
  costVariance?: number
  expiryDate?: Date
  notes?: string
  created_at: Date
}

export interface SalesPeriod {
  salesPeriodId: string
  itemId: string
  periodStart: Date
  periodEnd: Date
  quantitySold: number
  revenue: number
  created_at: Date
}

export interface Transaction {
  transactionId: string
  itemId: string
  transactionType: TransactionType
  quantity: number
  unitCost?: number
  referenceId?: string
  referenceType?: string
  effectiveDate: Date
  notes?: string
  created_at: Date
}

// Business logic interfaces
export interface CycleCountAlert {
  itemId: string
  SKU: string
  name: string
  currentQuantity: number
  reorderPoint?: number
  priorityScore: number
  alertType: 'NEGATIVE_INVENTORY' | 'LOW_STOCK'
  shortageAmount?: number
}

export interface ForecastingData {
  forecastingId: string
  itemId: string
  predictedDemand: number
  seasonalIndex: number
  recommendedReorderPoint: number
  isAutomatic: boolean
  calculatedAt: Date
}

export interface BatchTemplate {
  templateId: string
  name: string
  recipeId: string
  scaleFactor: number
  notes?: string
  created_at: Date
}

export interface QuickReorderRequest {
  itemId: string
  supplierId: string
  quantity: number
  estimatedCost: number
}

// Error handling
export enum ErrorType {
  NEGATIVE_INVENTORY_WARNING = 'NEGATIVE_INVENTORY_WARNING',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  DUPLICATE_DISPLAY_ID = 'DUPLICATE_DISPLAY_ID',
  ARCHIVED_REFERENCE = 'ARCHIVED_REFERENCE',
  INVALID_ALLOCATION = 'INVALID_ALLOCATION',
  NO_PURCHASE_HISTORY = 'NO_PURCHASE_HISTORY'
}

export interface BusinessError {
  type: ErrorType
  message: string
  details?: Record<string, unknown>
  canProceed: boolean
}

// Form and API types
export interface CreateItemRequest {
  name: string
  SKU: string
  type: ItemType
  inventoryUnit: InventoryUnit
  currentQuantity?: number
  reorderPoint?: number
  primarySupplierId?: string
  leadTimeDays?: number
}

export interface CreateSupplierRequest {
  name: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  notes?: string
}

export interface CreatePurchaseRequest {
  supplierId: string
  purchaseDate: Date
  effectiveDate: Date
  grandTotal: number
  shipping?: number
  taxes?: number
  otherCosts?: number
  notes?: string
  lineItems: CreatePurchaseLineItemRequest[]
}

export interface CreatePurchaseLineItemRequest {
  itemId: string
  quantity: number
  unitCost: number
  notes?: string
}

export interface CreateRecipeRequest {
  name: string
  outputProductId: string
  expectedYield: number
  laborMinutes?: number
  ingredients: CreateRecipeIngredientRequest[]
}

export interface CreateRecipeIngredientRequest {
  itemId: string
  quantity: number
  notes?: string
}

export interface CreateBatchRequest {
  recipeId: string
  dateCreated: Date
  effectiveDate: Date
  qtyMade: number
  laborCost?: number
  expiryDate?: Date
  notes?: string
}