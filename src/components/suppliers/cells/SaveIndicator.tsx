'use client';

import type { SaveStatus } from '@/hooks/use-editable-value';

interface SaveIndicatorProps {
  status: SaveStatus;
  editMode: 'viewing' | 'quickEdit' | 'bulkEdit';
}

export function SaveIndicator({ status, editMode }: SaveIndicatorProps) {
  // Only show indicator in quickEdit mode
  if (editMode !== 'quickEdit' || status === 'idle') {
    return null;
  }

  return (
    <div className="absolute top-1 right-1 flex items-center gap-1">
      {status === 'saving' && (
        <>
          <div 
            className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" 
            title="Saving..."
            aria-label="Saving changes"
          />
          <span className="text-xs text-orange-600 font-medium">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <div 
            className="w-2 h-2 bg-green-500 rounded-full" 
            title="Saved"
            aria-label="Changes saved"
          />
          <span className="text-xs text-green-600 font-medium">Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <div 
            className="w-2 h-2 bg-red-500 rounded-full animate-pulse" 
            title="Save failed"
            aria-label="Failed to save changes"
          />
          <span className="text-xs text-red-600 font-medium">Error</span>
        </>
      )}
    </div>
  );
}