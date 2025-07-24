"use client"

import { useState, useEffect } from "react"
import { Edit3, Save, X, Loader2, ChevronUp, Download, Archive, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

// Shared styling constants for consistency
const PILL_STYLES = {
  base: "fixed z-50 rounded-full shadow-xl border-0 transition-all duration-200 hover:shadow-2xl",
  blue: "bg-blue-600 hover:scale-105",
  green: "bg-green-600",
  button: {
    white: "bg-white/20 hover:bg-white/30 border-0 text-white transition-all duration-150 hover:scale-110",
    red: "bg-red-500/80 hover:bg-red-500 border-0 text-white transition-all duration-150 hover:scale-110",
    save: "bg-white text-green-700 hover:bg-white/90 transition-all duration-150 hover:scale-105"
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

  // Mobile positioning: center-bottom, Desktop positioning: right-bottom
  const positionClasses = isMobile 
    ? "bottom-6 left-1/2 transform -translate-x-1/2" 
    : "bottom-6 right-6"
  
  // Mobile sizing: responsive width, Desktop sizing: auto
  const sizeClasses = isMobile 
    ? "w-[90vw] max-w-md" 
    : ""
  
  const sizeStyles = isMobile 
    ? { minWidth: '280px', maxWidth: '90vw' } 
    : { width: 'auto', maxWidth: 'fit-content' }

  // Spreadsheet mode controls with enhanced pill design
  if (isSpreadsheetMode) {
    return (
      <div 
        className={`${PILL_STYLES.base} ${PILL_STYLES.green} ${positionClasses} ${sizeClasses}`}
        style={sizeStyles}
      >
        <div className={`px-4 py-3 flex items-center gap-3 ${isMobile ? 'flex-wrap justify-center' : 'whitespace-nowrap'}`}>
          <div className="text-xs font-medium text-white">
            Spreadsheet Mode {changedRowsCount > 0 && `• ${changedRowsCount} rows modified`}
          </div>
          {!isMobile && <div className="text-xs text-white/80">Tab: Next field • ↑↓: Navigate rows • Esc: Exit</div>}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSaveChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className={`${PILL_STYLES.button.save} h-8 px-3 text-xs font-medium`}
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
              className={`${PILL_STYLES.button.white} h-8 w-8 p-0`}
            >
              <X className="h-4 w-4" />
            </Button>
            {/* Collapse button - always available */}
            <Button
              size="sm"
              onClick={onCollapseAll}
              className={`${PILL_STYLES.button.white} h-8 w-8 p-0`}
              title="Collapse all rows"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Regular mode controls - Unified pill design for mobile and desktop
  return (
    <div 
      className={`${PILL_STYLES.base} ${PILL_STYLES.blue} ${positionClasses} ${sizeClasses}`}
      style={sizeStyles}
    >
      <div className={`px-4 py-2 flex items-center gap-2 ${isMobile ? 'justify-center' : 'whitespace-nowrap'}`}>
        {selectedCount > 0 ? (
          // Batch action controls with pill design
          <>
            {/* Selected count indicator - mobile gets bigger display */}
            {isMobile ? (
              <div className="bg-blue-500 rounded-full px-3 py-1 text-white font-medium text-base min-w-[2.5rem] text-center">
                {selectedCount}
              </div>
            ) : (
              <span className="text-xs text-white/90 mr-1">{selectedCount} selected</span>
            )}
            
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={onBulkExport}
                disabled={loading}
                className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
                title="Export selected"
              >
                <Download className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </Button>

              {hasInactiveSelected && (
                <Button
                  size="sm"
                  onClick={onBulkUnarchive}
                  disabled={loading}
                  className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
                  title="Unarchive selected"
                >
                  <RotateCcw className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </Button>
              )}

              <Button
                size="sm"
                onClick={onBulkArchive}
                disabled={loading}
                className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
                title="Archive selected"
              >
                <Archive className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </Button>

              <Button
                size="sm"
                onClick={onBulkDelete}
                disabled={loading}
                className={`${PILL_STYLES.button.red} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
                title="Delete selected"
              >
                <Trash2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </Button>

              {/* Collapse button - always available */}
              <Button
                size="sm"
                onClick={onCollapseAll}
                className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
                title="Collapse all rows"
              >
                <ChevronUp className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </Button>

              {/* Clear selection - mobile only */}
              {onClearSelection && isMobile && (
                <Button
                  size="sm"
                  onClick={onClearSelection}
                  disabled={loading}
                  className={`${PILL_STYLES.button.white} h-10 w-10 p-0 ml-1`}
                  title="Clear selection"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </>
        ) : (
          // Default controls with pill design
          <div className="flex gap-1">
            {/* Edit All Rows - hidden on small screens */}
            <Button
              size="sm"
              onClick={onEnterSpreadsheetMode}
              className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 px-4' : 'h-8 px-3'} text-xs transition-all duration-150 hover:scale-105 hidden sm:flex`}
            >
              <Edit3 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} mr-1`} />
              Edit All Rows
            </Button>

            {/* Collapse button - always available */}
            <Button
              size="sm"
              onClick={onCollapseAll}
              className={`${PILL_STYLES.button.white} ${isMobile ? 'h-10 w-10' : 'h-8 w-8'} p-0`}
              title="Collapse all rows"
            >
              <ChevronUp className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
