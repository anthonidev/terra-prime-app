'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResizableImageView({
  node,
  updateAttributes,
  selected,
  deleteNode,
  editor,
}: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [resizing, setResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const resizeDir = useRef<'left' | 'right'>('right');

  const { src, alt, width, textAlign } = node.attrs;

  const handleResizeStart = useCallback((e: React.MouseEvent, dir: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    startX.current = e.clientX;
    startWidth.current = imgRef.current?.offsetWidth || 200;
    resizeDir.current = dir;
  }, []);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff =
        resizeDir.current === 'right' ? e.clientX - startX.current : startX.current - e.clientX;
      const newWidth = Math.max(50, Math.min(startWidth.current + diff, 750));
      updateAttributes({ width: newWidth });
    };

    const handleMouseUp = () => setResizing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, updateAttributes]);

  const justifyClass =
    textAlign === 'center'
      ? 'justify-center'
      : textAlign === 'right'
        ? 'justify-end'
        : 'justify-start';

  return (
    <NodeViewWrapper className={`my-2 flex ${justifyClass}`}>
      <div
        className="group relative inline-block"
        style={{ width: width ? `${width}px` : undefined }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          className={`block max-w-full ${selected ? 'ring-primary/60 ring-2 ring-offset-2' : ''}`}
          style={{ width: width ? `${width}px` : undefined }}
          draggable={false}
        />

        {selected && editor?.isEditable && (
          <>
            {/* Resize handle right */}
            <div
              className="absolute top-0 right-0 bottom-0 flex w-3 cursor-ew-resize items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            >
              <div className="bg-primary h-8 w-1 rounded-full" />
            </div>

            {/* Resize handle left */}
            <div
              className="absolute top-0 bottom-0 left-0 flex w-3 cursor-ew-resize items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
            >
              <div className="bg-primary h-8 w-1 rounded-full" />
            </div>

            {/* Floating toolbar */}
            <div className="bg-popover absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border p-0.5 shadow-md">
              <Button
                variant={textAlign === 'left' || !textAlign ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateAttributes({ textAlign: 'left' })}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={textAlign === 'center' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateAttributes({ textAlign: 'center' })}
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={textAlign === 'right' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateAttributes({ textAlign: 'right' })}
              >
                <AlignRight className="h-3.5 w-3.5" />
              </Button>
              <div className="bg-border mx-0.5 h-5 w-px" />
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-destructive h-7 w-7 p-0"
                onClick={deleteNode}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Drag handle */}
            <div
              className="absolute top-1 left-1 cursor-grab rounded bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
              data-drag-handle
              draggable="true"
              contentEditable={false}
            >
              <GripVertical className="h-3.5 w-3.5 text-white" />
            </div>

            {/* Size indicator while resizing */}
            {resizing && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                {Math.round(width || 0)}px
              </div>
            )}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
