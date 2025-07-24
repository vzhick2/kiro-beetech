"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Archive, 
  Trash2, 
  X,
  RotateCcw
} from "lucide-react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface BatchActionsBarProps {
  selectedCount: number
  hasInactiveSelected: boolean
  onBulkExport: () => void
  onBulkArchive: () => void
  onBulkUnarchive: () => void
  onBulkDelete: () => void
  onClearSelection?: () => void
  loading?: boolean
}

export const BatchActionsBar = ({
  selectedCount,
  hasInactiveSelected,
  onBulkExport,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onClearSelection,
  loading = false
}: BatchActionsBarProps) => {
  const { isMobile } = useMobileDetection()

  if (selectedCount === 0 || !isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 rounded-full shadow-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-xl mx-[5%] max-w-[90%]">
      {/* Selected count - compact display */}
      <div className="bg-blue-500 rounded-full px-3 py-1 text-white font-medium text-sm min-w-[2rem] text-center">
        {selectedCount}
      </div>

      {/* Action buttons - direct access */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkExport}
        disabled={loading}
        className="h-8 w-8 p-0 text-white hover:bg-blue-500 rounded-full touch-feedback"
        title="Export selected"
      >
        <Download className="h-4 w-4" />
      </Button>

      {hasInactiveSelected ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkUnarchive}
          disabled={loading}
          className="h-8 w-8 p-0 text-white hover:bg-blue-500 rounded-full touch-feedback"
          title="Restore selected"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkArchive}
          disabled={loading}
          className="h-8 w-8 p-0 text-white hover:bg-blue-500 rounded-full touch-feedback"
          title="Archive selected"
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkDelete}
        disabled={loading}
        className="h-8 w-8 p-0 text-white hover:bg-red-500 rounded-full touch-feedback"
        title="Delete selected"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Clear selection */}
      {onClearSelection && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          disabled={loading}
          className="h-8 w-8 p-0 text-white hover:bg-gray-500 rounded-full touch-feedback ml-1"
          title="Clear selection"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
