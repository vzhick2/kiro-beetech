/**
 * Business logic utilities and calculations
 */

import {
  CycleCountAlert,
  Item,
  PurchaseLineItem,
  Recipe /* RecipeIngredient */,
} from '@/types';

/**
 * Calculate cycle count alert priority score
 * Formula: (days since last count / 30) + (1 - current qty / reorder point)
 */
export function calculateCycleCountPriority(item: Item): number {
  const daysSinceCount = item.lastCountedDate
    ? Math.floor(
        (Date.now() - item.lastCountedDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 365; // Default to 1 year if never counted

  const countScore = daysSinceCount / 30;
  const stockScore =
    1 - item.currentQuantity / Math.max(item.reorderPoint || 1, 1);

  return countScore + stockScore;
}

/**
 * Generate cycle count alerts for items
 */
export function generateCycleCountAlerts(
  items: Item[],
  limit: number = 5
): CycleCountAlert[] {
  const alerts: CycleCountAlert[] = items
    .filter(item => !item.isArchived)
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
 * Check if item needs reordering
 */
export function needsReorder(item: Item): boolean {
  if (!item.reorderPoint) {
    return false;
  }
  return item.currentQuantity <= item.reorderPoint;
}

/**
 * Calculate suggested reorder quantity
 */
export function calculateReorderQuantity(
  item: Item,
  averageUsage?: number
): number {
  const leadTimeDays = item.leadTimeDays || 7;
  const safetyStock = item.reorderPoint || 0;
  const dailyUsage = averageUsage ? averageUsage / 30 : 1; // Default to 1 per day if no usage data

  return Math.ceil(dailyUsage * leadTimeDays + safetyStock);
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
