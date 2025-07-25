import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge
      variant={status === 'active' ? 'default' : 'secondary'}
      className={`text-xs ${
        status === 'active'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {status}
    </Badge>
  );
};
