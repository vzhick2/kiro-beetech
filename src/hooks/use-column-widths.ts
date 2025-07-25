'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMobileDetection } from './use-mobile-detection';

interface ColumnWidths {
  actions: number;
  name: number;
  website: number;
  phone: number;
  status: number;
  created: number;
}

const DEFAULT_WIDTHS: ColumnWidths = {
  actions: 140, // Single column for all three buttons
  name: 200,
  website: 180,
  phone: 140,
  status: 80,
  created: 100,
};

// Mobile widths - about 30% narrower
const MOBILE_WIDTHS: ColumnWidths = {
  actions: 100, // Reduced from 140
  name: 140, // Reduced from 200
  website: 125, // Reduced from 180
  phone: 100, // Reduced from 140
  status: 60, // Reduced from 80
  created: 70, // Reduced from 100
};

export const useColumnWidths = () => {
  const { isMobile } = useMobileDetection();
  const [columnWidths, setColumnWidths] =
    useState<ColumnWidths>(DEFAULT_WIDTHS);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStartWidth, setDragStartWidth] = useState<number>(0);

  // Update column widths based on screen size, but only when not resizing
  useEffect(() => {
    if (!isResizing) {
      setColumnWidths(isMobile ? MOBILE_WIDTHS : DEFAULT_WIDTHS);
    }
  }, [isMobile, isResizing]);

  const resetColumnWidths = useCallback(() => {
    setColumnWidths(isMobile ? MOBILE_WIDTHS : DEFAULT_WIDTHS);
  }, [isMobile]);

  const updateColumnWidth = useCallback(
    (columnId: string, width: number) => {
      if (!isResizing) return; // Only update when actively resizing

      const minWidth = isMobile
        ? columnId === 'actions'
          ? 100
          : 40
        : columnId === 'actions'
          ? 140
          : 60;

      setColumnWidths(prev => ({
        ...prev,
        [columnId]: Math.max(minWidth, width),
      }));
    },
    [isMobile, isResizing]
  );

  const startResize = useCallback((columnId: string, startWidth: number) => {
    setIsResizing(columnId);
    setDragStartWidth(startWidth);
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(null);
    setDragStartWidth(0);
  }, []);

  return {
    columnWidths,
    isResizing,
    dragStartWidth,
    resetColumnWidths,
    updateColumnWidth,
    startResize,
    stopResize,
  };
};
