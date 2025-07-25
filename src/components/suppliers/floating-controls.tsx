"use client"

import { useState, useEffect } from "react"
import { Edit3, Save, X, Loader2, ChevronUp, Download, Archive, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

// Notion-inspired styling constants for clean, minimal design
const NOTION_STYLES = {
  base: "fixed z-50 transition-all duration-200 ease-in-out",
  container: {
    default: "bg-white/95 backdrop-blur-md border border-gray-200/60 shadow-lg shadow-gray-900/[0.08] rounded-lg",
    editing: "bg-blue-50/95 backdrop-blur-md border border-blue-200/60 shadow-lg shadow-blue-900/[0.08] rounded-lg",
    selected: "bg-gray-50/95 backdrop-blur-md border border-gray-300/60 shadow-lg shadow-gray-900/[0.08] rounded-lg"
  },
  text: {
    primary: "text-gray-700 font-medium",
    secondary: "text-gray-500 text-sm",
    count: "text-gray-600 font-semibold"
  },
  button: {
    default: "bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/40 text-gray-600 hover:text-gray-700 transition-all duration-150 hover:shadow-sm",
    primary: "bg-blue-500 hover:bg-blue-600 border border-blue-500 text-white transition-all duration-150 hover:shadow-sm",
    success: "bg-green-500 hover:bg-green-600 border border-green-500 text-white transition-all duration-150 hover:shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 border border-red-500 text-white transition-all duration-150 hover:shadow-sm",
    secondary: "bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 transition-all duration-150 hover:shadow-sm"
  },
  animation: {
    slideUp: "animate-in slide-in-from-bottom-2 fade-in-0 duration-200",
    scaleIn: "animate-in zoom-in-95 fade-in-0 duration-150"
  }
}

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
  onClearSelection?: () => void
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
  onClearSelection,
  isSaving,
  loading,
}: FloatingControlsProps) => {
  const { isMobile } = useMobileDetection()

  // Determine current state for styling
  const isMinimalMode = !isSpreadsheetMode && selectedCount === 0
  const containerStyle = isSpreadsheetMode 
    ? NOTION_STYLES.container.editing 
    : selectedCount > 0 
      ? NOTION_STYLES.container.selected 
      : NOTION_STYLES.container.default

  // Notion-style positioning: floating above content
  const positionClasses = isMobile 
    ? "bottom-6 left-4 right-4" 
    : "bottom-6 right-6"

  // Spreadsheet mode controls with Notion aesthetic
  if (isSpreadsheetMode) {
    return (
      <div 
        className={`${NOTION_STYLES.base} ${containerStyle} ${isMobile ? 'bottom-6 left-4 right-4' : 'bottom-6 right-6'} ${NOTION_STYLES.animation.slideUp}`}
        style={{ width: 'auto', maxWidth: 'fit-content' }}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          {changedRowsCount > 0 && (
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {changedRowsCount} modified
            </div>
          )}
          
          {!isMobile && (
            <div className={`${NOTION_STYLES.text.secondary} flex items-center gap-3 text-xs`}>
              <span>Tab: Next field</span>
              <span>↑↓: Navigate</span>
              <span>Esc: Exit</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onSaveChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className={`${NOTION_STYLES.button.success} h-9 px-4 text-sm font-medium ${NOTION_STYLES.animation.scaleIn}`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Apply Changes
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={onCancelChanges}
              disabled={isSaving}
              className={`${NOTION_STYLES.button.secondary} h-9 w-9 p-0`}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={onCollapseAll}
              className={`${NOTION_STYLES.button.default} h-9 w-9 p-0`}
              title="Collapse all rows"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Regular mode controls with Notion aesthetic
  return (
    <div 
      className={`${NOTION_STYLES.base} ${containerStyle} ${positionClasses} ${NOTION_STYLES.animation.slideUp}`}
      style={{ width: 'auto', maxWidth: 'fit-content' }}
    >
      <div className="px-4 py-3 flex items-center">
        {selectedCount > 0 ? (
          // Selection state with batch actions
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 bg-gray-600 text-white text-xs font-semibold rounded-md flex items-center justify-center ${NOTION_STYLES.animation.scaleIn}`}>
                  {selectedCount}
                </div>
                <span className={`${NOTION_STYLES.text.count} text-sm`}>
                  {selectedCount === 1 ? 'item selected' : 'items selected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button
                size="sm"
                onClick={onBulkExport}
                disabled={loading}
                className={`${NOTION_STYLES.button.default} h-9 w-9 p-0`}
                title="Export selected"
              >
                <Download className="h-4 w-4" />
              </Button>

              {hasInactiveSelected && (
                <Button
                  size="sm"
                  onClick={onBulkUnarchive}
                  disabled={loading}
                  className={`${NOTION_STYLES.button.primary} h-9 w-9 p-0`}
                  title="Unarchive selected"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="sm"
                onClick={onBulkArchive}
                disabled={loading}
                className={`${NOTION_STYLES.button.default} h-9 w-9 p-0`}
                title="Archive selected"
              >
                <Archive className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                onClick={onBulkDelete}
                disabled={loading}
                className={`${NOTION_STYLES.button.danger} h-9 w-9 p-0`}
                title="Delete selected"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              <Button
                size="sm"
                onClick={onCollapseAll}
                className={`${NOTION_STYLES.button.default} h-9 w-9 p-0`}
                title="Collapse all rows"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>

              {onClearSelection && (
                <Button
                  size="sm"
                  onClick={onClearSelection}
                  disabled={loading}
                  className={`${NOTION_STYLES.button.secondary} h-9 w-9 p-0`}
                  title="Clear selection"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Default state with minimal controls
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button
                size="sm"
                onClick={onEnterSpreadsheetMode}
                className={`${NOTION_STYLES.button.primary} h-9 px-4 text-sm font-medium`}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit All Rows
              </Button>
            )}

            <Button
              size="sm"
              onClick={onCollapseAll}
              className={`${NOTION_STYLES.button.default} h-9 w-9 p-0`}
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
