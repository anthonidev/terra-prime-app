'use client';

import { useCallback, useEffect, useReducer } from 'react';
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
  Indent,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Minus,
  Outdent,
  Redo,
  Strikethrough,
  Table2,
  Underline,
  Undo,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

const FONT_SIZE_OPTIONS = [
  { label: '8pt', value: '8pt' },
  { label: '9pt', value: '9pt' },
  { label: '10pt', value: '10pt' },
  { label: '11pt', value: '11pt' },
  { label: '12pt', value: '12pt' },
  { label: '14pt', value: '14pt' },
  { label: '16pt', value: '16pt' },
  { label: '18pt', value: '18pt' },
  { label: '20pt', value: '20pt' },
  { label: '24pt', value: '24pt' },
  { label: '28pt', value: '28pt' },
  { label: '36pt', value: '36pt' },
];

const LINE_HEIGHT_OPTIONS = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.3', value: '1.3' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
];

interface TiptapToolbarProps {
  editor: Editor | null;
  onInsertTable: () => void;
  onInsertImage: (file: File) => void;
}

export function TiptapToolbar({ editor, onInsertTable, onInsertImage }: TiptapToolbarProps) {
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    editor.on('selectionUpdate', forceRender);
    editor.on('transaction', forceRender);
    return () => {
      editor.off('selectionUpdate', forceRender);
      editor.off('transaction', forceRender);
    };
  }, [editor]);

  const handleInsertImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/gif,image/webp';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) onInsertImage(file);
    };
    input.click();
  }, [onInsertImage]);

  if (!editor) return null;

  const currentLineHeight =
    editor.getAttributes('paragraph')?.lineHeight ||
    editor.getAttributes('heading')?.lineHeight ||
    null;

  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || null;

  const items: (ToolbarItem | 'separator' | 'lineHeight' | 'fontSize')[] = [
    'fontSize',
    'separator',
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
    'separator',
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
    'separator',
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
      icon: Outdent,
      action: () => editor.chain().focus().outdent().run(),
      active: false,
      label: 'Disminuir sangría',
      shortcut: 'Shift+Tab',
    },
    {
      icon: Indent,
      action: () => editor.chain().focus().indent().run(),
      active: false,
      label: 'Aumentar sangría',
      shortcut: 'Tab',
    },
    'separator',
    {
      icon: Table2,
      action: () => onInsertTable(),
      active: editor.isActive('table'),
      label: 'Insertar tabla',
    },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: false,
      label: 'Línea horizontal',
    },
    'separator',
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
    'separator',
    'lineHeight',
    'separator',
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
  ];

  return (
    <TooltipProvider delayDuration={500}>
      <div className="flex flex-wrap items-center gap-0.5 p-1.5">
        {items.map((item, i) => {
          if (item === 'separator') {
            return <Separator key={`sep-${i}`} orientation="vertical" className="mx-1 h-6" />;
          }
          if (item === 'fontSize') {
            return (
              <FontSizeDropdown
                key="fontSize"
                currentValue={currentFontSize}
                onSelect={(value) => {
                  if (value) {
                    editor.chain().focus().setFontSize(value).run();
                  } else {
                    editor.chain().focus().unsetFontSize().run();
                  }
                }}
              />
            );
          }
          if (item === 'lineHeight') {
            return (
              <LineHeightDropdown
                key="lineHeight"
                currentValue={currentLineHeight}
                onSelect={(value) => {
                  if (value) {
                    editor.chain().focus().setLineHeight(value).run();
                  } else {
                    editor.chain().focus().unsetLineHeight().run();
                  }
                }}
              />
            );
          }
          return <ToolbarButton key={item.label} item={item} />;
        })}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleInsertImage}
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

interface ToolbarItem {
  icon: LucideIcon;
  action: () => void;
  active: boolean;
  label: string;
  shortcut?: string;
}

function FontSizeDropdown({
  currentValue,
  onSelect,
}: {
  currentValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Tamaño de fuente"
              className="hover:bg-muted text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs transition-colors"
            >
              <span className="text-[10px] font-semibold">A</span>
              <span className="font-mono text-[11px]">{currentValue || '11pt'}</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Tamaño de fuente
        </TooltipContent>
        <DropdownMenuContent align="start" className="max-h-[280px] min-w-[90px] overflow-y-auto">
          <DropdownMenuItem
            onClick={() => onSelect(null)}
            className={cn('text-xs', !currentValue && 'bg-accent')}
          >
            Por defecto
          </DropdownMenuItem>
          {FONT_SIZE_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={cn('text-xs', currentValue === opt.value && 'bg-accent')}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}

function LineHeightDropdown({
  currentValue,
  onSelect,
}: {
  currentValue: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Interlineado"
              className="hover:bg-muted text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-0.5 rounded-md px-2 text-xs transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 20V4" />
                <path d="m2 8 4-4 4 4" />
                <path d="m2 16 4 4 4-4" />
                <path d="M12 6h10" />
                <path d="M12 12h10" />
                <path d="M12 18h10" />
              </svg>
              <span className="font-mono">{currentValue || '—'}</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Interlineado
        </TooltipContent>
        <DropdownMenuContent align="start" className="min-w-[100px]">
          <DropdownMenuItem
            onClick={() => onSelect(null)}
            className={cn('text-xs', !currentValue && 'bg-accent')}
          >
            Por defecto
          </DropdownMenuItem>
          {LINE_HEIGHT_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={cn('text-xs', currentValue === opt.value && 'bg-accent')}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}

function ToolbarButton({ item }: { item: ToolbarItem }) {
  const Icon = item.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={item.action}
          aria-label={item.label}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors',
            item.active
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <span className="flex items-center gap-1.5">
          {item.label}
          {item.shortcut && (
            <kbd className="rounded bg-black/20 px-1 py-0.5 font-mono text-[10px]">
              {item.shortcut}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
