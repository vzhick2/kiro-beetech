"use client"

import { useEffect } from "react"

interface KeyboardShortcutsProps {
  onNewSupplier: () => void
  onBulkDelete: () => void
  selectedCount: number
}

export const useKeyboardShortcuts = ({ onNewSupplier, onBulkDelete, selectedCount }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
          case "n":
            event.preventDefault()
            onNewSupplier()
            break
        }
      } else {
        switch (event.key) {
          case "Delete":
            if (selectedCount > 0) {
              event.preventDefault()
              onBulkDelete()
            }
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onNewSupplier, onBulkDelete, selectedCount])
}
