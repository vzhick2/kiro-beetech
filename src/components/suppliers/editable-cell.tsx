"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { EditingCell } from "@/types/data-table"

interface EditableCellProps {
  value: string
  rowId: string
  columnId: string
  editingCell: EditingCell | null
  isSaving: boolean
  onEdit: (cell: EditingCell) => void
  onSave: (value: string) => void
  onCancel: () => void
}

export const EditableCell = ({
  value,
  rowId,
  columnId,
  editingCell,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: EditableCellProps) => {
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const isEditing = editingCell?.rowId === rowId && editingCell?.columnId === columnId

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave(editValue)
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm"
          disabled={isSaving}
        />
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onSave(editValue)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
      onClick={() => onEdit({ rowId, columnId, value })}
    >
      {value || <span className="text-gray-400 italic">Click to edit</span>}
    </div>
  )
}
