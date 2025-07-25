'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Archive, Trash2, X, RotateCcw } from 'lucide-react';
import { useMobileDetection } from '@/hooks/use-mobile-detection';

// Shared styling constants for consistency with FloatingControls
const MOBILE_PILL_STYLES = {
  container:
    'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 rounded-full shadow-xl px-2 py-2 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-105',
  button:
    'h-10 w-10 p-0 text-white rounded-full transition-all duration-150 hover:scale-110',
  buttonHover: {
    blue: 'hover:bg-blue-500',
    red: 'hover:bg-red-500',
    gray: 'hover:bg-gray-500',
  },
  count:
    'bg-blue-500 rounded-full px-3 py-1 text-white font-medium text-base min-w-[2.5rem] text-center',
};

interface BatchActionsBarProps {
  selectedCount: number;
  hasInactiveSelected: boolean;
  onBulkExport: () => void;
  onBulkArchive: () => void;
  onBulkUnarchive: () => void;
  onBulkDelete: () => void;
  onClearSelection?: () => void;
  loading?: boolean;
}

export const BatchActionsBar = ({
  selectedCount,
  hasInactiveSelected,
  onBulkExport,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onClearSelection,
  loading = false,
}: BatchActionsBarProps) => {
  const { isMobile } = useMobileDetection();

  if (selectedCount === 0 || !isMobile) {
    return null;
  }

  return (
    <div
      className={`${MOBILE_PILL_STYLES.container} w-[81vw] max-w-md`}
      style={{ minWidth: '280px', maxWidth: '81vw' }}
    >
      {/* Selected count - compact display */}
      <div className={MOBILE_PILL_STYLES.count}>{selectedCount}</div>

      {/* Action buttons - direct access with enhanced micro-interactions */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkExport}
        disabled={loading}
        className={`${MOBILE_PILL_STYLES.button} ${MOBILE_PILL_STYLES.buttonHover.blue}`}
        title="Export selected"
      >
        <Download className="h-5 w-5" />
      </Button>

      {hasInactiveSelected ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkUnarchive}
          disabled={loading}
          className={`${MOBILE_PILL_STYLES.button} ${MOBILE_PILL_STYLES.buttonHover.blue}`}
          title="Restore selected"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkArchive}
          disabled={loading}
          className={`${MOBILE_PILL_STYLES.button} ${MOBILE_PILL_STYLES.buttonHover.blue}`}
          title="Archive selected"
        >
          <Archive className="h-5 w-5" />
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={onBulkDelete}
        disabled={loading}
        className={`${MOBILE_PILL_STYLES.button} ${MOBILE_PILL_STYLES.buttonHover.red}`}
        title="Delete selected"
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      {/* Clear selection */}
      {onClearSelection && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          disabled={loading}
          className={`${MOBILE_PILL_STYLES.button} ${MOBILE_PILL_STYLES.buttonHover.gray} ml-1`}
          title="Clear selection"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
