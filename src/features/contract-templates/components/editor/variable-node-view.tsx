'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';
import { Bold, Braces, Italic, Strikethrough, Underline } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export function VariableChipView({ node, editor, getPos }: NodeViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);

  const marks = node.marks || [];
  const hasBold = marks.some((m) => m.type.name === 'bold');
  const hasItalic = marks.some((m) => m.type.name === 'italic');
  const hasUnderline = marks.some((m) => m.type.name === 'underline');
  const hasStrike = marks.some((m) => m.type.name === 'strike');

  const selectNode = useCallback(() => {
    if (!editor || typeof getPos !== 'function') return;
    const pos = getPos();
    if (pos == null) return;
    const { tr } = editor.state;
    const selection = NodeSelection.create(editor.state.doc, pos);
    editor.view.dispatch(tr.setSelection(selection));
  }, [editor, getPos]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode();
      setShowMenu(true);
    },
    [selectNode]
  );

  const toggleMark = useCallback(
    (markName: string) => {
      if (!editor || typeof getPos !== 'function') return;
      selectNode();
      requestAnimationFrame(() => {
        editor.chain().focus().toggleMark(markName).run();
      });
    },
    [editor, getPos, selectNode]
  );

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as HTMLElement) &&
        chipRef.current &&
        !chipRef.current.contains(e.target as HTMLElement)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const formatButtons = [
    { mark: 'bold', icon: Bold, active: hasBold, label: 'Negrita' },
    { mark: 'italic', icon: Italic, active: hasItalic, label: 'Cursiva' },
    { mark: 'underline', icon: Underline, active: hasUnderline, label: 'Subrayado' },
    { mark: 'strike', icon: Strikethrough, active: hasStrike, label: 'Tachado' },
  ];

  return (
    <NodeViewWrapper as="span" className="relative inline">
      <span
        ref={chipRef}
        role="button"
        tabIndex={-1}
        onClick={handleClick}
        className={cn(
          'bg-primary/10 text-primary border-primary/20 inline-flex cursor-pointer items-center gap-0.5 rounded border px-1.5 py-0.5 text-sm transition-colors',
          'hover:bg-primary/20',
          showMenu && 'ring-primary/40 ring-2',
          hasBold && 'font-bold',
          hasItalic && 'italic',
          hasUnderline && 'underline',
          hasStrike && 'line-through'
        )}
      >
        <Braces className="h-3 w-3 shrink-0" />
        {node.attrs.variableLabel}
      </span>

      {showMenu && (
        <div
          ref={menuRef}
          className="bg-popover text-popover-foreground absolute bottom-full left-0 z-50 mb-1.5 flex items-center gap-0.5 rounded-lg border p-1 shadow-lg"
        >
          {formatButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.mark}
                type="button"
                title={btn.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMark(btn.mark);
                }}
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                  btn.active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      )}
    </NodeViewWrapper>
  );
}
