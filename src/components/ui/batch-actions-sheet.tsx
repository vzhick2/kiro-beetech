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
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 rounded-full shadow-xl px-2 py-2 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 w-[81vw] max-w-md"
      style={{ minWidth: '280px', maxWidth: '81vw' }}
    >
      {/* Selected count - compact display */}
  <div className="bg-blue-500 rounded-full px-3 py-1 text-white font-medium text-base min-w-[2.5rem] text-center">
        {selectedCount}
      </div>

      {/* Action buttons - direct access with enhanced micro-interactions */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkExport}
        disabled={loading}
        className="h-10 w-10 p-0 text-white hover:bg-blue-500 rounded-full transition-all duration-150 hover:scale-110"
        title="Export selected"
      >
        <Download className="h-5 w-5" />
      </Button>

      {hasInactiveSelected ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkUnarchive}
          disabled={loading}
          className="h-10 w-10 p-0 text-white hover:bg-blue-500 rounded-full transition-all duration-150 hover:scale-110"
          title="Restore selected"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkArchive}
          disabled={loading}
          className="h-10 w-10 p-0 text-white hover:bg-blue-500 rounded-full transition-all duration-150 hover:scale-110"
          title="Archive selected"
        >
          <Archive className="h-5 w-5" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkDelete}
        disabled={loading}
        className="h-10 w-10 p-0 text-white hover:bg-red-500 rounded-full transition-all duration-150 hover:scale-110"
        title="Delete selected"
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      {/* Clear selection */}
      {onClearSelection && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          disabled={loading}
          className="h-10 w-10 p-0 text-white hover:bg-gray-500 rounded-full transition-all duration-150 hover:scale-110 ml-1"
          title="Clear selection"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
