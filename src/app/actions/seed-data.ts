'use server';

import { supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';

type InventoryUnit = Database['public']['Enums']['inventory_unit'];
type ItemType = Database['public']['Enums']['item_type'];

const sampleItems = [
  // Ingredients
  {
    name: 'Organic Raw Honey',
    sku: 'HONEY-RAW-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'lb' as InventoryUnit,
    currentquantity: 45.5,
    weightedaveragecost: 8.75,
    reorderpoint: 15,
    leadtimedays: 7,
    isarchived: false,
  },
  {
    name: 'Vanilla Bean Extract',
    sku: 'VANILLA-EXT-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'oz' as InventoryUnit,
    currentquantity: 32,
    weightedaveragecost: 15.5,
    reorderpoint: 10,
    leadtimedays: 14,
    isarchived: false,
  },
  {
    name: 'Cinnamon Powder',
    sku: 'CINNAMON-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'oz' as InventoryUnit,
    currentquantity: 24,
    weightedaveragecost: 3.25,
    reorderpoint: 8,
    leadtimedays: 5,
    isarchived: false,
  },
  {
    name: 'Lemon Essential Oil',
    sku: 'LEMON-OIL-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'oz' as InventoryUnit,
    currentquantity: 16,
    weightedaveragecost: 12.0,
    reorderpoint: 5,
    leadtimedays: 10,
    isarchived: false,
  },
  {
    name: 'Propolis Extract',
    sku: 'PROPOLIS-EXT-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'oz' as InventoryUnit,
    currentquantity: 8,
    weightedaveragecost: 25.0,
    reorderpoint: 3,
    leadtimedays: 21,
    isarchived: false,
  },
  {
    name: 'Beeswax Pellets',
    sku: 'BEESWAX-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'lb' as InventoryUnit,
    currentquantity: 12.5,
    weightedaveragecost: 18.5,
    reorderpoint: 5,
    leadtimedays: 14,
    isarchived: false,
  },
  {
    name: 'Royal Jelly',
    sku: 'ROYAL-JELLY-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'oz' as InventoryUnit,
    currentquantity: 4,
    weightedaveragecost: 45.0,
    reorderpoint: 2,
    leadtimedays: 30,
    isarchived: false,
  },
  {
    name: 'Bee Pollen',
    sku: 'POLLEN-001',
    type: 'ingredient' as ItemType,
    inventoryunit: 'lb' as InventoryUnit,
    currentquantity: 6.5,
    weightedaveragecost: 22.0,
    reorderpoint: 3,
    leadtimedays: 14,
    isarchived: false,
  },

  // Packaging
  {
    name: 'Glass Jars 8oz',
    sku: 'JAR-8OZ-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 200,
    weightedaveragecost: 0.85,
    reorderpoint: 50,
    leadtimedays: 5,
    isarchived: false,
  },
  {
    name: 'Glass Jars 16oz',
    sku: 'JAR-16OZ-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 150,
    weightedaveragecost: 1.25,
    reorderpoint: 40,
    leadtimedays: 5,
    isarchived: false,
  },
  {
    name: 'Plastic Lids 8oz',
    sku: 'LID-8OZ-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 250,
    weightedaveragecost: 0.15,
    reorderpoint: 75,
    leadtimedays: 3,
    isarchived: false,
  },
  {
    name: 'Plastic Lids 16oz',
    sku: 'LID-16OZ-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 180,
    weightedaveragecost: 0.2,
    reorderpoint: 60,
    leadtimedays: 3,
    isarchived: false,
  },
  {
    name: 'Product Labels',
    sku: 'LABEL-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 500,
    weightedaveragecost: 0.08,
    reorderpoint: 100,
    leadtimedays: 7,
    isarchived: false,
  },
  {
    name: 'Shipping Boxes Small',
    sku: 'BOX-SM-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 75,
    weightedaveragecost: 0.45,
    reorderpoint: 25,
    leadtimedays: 3,
    isarchived: false,
  },
  {
    name: 'Shipping Boxes Medium',
    sku: 'BOX-MD-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 50,
    weightedaveragecost: 0.65,
    reorderpoint: 20,
    leadtimedays: 3,
    isarchived: false,
  },
  {
    name: 'Bubble Wrap Rolls',
    sku: 'BUBBLE-001',
    type: 'packaging' as ItemType,
    inventoryunit: 'each' as InventoryUnit,
    currentquantity: 12,
    weightedaveragecost: 8.5,
    reorderpoint: 4,
    leadtimedays: 5,
    isarchived: false,
  },
];

export async function seedSampleData() {
  try {
    console.log('Adding sample data to remote database...');

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const item of sampleItems) {
      const { error } = await supabaseAdmin
        .from('items')
        .insert([item])
        .select();

      if (error) {
        console.error(`Error inserting ${item.name}:`, error.message);
        results.push({ item: item.name, success: false, error: error.message });
        errorCount++;
      } else {
        console.log(`Added: ${item.name}`);
        results.push({ item: item.name, success: true });
        successCount++;
      }
    }

    return {
      success: true,
      message: `Added ${successCount} items successfully. ${errorCount} errors.`,
      results,
      summary: {
        total: sampleItems.length,
        success: successCount,
        errors: errorCount,
        ingredients: sampleItems.filter(i => i.type === 'ingredient').length,
        packaging: sampleItems.filter(i => i.type === 'packaging').length,
      },
    };
  } catch (error) {
    console.error('Failed to seed sample data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
