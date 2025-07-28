'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface SpreadsheetNavigationProps {
  totalRows: number;
  isSpreadsheetMode: boolean;
  onExitSpreadsheetMode: () => void;
  expandedRows: Set<string>;
  getRowId: (index: number) => string;
}

export const useSpreadsheetNavigation = ({
  totalRows,
  isSpreadsheetMode,
  onExitSpreadsheetMode,
  expandedRows,
  getRowId,
}: SpreadsheetNavigationProps) => {
  const [currentCell, setCurrentCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [navigationActive, setNavigationActive] = useState(false);

  // Editable columns: name(0), website(1), phone(2), email(3), address(4), notes(5), status(6)
  const editableColumns = [0, 1, 2, 3, 4, 5, 6];

  // Use refs to store latest values without causing re-renders
  const propsRef = useRef({
    totalRows,
    isSpreadsheetMode,
    onExitSpreadsheetMode,
    expandedRows,
    getRowId,
  });

  // Update refs with latest values
  propsRef.current = {
    totalRows,
    isSpreadsheetMode,
    onExitSpreadsheetMode,
    expandedRows,
    getRowId,
  };

  const currentCellRef = useRef(currentCell);
  currentCellRef.current = currentCell;

  const navigationActiveRef = useRef(navigationActive);
  navigationActiveRef.current = navigationActive;

  // Initialize cursor position when entering spreadsheet mode
  useEffect(() => {
    if (isSpreadsheetMode && !currentCell) {
      let initialRow = 0;
      if (expandedRows.size > 0) {
        for (let i = 0; i < totalRows; i++) {
          const rowId = getRowId(i);
          if (expandedRows.has(rowId)) {
            initialRow = i;
            break;
          }
        }
      }
      setCurrentCell({ row: initialRow, col: editableColumns[0]! });
      setNavigationActive(true);
    } else if (!isSpreadsheetMode) {
      setCurrentCell(null);
      setNavigationActive(false);
    }
  }, [isSpreadsheetMode, expandedRows, totalRows, getRowId, currentCell]);

  const moveToNextCell = useCallback(() => {
    const currentCell = currentCellRef.current;
    const { totalRows } = propsRef.current;

    if (!currentCell) return;

    const currentRow = currentCell.row;
    const currentColIndex = editableColumns.indexOf(currentCell.col);

    if (currentColIndex < editableColumns.length - 1) {
      // Next column in same row
      setCurrentCell({
        row: currentRow,
        col: editableColumns[currentColIndex + 1]!,
      });
    } else if (currentRow < totalRows - 1) {
      // First column of next row
      setCurrentCell({ row: currentRow + 1, col: editableColumns[0]! });
    }
  }, []); // No dependencies - all values accessed via refs

  const moveToPrevCell = useCallback(() => {
    const currentCell = currentCellRef.current;

    if (!currentCell) return;

    const currentRow = currentCell.row;
    const currentColIndex = editableColumns.indexOf(currentCell.col);

    if (currentColIndex > 0) {
      // Previous column in same row
      setCurrentCell({
        row: currentRow,
        col: editableColumns[currentColIndex - 1]!,
      });
    } else if (currentRow > 0) {
      // Last column of previous row
      setCurrentCell({
        row: currentRow - 1,
        col: editableColumns[editableColumns.length - 1]!,
      });
    }
  }, []); // No dependencies - all values accessed via refs

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { isSpreadsheetMode, totalRows, onExitSpreadsheetMode } = propsRef.current;
      const currentCell = currentCellRef.current;
      const navigationActive = navigationActiveRef.current;

      if (!isSpreadsheetMode || !navigationActive) return;

      const activeElement = document.activeElement;
      const isSelectOpen =
        activeElement?.getAttribute('aria-expanded') === 'true' ||
        activeElement?.closest('[role="listbox"]') !== null ||
        document.querySelector('[data-state="open"]') !== null;

      // Handle escape key - only exit spreadsheet if no dropdown is open
      if (event.key === 'Escape') {
        if (isSelectOpen) {
          // Let the select handle closing itself, don't exit spreadsheet mode
          return;
        } else {
          // No dropdown open, exit spreadsheet mode
          event.preventDefault();
          onExitSpreadsheetMode();
          return;
        }
      }

      // Only handle navigation if focused element is an input/select
      const isInputFocused =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.getAttribute('role') === 'combobox';

      if (!isInputFocused) return;

      // Don't handle navigation if dropdown is open
      if (isSelectOpen) return;

      // ONLY handle specific navigation keys - ignore all typing characters
      const navigationKeys = ['Tab', 'Enter', 'ArrowUp', 'ArrowDown'];
      if (!navigationKeys.includes(event.key)) {
        return; // Let normal typing happen without interference
      }

      // Handle tab navigation within spreadsheet
      if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          moveToPrevCell();
        } else {
          moveToNextCell();
        }
        return;
      }

      // Handle Enter to move to next cell (like Tab)
      if (event.key === 'Enter') {
        event.preventDefault();
        moveToNextCell();
        return;
      }

      // Handle arrow keys for navigation only
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        // Only handle if input is empty or cursor is at appropriate position
        if (activeElement instanceof HTMLInputElement) {
          const input = activeElement;
          if (input.value.length === 0 || 
              (event.key === 'ArrowUp' && input.selectionStart === 0) ||
              (event.key === 'ArrowDown' && input.selectionStart === input.value.length)) {
            event.preventDefault();
            const currentRow = currentCell?.row ?? 0;
            const currentCol = currentCell?.col ?? 0;
            
            if (event.key === 'ArrowUp' && currentRow > 0) {
              setCurrentCell({ row: currentRow - 1, col: currentCol });
            } else if (event.key === 'ArrowDown' && currentRow < totalRows - 1) {
              setCurrentCell({ row: currentRow + 1, col: currentCol });
            }
          }
        }
        return;
      }
    },
    [moveToNextCell, moveToPrevCell] // Only stable callbacks in dependencies
  );

  // Reset navigation when clicking on a cell
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const { isSpreadsheetMode } = propsRef.current;
      if (isSpreadsheetMode) {
        setCurrentCell({ row, col });
        setNavigationActive(true);
      }
    },
    [] // No dependencies - all values accessed via refs
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown, false);
  }, [handleKeyDown]);

  // Focus the appropriate input when cell changes
  useEffect(() => {
    if (currentCell && isSpreadsheetMode && navigationActive) {
      setTimeout(() => {
        const cellSelector = `[data-cell="${currentCell.row}-${currentCell.col}"] input, [data-cell="${currentCell.row}-${currentCell.col}"] textarea, [data-cell="${currentCell.row}-${currentCell.col}"] button[role="combobox"]`;
        const element = document.querySelector(cellSelector) as
          | HTMLInputElement
          | HTMLTextAreaElement  
          | HTMLButtonElement;
        if (element) {
          element.focus();
          // For input/textarea elements, allow normal cursor positioning without forcing position
          // This enables users to click anywhere in the text and select/edit text naturally
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            // Only position cursor at end if this is initial navigation (not a click)
            // Check if the element was just clicked by checking if it already has focus
            if (document.activeElement !== element) {
              const length = element.value.length;
              element.setSelectionRange(length, length);
            }
            // If element already has focus (from a click), preserve user's cursor position
          }
        }
      }, 10);
    }
  }, [currentCell, isSpreadsheetMode, navigationActive]);

  return {
    currentCell,
    setCurrentCell,
    handleCellClick,
  };
};
