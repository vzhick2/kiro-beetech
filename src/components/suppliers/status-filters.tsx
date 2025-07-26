'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatusFiltersProps {
  activeFilter: 'all' | 'active' | 'archived';
  onFilterChange: (filter: 'all' | 'active' | 'archived') => void;
  counts: {
    total: number;
    active: number;
    archived: number;
  };
}

export const StatusFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: StatusFiltersProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto min-w-0 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200/60 shadow-sm">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className="h-8 text-sm px-3 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        All
        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
          {counts.total}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('active')}
        className="h-8 text-sm px-3 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        Active
        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
          {counts.active}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === 'archived' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('archived')}
        className="h-8 text-sm px-3 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        Archived
        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
          {counts.archived}
        </Badge>
      </Button>
    </div>
  );
};
