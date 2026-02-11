'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import type { SaleDetailSectionId, SectionLayoutItem } from '../../lib/sale-detail-sections';
import type { SALE_DETAIL_SECTIONS } from '../../lib/sale-detail-sections';
import { SortableSectionItem } from './sortable-section-item';

interface ViewCustomizationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: SectionLayoutItem[];
  sectionDefinitions: Map<SaleDetailSectionId, (typeof SALE_DETAIL_SECTIONS)[number]>;
  onReorder: (activeId: string, overId: string) => void;
  onToggleVisibility: (sectionId: SaleDetailSectionId) => void;
  onReset: () => void;
  isCustomized: boolean;
}

export function ViewCustomizationSheet({
  open,
  onOpenChange,
  sections,
  sectionDefinitions,
  onReorder,
  onToggleVisibility,
  onReset,
  isCustomized,
}: ViewCustomizationSheetProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Personalizar Vista</SheetTitle>
          <SheetDescription>
            Arrastra para reordenar y usa los interruptores para mostrar u ocultar secciones.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 pr-4">
                {sections.map((section) => {
                  const def = sectionDefinitions.get(section.id);
                  if (!def) return null;
                  return (
                    <SortableSectionItem
                      key={section.id}
                      id={section.id}
                      label={def.label}
                      visible={section.visible}
                      onToggle={onToggleVisibility}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>

        <SheetFooter>
          <Button variant="outline" onClick={onReset} disabled={!isCustomized} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restablecer por defecto
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
