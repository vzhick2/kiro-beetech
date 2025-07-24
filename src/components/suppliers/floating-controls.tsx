"use client"

import { useState, useEffect } from "react"
import { Edit3, Save, X, Loader2, ChevronUp, Download, Archive, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface FloatingControlsProps {
  isSpreadsheetMode: boolean
  hasUnsavedChanges: boolean
  changedRowsCount: number
  selectedCount: number
  hasInactiveSelected: boolean
  onEnterSpreadsheetMode: () => void
  onSaveChanges: () => Promise<void>
  onCancelChanges: () => void
  onCollapseAll: () => void
  onBulkExport: () => void
  onBulkArchive: () => void
  onBulkUnarchive: () => void
  onBulkDelete: () => void
  isSaving: boolean
  loading: boolean
}

export const FloatingControls = ({
  isSpreadsheetMode,
  hasUnsavedChanges,
  changedRowsCount,
  selectedCount,
  hasInactiveSelected,
  onEnterSpreadsheetMode,
  onSaveChanges,
  onCancelChanges,
  onCollapseAll,
  onBulkExport,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  isSaving,
  loading,
}: FloatingControlsProps) => {
  const { isMobile } = useMobileDetection()

  // Spreadsheet mode controls
  if (isSpreadsheetMode) {
    return (
      <Card className="fixed bottom-6 right-6 z-50 shadow-lg border-2 border-blue-200 bg-white" style={{ width: 'auto', maxWidth: 'fit-content' }}>
        <div className="p-3 flex items-center gap-2 whitespace-nowrap">
          <div className="text-xs font-medium text-blue-700">
            Spreadsheet Mode {changedRowsCount > 0 && `• ${changedRowsCount} rows modified`}
          </div>
          {!isMobile && <div className="text-xs text-gray-500">Tab: Next field • ↑↓: Navigate rows • Esc: Exit</div>}
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={onSaveChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-green-600 hover:bg-green-700 h-7 text-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-2 w-2 animate-spin mr-1" />
                  {isMobile ? "" : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-2 w-2 mr-1" />
                  {isMobile ? "" : "Apply Changes"}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelChanges}
              disabled={isSaving}
              className="h-7 text-xs bg-transparent"
            >
              <X className="h-2 w-2 mr-1" />
              {isMobile ? "" : "Cancel"}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Regular mode controls - Always visible
  return (
    <Card className="fixed bottom-6 right-6 z-50 shadow-lg border bg-white micro-scale" style={{ width: 'auto', maxWidth: 'fit-content' }}>
      <div className="p-2 flex items-center gap-1 whitespace-nowrap">
        {selectedCount > 0 ? (
          // Bulk action controls with enhanced micro-interactions
          <>
            {!isMobile && <span className="text-xs text-gray-600 mr-1">{selectedCount} selected</span>}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={onBulkExport}
                disabled={loading}
                className={`${isMobile ? "h-6 w-6 p-0" : "px-2 h-6"} text-blue-600 hover:text-blue-700 text-xs micro-bounce touch-feedback`}
                title="Export selected"
              >
                <Download className="h-3 w-3" />
                {!isMobile && <span className="ml-1">Export</span>}
              </Button>

              {hasInactiveSelected && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onBulkUnarchive}
                  disabled={loading}
                  className={`${isMobile ? "h-6 w-6 p-0" : "px-2 h-6"} text-blue-600 hover:text-blue-700 text-xs micro-bounce touch-feedback`}
                  title="Unarchive selected"
                >
                  <RotateCcw className="h-3 w-3" />
                  {!isMobile && <span className="ml-1">Unarchive</span>}
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={onBulkArchive}
                disabled={loading}
                className={`${isMobile ? "h-6 w-6 p-0" : "px-2 h-6"} text-orange-600 hover:text-orange-700 text-xs micro-bounce touch-feedback`}
                title="Archive selected"
              >
                <Archive className="h-3 w-3" />
                {!isMobile && <span className="ml-1">Archive</span>}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={onBulkDelete}
                disabled={loading}
                className={`${isMobile ? "h-6 w-6 p-0" : "px-2 h-6"} text-red-600 hover:text-red-700 text-xs micro-bounce touch-feedback`}
                title="Delete selected"
              >
                <Trash2 className="h-3 w-3" />
                {!isMobile && <span className="ml-1">Delete</span>}
              </Button>
            </div>
          </>
        ) : (
          // Default controls
          <div className="flex gap-1">
            {!isMobile && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEnterSpreadsheetMode}
                className="px-2 h-6 bg-transparent text-xs"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit All Rows
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={onCollapseAll}
              className={isMobile ? "h-6 w-6 p-0" : "px-2 h-6"}
              title="Collapse all rows"
            >
              <ChevronUp className="h-3 w-3" />
              {!isMobile && <span className="ml-1 text-xs">Collapse All</span>}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
