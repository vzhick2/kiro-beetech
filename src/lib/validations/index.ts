import { z } from 'zod';

// Enum schemas
export const ItemTypeSchema = z.enum(['ingredient', 'packaging', 'product']);
export const InventoryUnitSchema = z.enum([
  'each',
  'lb',
  'oz',
  'kg',
  'g',
  'gal',
  'qt',
  'pt',
  'cup',
  'fl_oz',
  'ml',
  'l',
]);
export const TransactionTypeSchema = z.enum([
  'purchase',
  'sale',
  'adjustment',
  'batch_consumption',
  'batch_production',
]);

// Core entity schemas
export const ItemSchema = z.object({
  itemId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255),
  SKU: z.string().min(1, 'SKU is required').max(50),
  type: ItemTypeSchema,
  inventoryUnit: InventoryUnitSchema,
  currentQuantity: z.number().default(0),
  weightedAverageCost: z.number().min(0).default(0),
  reorderPoint: z.number().min(0).optional(),
  lastCountedDate: z.date().optional(),
  primarySupplierId: z.string().uuid().optional(),
  leadTimeDays: z.number().int().min(1).default(7),
  isArchived: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date().optional(),
});

export const SupplierSchema = z.object({
  supplierId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  isArchived: z.boolean().default(false),
  created_at: z.date(),
});

export const PurchaseLineItemSchema = z.object({
  lineItemId: z.string().uuid(),
  purchaseId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().positive('Quantity must be positive'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  totalCost: z.number().min(0, 'Total cost cannot be negative'),
  notes: z.string().max(500).optional(),
});

export const PurchaseSchema = z.object({
  purchaseId: z.string().uuid(),
  displayId: z.string().min(1),
  supplierId: z.string().uuid(),
  purchaseDate: z.date(),
  effectiveDate: z.date(),
  grandTotal: z.number().min(0, 'Grand total cannot be negative'),
  shipping: z.number().min(0).default(0),
  taxes: z.number().min(0).default(0),
  otherCosts: z.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
  isDraft: z.boolean().default(true),
  lineItems: z.array(PurchaseLineItemSchema).default([]),
  created_at: z.date(),
  updated_at: z.date().optional(),
});

export const RecipeIngredientSchema = z.object({
  ingredientId: z.string().uuid(),
  recipeId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().positive('Quantity must be positive'),
  notes: z.string().max(500).optional(),
});

export const RecipeSchema = z.object({
  recipeId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255),
  version: z.number().int().min(1).default(1),
  displayVersion: z.string().min(1),
  outputProductId: z.string().uuid(),
  expectedYield: z.number().positive('Expected yield must be positive'),
  laborMinutes: z.number().int().min(0).optional(),
  projectedMaterialCost: z.number().min(0).optional(),
  ingredients: z
    .array(RecipeIngredientSchema)
    .min(1, 'At least one ingredient is required'),
  isArchived: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date().optional(),
});

export const BatchSchema = z.object({
  batchId: z.string().uuid(),
  displayId: z.string().min(1),
  recipeId: z.string().uuid(),
  dateCreated: z.date(),
  effectiveDate: z.date(),
  qtyMade: z.number().positive('Quantity made must be positive'),
  yieldPercentage: z.number().min(0).max(2).optional(), // 0-200%
  materialCost: z.number().min(0),
  laborCost: z.number().min(0).default(0),
  actualCost: z.number().min(0),
  costVariance: z.number().optional(),
  expiryDate: z.date().optional(),
  notes: z.string().max(1000).optional(),
  created_at: z.date(),
});

// Form validation schemas
export const CreateItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  SKU: z.string().min(1, 'SKU is required').max(50),
  type: ItemTypeSchema,
  inventoryUnit: InventoryUnitSchema,
  currentQuantity: z.number().min(0).default(0),
  reorderPoint: z.number().min(0).optional(),
  primarySupplierId: z.string().uuid().optional(),
  leadTimeDays: z.number().int().min(1).default(7),
});

export const CreateSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  website: z.string().optional().refine((val) => {
    if (!val || val === '') {
      return true; // Allow empty strings
    }
    // Allow URLs with or without protocol
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(val);
  }, {
    message: 'Please enter a valid website URL (e.g., www.example.com or https://example.com)'
  }),
  contactPhone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const CreatePurchaseLineItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().positive('Quantity must be positive'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  notes: z.string().max(500).optional(),
});

export const CreatePurchaseSchema = z.object({
  supplierId: z.string().uuid(),
  purchaseDate: z.date(),
  effectiveDate: z.date(),
  grandTotal: z.number().min(0, 'Grand total cannot be negative'),
  shipping: z.number().min(0).default(0),
  taxes: z.number().min(0).default(0),
  otherCosts: z.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
  lineItems: z
    .array(CreatePurchaseLineItemSchema)
    .min(1, 'At least one line item is required'),
});

export const CreateRecipeIngredientSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().positive('Quantity must be positive'),
  notes: z.string().max(500).optional(),
});

export const CreateRecipeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  outputProductId: z.string().uuid(),
  expectedYield: z.number().positive('Expected yield must be positive'),
  laborMinutes: z.number().int().min(0).optional(),
  ingredients: z
    .array(CreateRecipeIngredientSchema)
    .min(1, 'At least one ingredient is required'),
});

export const CreateBatchSchema = z.object({
  recipeId: z.string().uuid(),
  dateCreated: z.date(),
  effectiveDate: z.date(),
  qtyMade: z.number().positive('Quantity made must be positive'),
  laborCost: z.number().min(0).default(0),
  expiryDate: z.date().optional(),
  notes: z.string().max(1000).optional(),
});

// Search and filter schemas
export const ItemFilterSchema = z.object({
  search: z.string().optional(),
  type: ItemTypeSchema.optional(),
  lowStock: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const PurchaseFilterSchema = z.object({
  search: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  isDraft: z.boolean().optional(),
});

// Export types
export type ItemFormData = z.infer<typeof CreateItemSchema>;
export type SupplierFormData = z.infer<typeof CreateSupplierSchema>;
export type PurchaseFormData = z.infer<typeof CreatePurchaseSchema>;
export type RecipeFormData = z.infer<typeof CreateRecipeSchema>;
export type BatchFormData = z.infer<typeof CreateBatchSchema>;
export type ItemFilter = z.infer<typeof ItemFilterSchema>;
export type PurchaseFilter = z.infer<typeof PurchaseFilterSchema>;

// Re-export error handling types
export type { AppResult, AppError, AppSuccess } from '../error-handling';
