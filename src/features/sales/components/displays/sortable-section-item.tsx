'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { SaleDetailSectionId } from '../../lib/sale-detail-sections';

interface SortableSectionItemProps {
  id: SaleDetailSectionId;
  label: string;
  visible: boolean;
  onToggle: (id: SaleDetailSectionId) => void;
}

export function SortableSectionItem({ id, label, visible, onToggle }: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card flex items-center gap-3 rounded-lg border p-3 ${isDragging ? 'z-50 opacity-50 shadow-lg' : ''}`}
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Switch checked={visible} onCheckedChange={() => onToggle(id)} />
    </div>
  );
}
