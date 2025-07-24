"use client"

import type React from "react"

import { useState, useCallback } from "react"

export const useShiftSelection = () => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

  const handleRowSelection = useCallback(
    (
      rowIndex: number,
      isSelected: boolean,
      event: React.MouseEvent | undefined,
      onToggleRange: (startIndex: number, endIndex: number, selected: boolean) => void,
      onToggleSingle: (index: number, selected: boolean) => void,
    ) => {
      if (event?.shiftKey && lastSelectedIndex !== null) {
        // Shift-click: select range
        const startIndex = Math.min(lastSelectedIndex, rowIndex)
        const endIndex = Math.max(lastSelectedIndex, rowIndex)
        onToggleRange(startIndex, endIndex, !isSelected)
      } else {
        // Regular click: select single
        onToggleSingle(rowIndex, !isSelected)
        setLastSelectedIndex(rowIndex)
      }
    },
    [lastSelectedIndex],
  )

  const resetSelection = useCallback(() => {
    setLastSelectedIndex(null)
  }, [])

  return { handleRowSelection, resetSelection }
}