/**
 * Unit conversion and formatting utilities
 */

import { InventoryUnit } from '@/types'

export const UNIT_LABELS: Record<InventoryUnit, string> = {
  each: 'Each',
  lb: 'Pounds',
  oz: 'Ounces',
  kg: 'Kilograms',
  g: 'Grams',
  gal: 'Gallons',
  qt: 'Quarts',
  pt: 'Pints',
  cup: 'Cups',
  fl_oz: 'Fluid Ounces',
  ml: 'Milliliters',
  l: 'Liters'
}

export const UNIT_ABBREVIATIONS: Record<InventoryUnit, string> = {
  each: 'ea',
  lb: 'lb',
  oz: 'oz',
  kg: 'kg',
  g: 'g',
  gal: 'gal',
  qt: 'qt',
  pt: 'pt',
  cup: 'cup',
  fl_oz: 'fl oz',
  ml: 'ml',
  l: 'l'
}

export function formatQuantity(quantity: number, unit: InventoryUnit): string {
  const abbreviation = UNIT_ABBREVIATIONS[unit]
  
  // Format number with appropriate decimal places
  let formattedQuantity: string
  if (quantity % 1 === 0) {
    formattedQuantity = quantity.toString()
  } else if (quantity < 1) {
    formattedQuantity = quantity.toFixed(3).replace(/\.?0+$/, '')
  } else {
    formattedQuantity = quantity.toFixed(2).replace(/\.?0+$/, '')
  }
  
  return `${formattedQuantity} ${abbreviation}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

// Basic unit conversions (extend as needed)
export const WEIGHT_CONVERSIONS: Record<string, number> = {
  'lb_to_oz': 16,
  'oz_to_lb': 1/16,
  'kg_to_g': 1000,
  'g_to_kg': 1/1000,
  'lb_to_kg': 0.453592,
  'kg_to_lb': 2.20462
}

export const VOLUME_CONVERSIONS: Record<string, number> = {
  'gal_to_qt': 4,
  'qt_to_gal': 1/4,
  'qt_to_pt': 2,
  'pt_to_qt': 1/2,
  'pt_to_cup': 2,
  'cup_to_pt': 1/2,
  'cup_to_fl_oz': 8,
  'fl_oz_to_cup': 1/8,
  'l_to_ml': 1000,
  'ml_to_l': 1/1000
}

export function convertUnit(
  quantity: number, 
  fromUnit: InventoryUnit, 
  toUnit: InventoryUnit
): number | null {
  if (fromUnit === toUnit) return quantity
  
  const conversionKey = `${fromUnit}_to_${toUnit}`
  const weightConversion = WEIGHT_CONVERSIONS[conversionKey]
  const volumeConversion = VOLUME_CONVERSIONS[conversionKey]
  
  if (weightConversion) return quantity * weightConversion
  if (volumeConversion) return quantity * volumeConversion
  
  return null // Conversion not supported
}