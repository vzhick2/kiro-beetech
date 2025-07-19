'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Archive, ShoppingCart, Calculator } from 'lucide-react'
import { updateItem } from '@/app/actions/items'
import type { Item } from '@/types'

interface ItemActionsDropdownProps {
  item: Item
  onEdit?: (item: Item) => void
  onQuickReorder?: (item: Item) => void
  onManualCount?: (item: Item) => void
  onItemArchived?: () => void
}

export function ItemActionsDropdown({
  item,
  onEdit,
  onQuickReorder,
  onManualCount,
  onItemArchived
}: ItemActionsDropdownProps) {
  const [loading, setLoading] = useState(false)

  const handleArchive = async () => {
    if (!confirm(`Are you sure you want to archive "${item.name}"?`)) {
      return
    }

    setLoading(true)
    try {
      const result = await updateItem(item.itemId, { isarchived: true })
      if (result.success) {
        onItemArchived?.()
      } else {
        alert(`Failed to archive item: ${result.error}`)
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-gray-100"
          disabled={loading}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit?.(item)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Item
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onQuickReorder?.(item)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Quick Reorder
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onManualCount?.(item)}>
          <Calculator className="h-4 w-4 mr-2" />
          Manual Count
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleArchive}
          className="text-red-600 focus:text-red-600"
        >
          <Archive className="h-4 w-4 mr-2" />
          Archive Item
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 