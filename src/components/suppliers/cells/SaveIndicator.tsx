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
    <div className="absolute top-1 right-1 flex items-center">
      {status === 'saving' && (
        <div 
          className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" 
          title="Saving..."
          aria-label="Saving changes"
        />
      )}
      {status === 'saved' && (
        <div 
          className="w-2 h-2 bg-green-400 rounded-full" 
          title="Saved"
          aria-label="Changes saved"
        />
      )}
      {status === 'error' && (
        <div 
          className="w-2 h-2 bg-red-400 rounded-full animate-pulse" 
          title="Save failed"
          aria-label="Failed to save changes"
        />
      )}
    </div>
  );
}