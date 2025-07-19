import { z } from 'zod';
import { InventoryUnit, ItemType } from '@/types';

// Base item validation schema
export const ItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters'),
  type: z
    .enum(['ingredient', 'packaging', 'product'] as const)
    .refine((val): val is ItemType => true),
  inventoryunit: z
    .enum([
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
    ] as const)
    .refine((val): val is InventoryUnit => true),
  currentquantity: z.number().min(0, 'Quantity cannot be negative').default(0),
  weightedaveragecost: z.number().min(0, 'Cost cannot be negative').default(0),
  reorderpoint: z
    .number()
    .min(0, 'Reorder point cannot be negative')
    .optional(),
  primarysupplierid: z.string().uuid().optional(),
  leadtimedays: z
    .number()
    .min(1, 'Lead time must be at least 1 day')
    .max(365, 'Lead time cannot exceed 1 year')
    .default(7),
  isarchived: z.boolean().default(false),
});

// Schema for creating new items
export const CreateItemSchema = ItemSchema.omit({
  currentquantity: true,
  weightedaveragecost: true,
  isarchived: true,
});

// Schema for updating items
export const UpdateItemSchema = ItemSchema.partial();

// Schema for bulk operations
export const BulkItemIdsSchema = z.object({
  itemIds: z
    .array(z.string().uuid())
    .min(1, 'At least one item must be selected'),
});

// Type exports
export type CreateItemRequest = z.infer<typeof CreateItemSchema>;
export type UpdateItemRequest = z.infer<typeof UpdateItemSchema>;
export type ItemValidation = z.infer<typeof ItemSchema>;
export type BulkItemIdsRequest = z.infer<typeof BulkItemIdsSchema>;
