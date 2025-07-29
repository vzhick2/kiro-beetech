/**
 * Business logic utilities and calculations
 * SIMPLIFIED: Removed over-engineered forecasting until real usage data available
 */

import {
  CycleCountAlert,
  Item,
  PurchaseLineItem,
  Recipe /* RecipeIngredient */,
} from '@/types';
import { paginationSettings } from '@/config/app-config';

/**
 * Calculate cycle count alert priority score
 * Simple formula: days since last count + stock level factor
 */
export function calculateCycleCountPriority(item: Item): number {
  const daysSinceCount = item.lastCountedDate
    ? Math.floor(
        (Date.now() - item.lastCountedDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 365; // Default to 1 year if never counted

  const countScore = Math.min(daysSinceCount / 30, 10); // Cap at 10

  // Simple stock scoring
  let stockScore = 0;
  if (item.currentQuantity <= 0) {
    stockScore = 5; // High priority for out of stock
  } else if (item.reorderPoint && item.currentQuantity <= item.reorderPoint) {
    stockScore = 3; // Medium priority for below reorder point
  } else {
    stockScore = 1; // Low priority for normal stock
  }

  return countScore + stockScore;
}

/**
 * Generate cycle count alerts for items
 */
export function generateCycleCountAlerts(
  items: Item[],
  limit: number = paginationSettings.pageSizes.dashboard.cycleCountAlerts
): CycleCountAlert[] {
  const alerts: CycleCountAlert[] = items
    .filter(item => !item.isarchived)
    .map(item => {
      const priorityScore = calculateCycleCountPriority(item);
      let alertType: 'NEGATIVE_INVENTORY' | 'LOW_STOCK';
      let shortageAmount: number | undefined;

      if (item.currentQuantity < 0) {
        alertType = 'NEGATIVE_INVENTORY';
        shortageAmount = Math.abs(item.currentQuantity);
      } else {
        alertType = 'LOW_STOCK';
        if (item.reorderPoint && item.currentQuantity < item.reorderPoint) {
          shortageAmount = item.reorderPoint - item.currentQuantity;
        }
      }

      return {
        itemId: item.itemId,
        SKU: item.SKU,
        name: item.name,
        currentQuantity: item.currentQuantity,
        reorderPoint: item.reorderPoint ?? 0,
        priorityScore,
        alertType,
        shortageAmount: shortageAmount || 0,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit);

  return alerts;
}

/**
 * Calculate weighted average cost from purchase line items
 */
export function calculateWeightedAverageCost(
  lineItems: PurchaseLineItem[]
): number {
  if (lineItems.length === 0) {
    return 0;
  }

  const totalCost = lineItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity > 0) {
    return totalCost / totalQuantity;
  }
  return 0;
}

/**
 * Calculate recipe scaling
 */
export function scaleRecipe(recipe: Recipe, scaleFactor: number): Recipe {
  return {
    ...recipe,
    expectedYield: recipe.expectedYield * scaleFactor,
    laborMinutes: recipe.laborMinutes
      ? Math.round(recipe.laborMinutes * scaleFactor)
      : 0,
    projectedMaterialCost: recipe.projectedMaterialCost
      ? recipe.projectedMaterialCost * scaleFactor
      : 0,
    ingredients: recipe.ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * scaleFactor,
    })),
    created_at: recipe.created_at,
    updated_at: recipe.updated_at || recipe.created_at,
  };
}

/**
 * Calculate maximum possible batches based on available inventory
 */
export function calculateMaxBatches(
  recipe: Recipe,
  availableInventory: Record<string, number>
): number {
  if (recipe.ingredients.length === 0) {
    return 0;
  }

  const maxBatches = recipe.ingredients.map(ingredient => {
    const available = availableInventory[ingredient.itemId] || 0;
    return Math.floor(available / ingredient.quantity);
  });

  return Math.min(...maxBatches);
}

/**
 * Calculate batch yield percentage
 */
export function calculateYieldPercentage(
  actualOutput: number,
  expectedOutput: number
): number {
  if (expectedOutput === 0) {
    return 0;
  }
  return actualOutput / expectedOutput;
}

/**
 * Calculate cost variance for batches
 */
export function calculateCostVariance(
  actualCost: number,
  projectedCost: number
): number {
  return actualCost - projectedCost;
}

/**
 * Check if item needs reordering (simplified)
 */
export function needsReorder(item: Item): boolean {
  if (!item.reorderPoint) {
    return item.currentQuantity <= 0; // No reorder point set, only alert if out of stock
  }
  return item.currentQuantity <= item.reorderPoint;
}

/**
 * Calculate suggested reorder quantity (simplified manual approach)
 * This is a basic calculation - improve when you have usage data
 */
export function calculateReorderQuantity(item: Item): number {
  const leadTimeDays = item.leadTimeDays || 7;
  const reorderPoint = item.reorderPoint || 0;

  // Simple approach: order enough to get back to reorder point + lead time buffer
  const shortage = Math.max(0, reorderPoint - item.currentQuantity);
  const leadTimeBuffer = reorderPoint * 0.3; // 30% buffer for lead time

  return Math.ceil(shortage + leadTimeBuffer);
}

/**
 * Validate purchase line item totals
 */
export function validatePurchaseTotals(
  lineItems: PurchaseLineItem[],
  grandTotal: number,
  shipping: number = 0,
  taxes: number = 0,
  otherCosts: number = 0
): boolean {
  const lineItemsTotal = lineItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  const expectedTotal = lineItemsTotal + shipping + taxes + otherCosts;

  // Allow for small rounding differences (within $0.01)
  return Math.abs(expectedTotal - grandTotal) < 0.01;
}

/**
 * Allocate shipping and taxes proportionally to inventory items only
 */
export function allocateAdditionalCosts(
  lineItems: PurchaseLineItem[],
  items: Item[],
  shipping: number,
  taxes: number,
  otherCosts: number
): PurchaseLineItem[] {
  // Filter to only inventory items (exclude non-inventory types)
  const inventoryItems = lineItems.filter(lineItem => {
    const item = items.find(i => i.itemId === lineItem.itemId);
    return item && item.type !== 'product'; // Assuming products are finished goods, not inventory
  });

  const inventoryTotal = inventoryItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  const additionalCosts = shipping + taxes + otherCosts;

  if (inventoryTotal === 0 || additionalCosts === 0) {
    return lineItems;
  }

  return lineItems.map(lineItem => {
    const isInventoryItem = inventoryItems.some(
      inv => inv.lineItemId === lineItem.lineItemId
    );

    if (!isInventoryItem) {
      return lineItem;
    }

    const proportion = lineItem.totalCost / inventoryTotal;
    const allocatedCosts = additionalCosts * proportion;
    const newTotalCost = lineItem.totalCost + allocatedCosts;
    const newUnitCost = newTotalCost / lineItem.quantity;

    return {
      ...lineItem,
      unitCost: newUnitCost,
      totalCost: newTotalCost,
    };
  });
}
