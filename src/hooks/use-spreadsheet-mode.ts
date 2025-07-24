"use client"

import { useState, useCallback } from "react"
import type { Supplier } from "@/types/data-table"

export const useSpreadsheetMode = () => {
  const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false)
  const [editedRows, setEditedRows] = useState<Map<string, Partial<Supplier>>>(new Map())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const enterSpreadsheetMode = useCallback(() => {
    setIsSpreadsheetMode(true)
    setEditedRows(new Map())
    setHasUnsavedChanges(false)
  }, [])

  const exitSpreadsheetMode = useCallback(() => {
    setIsSpreadsheetMode(false)
    setEditedRows(new Map())
    setHasUnsavedChanges(false)
  }, [])

  const updateRowData = useCallback((rowId: string, field: keyof Supplier, value: any) => {
    setEditedRows((prev) => {
      const newMap = new Map(prev)
      const existingData = newMap.get(rowId) || {}
      newMap.set(rowId, { ...existingData, [field]: value })
      return newMap
    })
    setHasUnsavedChanges(true)
  }, [])

  const undoRowChanges = useCallback(
    (rowId: string) => {
      setEditedRows((prev) => {
        const newMap = new Map(prev)
        newMap.delete(rowId)
        return newMap
      })
      setHasUnsavedChanges((prev) => {
        const newMap = new Map(editedRows)
        newMap.delete(rowId)
        return newMap.size > 0
      })
    },
    [editedRows],
  )

  const getRowData = useCallback(
    (rowId: string, originalData: Supplier): Supplier => {
      const editedData = editedRows.get(rowId)
      return editedData ? { ...originalData, ...editedData } : originalData
    },
    [editedRows],
  )

  const hasRowChanges = useCallback((rowId: string) => editedRows.has(rowId), [editedRows])

  const getChangedRowsCount = useCallback(() => editedRows.size, [editedRows])

  const getAllChanges = useCallback(() => {
    return Array.from(editedRows.entries()).map(([rowId, changes]) => ({
      rowId,
      changes,
    }))
  }, [editedRows])

  return {
    isSpreadsheetMode,
    hasUnsavedChanges,
    enterSpreadsheetMode,
    exitSpreadsheetMode,
    updateRowData,
    undoRowChanges,
    getRowData,
    hasRowChanges,
    getChangedRowsCount,
    getAllChanges,
  }
}
