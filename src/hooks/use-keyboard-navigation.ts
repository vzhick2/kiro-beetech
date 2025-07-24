"use client"

import { useEffect, useState, useCallback } from "react"
import type { RowSelectionState } from "@tanstack/react-table"

interface KeyboardNavigationProps {
  totalRows: number
  rowSelection: RowSelectionState
  setRowSelection: (selection: RowSelectionState) => void
  onNewSupplier: () => void
  onBulkDelete: () => void
  selectedCount: number
  getRowId: (index: number) => string
}

export const useKeyboardNavigation = ({
  totalRows,
  rowSelection,
  setRowSelection,
  onNewSupplier,
  onBulkDelete,
  selectedCount,
  getRowId,
}: KeyboardNavigationProps) => {
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "a":
            event.preventDefault()
            // Select all rows
            const allSelected: RowSelectionState = {}
            for (let i = 0; i < totalRows; i++) {
              allSelected[getRowId(i)] = true
            }
            setRowSelection(allSelected)
            break
        }
      } else if (event.shiftKey) {
        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
            event.preventDefault()
            // Extend selection with shift+arrows
            if (focusedRowIndex >= 0) {
              const direction = event.key === "ArrowUp" ? -1 : 1
              const newIndex = Math.max(0, Math.min(totalRows - 1, focusedRowIndex + direction))

              // Create range selection
              const start = Math.min(focusedRowIndex, newIndex)
              const end = Math.max(focusedRowIndex, newIndex)
              const newSelection = { ...rowSelection }

              for (let i = start; i <= end; i++) {
                newSelection[getRowId(i)] = true
              }

              setRowSelection(newSelection)
              setFocusedRowIndex(newIndex)
            }
            break
        }
      } else {
        switch (event.key) {
          case "n":
          case "N":
            // Only trigger if no input is focused and no rows selected
            if (Object.keys(rowSelection).length === 0) {
              event.preventDefault()
              onNewSupplier()
            }
            break
          case "ArrowUp":
            event.preventDefault()
            setFocusedRowIndex((prev) => Math.max(0, prev - 1))
            break
          case "ArrowDown":
            event.preventDefault()
            setFocusedRowIndex((prev) => Math.min(totalRows - 1, prev + 1))
            break
          case " ":
            event.preventDefault()
            // Toggle selection of focused row
            if (focusedRowIndex >= 0) {
              const rowId = getRowId(focusedRowIndex)
              setRowSelection((prev) => ({
                ...prev,
                [rowId]: !prev[rowId],
              }))
            }
            break
          case "Escape":
            event.preventDefault()
            setRowSelection({})
            setFocusedRowIndex(-1)
            break
          case "Delete":
            if (selectedCount > 0) {
              event.preventDefault()
              onBulkDelete()
            }
            break
        }
      }
    },
    [focusedRowIndex, totalRows, rowSelection, setRowSelection, onNewSupplier, onBulkDelete, selectedCount, getRowId],
  )

  // Handle click outside to deselect
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest("[data-table-container]")) {
        setRowSelection({})
        setFocusedRowIndex(-1)
      }
    },
    [setRowSelection],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [handleKeyDown, handleClickOutside])

  return { focusedRowIndex, setFocusedRowIndex }
}
