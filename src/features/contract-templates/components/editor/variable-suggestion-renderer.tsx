import { createRoot, type Root } from 'react-dom/client';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';

import { VariableSuggestionList, type VariableSuggestionListRef } from './variable-suggestion-list';
import type { VariableSuggestionItem } from './variable-suggestion';

type Props = SuggestionProps<VariableSuggestionItem, VariableSuggestionItem>;

export function createSuggestionRenderer() {
  let component: VariableSuggestionListRef | null = null;
  let popup: HTMLDivElement | null = null;
  let root: Root | null = null;

  function updatePosition(clientRect: (() => DOMRect | null) | null | undefined) {
    if (!popup || !clientRect) return;
    const rect = clientRect();
    if (!rect) return;

    const popupHeight = popup.offsetHeight || 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const fitsBelow = spaceBelow > popupHeight + 8;

    popup.style.left = `${rect.left}px`;
    if (fitsBelow) {
      popup.style.top = `${rect.bottom + 4}px`;
      popup.style.bottom = 'auto';
    } else {
      popup.style.top = 'auto';
      popup.style.bottom = `${window.innerHeight - rect.top + 4}px`;
    }
  }

  function cleanup() {
    root?.unmount();
    root = null;
    popup?.remove();
    popup = null;
    component = null;
  }

  return {
    onStart(props: Props) {
      popup = document.createElement('div');
      popup.style.position = 'fixed';
      popup.style.zIndex = '50';
      document.body.appendChild(popup);

      root = createRoot(popup);
      root.render(
        <VariableSuggestionList
          ref={(ref) => {
            component = ref;
          }}
          items={props.items}
          command={props.command}
        />
      );

      updatePosition(props.clientRect);
    },

    onUpdate(props: Props) {
      root?.render(
        <VariableSuggestionList
          ref={(ref) => {
            component = ref;
          }}
          items={props.items}
          command={props.command}
        />
      );

      updatePosition(props.clientRect);
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === 'Escape') {
        cleanup();
        return true;
      }
      return component?.onKeyDown(props) ?? false;
    },

    onExit() {
      cleanup();
    },
  };
}
