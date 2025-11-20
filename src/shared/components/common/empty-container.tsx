import { Megaphone } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface EmptyContainerProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyContainer({ title, description, children }: EmptyContainerProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Megaphone />
        </EmptyMedia>
        <EmptyTitle>{title || 'No Projects Yet'}</EmptyTitle>
        <EmptyDescription>
          {description || 'Create your first project to get started.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">{children}</div>
      </EmptyContent>
    </Empty>
  );
}
