import { Extension, type Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';

export interface VariableSuggestionItem {
  key: string;
  label: string;
  category: string;
}

export const variableSuggestionPluginKey = new PluginKey('variableSuggestion');

export const VariableSuggestion = Extension.create({
  name: 'variableSuggestion',

  addOptions() {
    return {
      suggestion: {} as Record<string, unknown>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: variableSuggestionPluginKey,
        char: '@',
        allowSpaces: false,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: { from: number; to: number };
          props: VariableSuggestionItem;
        }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: 'variableChip',
              attrs: { variableKey: props.key, variableLabel: props.label },
            })
            .run();
        },
        ...this.options.suggestion,
      }),
    ];
  },
});
