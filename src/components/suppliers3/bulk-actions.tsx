'use client';

import { Trash2, Archive, RotateCcw, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onExport: () => void;
  onClear: () => void;
  hasArchivedSelected: boolean;
}

export const BulkActions = ({
  selectedCount,
  onDelete,
  onArchive,
  onUnarchive,
  onExport,
  onClear,
  hasArchivedSelected
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} supplier{selectedCount === 1 ? '' : 's'} selected
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            
            {hasArchivedSelected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUnarchive}
                className="h-8"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Unarchive
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onArchive}
              className="h-8"
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
