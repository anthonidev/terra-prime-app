import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function StatusBadge({ isActive, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'destructive'}
      className={cn('w-fit text-xs', className)}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );
}
