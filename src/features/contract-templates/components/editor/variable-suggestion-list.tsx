'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Braces } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import type { VariableSuggestionItem } from './variable-suggestion';

export interface VariableSuggestionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface VariableSuggestionListProps {
  items: VariableSuggestionItem[];
  command: (item: VariableSuggestionItem) => void;
}

export const VariableSuggestionList = forwardRef<
  VariableSuggestionListRef,
  VariableSuggestionListProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const selected = listRef.current?.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) command(item);
    },
    [items, command]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      if (event.key === 'Escape') {
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return (
      <div className="bg-popover text-muted-foreground rounded-lg border p-3 text-center text-xs shadow-lg">
        No se encontraron variables
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="bg-popover max-h-[240px] min-w-[240px] overflow-y-auto rounded-lg border shadow-lg"
    >
      <div className="p-1">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            data-selected={index === selectedIndex}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
              index === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground'
            )}
          >
            <Braces className="text-primary h-3.5 w-3.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{item.label}</div>
              <div className="text-muted-foreground truncate font-mono text-[10px]">{item.key}</div>
            </div>
            <span className="text-muted-foreground shrink-0 text-[10px]">{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

VariableSuggestionList.displayName = 'VariableSuggestionList';
