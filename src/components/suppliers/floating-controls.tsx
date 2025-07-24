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

  // Spreadsheet mode controls with enhanced pill design
  if (isSpreadsheetMode) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 bg-green-600 rounded-full shadow-xl border-0 transition-all duration-200 hover:shadow-2xl" 
        style={{ width: 'auto', maxWidth: 'fit-content' }}
      >
        <div className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
          <div className="text-xs font-medium text-white">
            Spreadsheet Mode {changedRowsCount > 0 && `• ${changedRowsCount} rows modified`}
          </div>
          {!isMobile && <div className="text-xs text-white/80">Tab: Next field • ↑↓: Navigate rows • Esc: Exit</div>}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSaveChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-white text-green-700 hover:bg-white/90 h-8 px-3 text-xs font-medium transition-all duration-150 hover:scale-105"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  {isMobile ? "" : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  {isMobile ? "" : "Apply Changes"}
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={onCancelChanges}
              disabled={isSaving}
              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Regular mode controls - Pill-based design inspired by mobile
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 bg-blue-600 rounded-full shadow-xl border-0 transition-all duration-200 hover:shadow-2xl hover:scale-105" 
      style={{ width: 'auto', maxWidth: 'fit-content' }}
    >
      <div className="px-4 py-2 flex items-center gap-2 whitespace-nowrap">
        {selectedCount > 0 ? (
          // Bulk action controls with pill design
          <>
            {!isMobile && <span className="text-xs text-white/90 mr-1">{selectedCount} selected</span>}
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={onBulkExport}
                disabled={loading}
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110"
                title="Export selected"
              >
                <Download className="h-4 w-4" />
              </Button>

              {hasInactiveSelected && (
                <Button
                  size="sm"
                  onClick={onBulkUnarchive}
                  disabled={loading}
                  className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110"
                  title="Unarchive selected"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="sm"
                onClick={onBulkArchive}
                disabled={loading}
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110"
                title="Archive selected"
              >
                <Archive className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                onClick={onBulkDelete}
                disabled={loading}
                className="h-8 w-8 p-0 bg-red-500/80 hover:bg-red-500 border-0 text-white transition-all duration-150 hover:scale-110"
                title="Delete selected"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          // Default controls with pill design
          <div className="flex gap-1">
            {!isMobile && (
              <Button
                size="sm"
                onClick={onEnterSpreadsheetMode}
                className="h-8 px-3 bg-white/20 hover:bg-white/30 border-0 text-white text-xs transition-all duration-150 hover:scale-105"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit All Rows
              </Button>
            )}

            <Button
              size="sm"
              onClick={onCollapseAll}
              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110"
              title="Collapse all rows"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
