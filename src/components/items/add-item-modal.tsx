'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { InventoryUnit, ItemType } from '@/types'
import { createItem } from '@/app/actions/items'

const INVENTORY_UNITS: { value: InventoryUnit; label: string }[] = [
  { value: 'each', label: 'Each' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'gal', label: 'Gallons (gal)' },
  { value: 'qt', label: 'Quarts (qt)' },
  { value: 'pt', label: 'Pints (pt)' },
  { value: 'cup', label: 'Cups' },
  { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' }
]

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'ingredient', label: 'Ingredient' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'product', label: 'Product' }
]

interface AddItemModalProps {
  onItemAdded?: () => void
}

export function AddItemModal({ onItemAdded }: AddItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    SKU: '',
    type: 'ingredient' as ItemType,
    inventoryUnit: 'each' as InventoryUnit,
    currentQuantity: 0,
    reorderPoint: 0,
    leadTimeDays: 7
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Map frontend field names to database field names
      const dbFormData = {
        name: formData.name,
        sku: formData.SKU,
        type: formData.type,
        inventoryunit: formData.inventoryUnit,
        currentquantity: formData.currentQuantity,
        reorderpoint: formData.reorderPoint,
        leadtimedays: formData.leadTimeDays,
        weightedaveragecost: 0,
        isarchived: false
      }
      
      const result = await createItem(dbFormData)
      if (result.success) {
        setIsOpen(false)
        setFormData({
          name: '',
          SKU: '',
          type: 'ingredient',
          inventoryUnit: 'each',
          currentQuantity: 0,
          reorderPoint: 0,
          leadTimeDays: 7
        })
        onItemAdded?.()
      } else {
        console.error('Failed to create item:', result.error)
      }
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Item
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>
            
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                required
                value={formData.SKU}
                onChange={(e) => handleInputChange('SKU', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Item Type *
              </label>
              <select
                id="type"
                required
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ItemType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {ITEM_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="inventoryUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                id="inventoryUnit"
                required
                value={formData.inventoryUnit}
                onChange={(e) => handleInputChange('inventoryUnit', e.target.value as InventoryUnit)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {INVENTORY_UNITS.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Current Quantity
              </label>
              <input
                type="number"
                id="currentQuantity"
                min="0"
                value={formData.currentQuantity}
                onChange={(e) => handleInputChange('currentQuantity', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Point
              </label>
              <input
                type="number"
                id="reorderPoint"
                min="0"
                value={formData.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="leadTimeDays" className="block text-sm font-medium text-gray-700 mb-1">
                Lead Time (days)
              </label>
              <input
                type="number"
                id="leadTimeDays"
                min="1"
                value={formData.leadTimeDays}
                onChange={(e) => handleInputChange('leadTimeDays', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 