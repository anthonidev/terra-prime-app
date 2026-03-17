'use client';

import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Table2,
  Underline,
  Undo,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TiptapToolbarProps {
  editor: Editor | null;
  onInsertTable: () => void;
  onInsertImage: (file: File) => void;
}

export function TiptapToolbar({ editor, onInsertTable, onInsertImage }: TiptapToolbarProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const handler = () => forceUpdate((n) => n + 1);
    editor.on('selectionUpdate', handler);
    editor.on('transaction', handler);
    return () => {
      editor.off('selectionUpdate', handler);
      editor.off('transaction', handler);
    };
  }, [editor]);

  if (!editor) return null;

  const groups = [
    [
      {
        icon: Bold,
        action: () => editor.chain().focus().toggleBold().run(),
        active: editor.isActive('bold'),
        label: 'Negrita',
        shortcut: 'Ctrl+B',
      },
      {
        icon: Italic,
        action: () => editor.chain().focus().toggleItalic().run(),
        active: editor.isActive('italic'),
        label: 'Cursiva',
        shortcut: 'Ctrl+I',
      },
      {
        icon: Underline,
        action: () => editor.chain().focus().toggleUnderline().run(),
        active: editor.isActive('underline'),
        label: 'Subrayado',
        shortcut: 'Ctrl+U',
      },
      {
        icon: Strikethrough,
        action: () => editor.chain().focus().toggleStrike().run(),
        active: editor.isActive('strike'),
        label: 'Tachado',
      },
    ],
    [
      {
        icon: Heading1,
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        active: editor.isActive('heading', { level: 1 }),
        label: 'Título 1',
      },
      {
        icon: Heading2,
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        active: editor.isActive('heading', { level: 2 }),
        label: 'Título 2',
      },
      {
        icon: Heading3,
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        active: editor.isActive('heading', { level: 3 }),
        label: 'Título 3',
      },
    ],
    [
      {
        icon: List,
        action: () => editor.chain().focus().toggleBulletList().run(),
        active: editor.isActive('bulletList'),
        label: 'Lista',
      },
      {
        icon: ListOrdered,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        active: editor.isActive('orderedList'),
        label: 'Lista numerada',
      },
      {
        icon: Table2,
        action: () => onInsertTable(),
        active: editor.isActive('table'),
        label: 'Insertar tabla',
      },
    ],
    [
      {
        icon: AlignLeft,
        action: () => editor.chain().focus().setTextAlign('left').run(),
        active: editor.isActive({ textAlign: 'left' }),
        label: 'Izquierda',
      },
      {
        icon: AlignCenter,
        action: () => editor.chain().focus().setTextAlign('center').run(),
        active: editor.isActive({ textAlign: 'center' }),
        label: 'Centrar',
      },
      {
        icon: AlignRight,
        action: () => editor.chain().focus().setTextAlign('right').run(),
        active: editor.isActive({ textAlign: 'right' }),
        label: 'Derecha',
      },
      {
        icon: AlignJustify,
        action: () => editor.chain().focus().setTextAlign('justify').run(),
        active: editor.isActive({ textAlign: 'justify' }),
        label: 'Justificar',
      },
    ],
    [
      {
        icon: Undo,
        action: () => editor.chain().focus().undo().run(),
        active: false,
        label: 'Deshacer',
        shortcut: 'Ctrl+Z',
      },
      {
        icon: Redo,
        action: () => editor.chain().focus().redo().run(),
        active: false,
        label: 'Rehacer',
        shortcut: 'Ctrl+Y',
      },
    ],
  ];

  return (
    <TooltipProvider delayDuration={500}>
      <div className="flex items-center gap-0.5 border-b p-1.5">
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <Separator orientation="vertical" className="mx-1 h-6" />}
            {group.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Toggle
                    size="sm"
                    pressed={item.active}
                    onPressedChange={() => item.action()}
                    aria-label={item.label}
                    className="data-[state=on]:bg-primary/15 data-[state=on]:text-primary h-8 w-8 p-0"
                  >
                    <item.icon className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {'shortcut' in item && item.shortcut && (
                      <kbd className="rounded bg-black/20 px-1 py-0.5 font-mono text-[10px]">
                        {item.shortcut}
                      </kbd>
                    )}
                  </span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png,image/jpeg,image/gif,image/webp';
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) onInsertImage(file);
                };
                input.click();
              }}
              aria-label="Insertar imagen"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Insertar imagen
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
