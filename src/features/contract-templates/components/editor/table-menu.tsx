'use client';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  Combine,
  SplitSquareHorizontal,
  Trash2,
  RowsIcon,
  ColumnsIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface TableMenuProps {
  editor: Editor;
}

export function TableMenu({ editor }: TableMenuProps) {
  const items = [
    {
      icon: ArrowUpToLine,
      label: 'Fila arriba',
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: ArrowDownToLine,
      label: 'Fila abajo',
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: RowsIcon,
      label: 'Eliminar fila',
      action: () => editor.chain().focus().deleteRow().run(),
      destructive: true,
    },
    'separator' as const,
    {
      icon: ArrowLeftToLine,
      label: 'Columna antes',
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: ArrowRightToLine,
      label: 'Columna después',
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: ColumnsIcon,
      label: 'Eliminar columna',
      action: () => editor.chain().focus().deleteColumn().run(),
      destructive: true,
    },
    'separator' as const,
    {
      icon: Combine,
      label: 'Combinar celdas',
      action: () => editor.chain().focus().mergeCells().run(),
    },
    {
      icon: SplitSquareHorizontal,
      label: 'Dividir celda',
      action: () => editor.chain().focus().splitCell().run(),
    },
    'separator' as const,
    {
      icon: Trash2,
      label: 'Eliminar tabla',
      action: () => editor.chain().focus().deleteTable().run(),
      destructive: true,
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => ed.isActive('table')}
      options={{ placement: 'top' }}
    >
      <TooltipProvider delayDuration={300}>
        <div className="bg-card flex items-center gap-0.5 rounded-lg border p-1 shadow-lg">
          {items.map((item, i) => {
            if (item === 'separator') {
              return <Separator key={i} orientation="vertical" className="mx-0.5 h-6" />;
            }

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${item.destructive ? 'hover:text-destructive' : ''}`}
                    onClick={item.action}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </BubbleMenu>
  );
}
