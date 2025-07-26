import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Status = 'active' | 'pending' | 'archived';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'default' as const,
    className:
      'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  },
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  },
  archived: {
    label: 'Archived',
    variant: 'outline' as const,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
