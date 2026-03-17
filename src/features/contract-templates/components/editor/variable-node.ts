import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VariableChipView } from './variable-node-view';

export const VariableChip = Node.create({
  name: 'variableChip',
  group: 'inline',
  inline: true,
  atom: true,
  marks: '_',

  addAttributes() {
    return {
      variableKey: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-variable-key'),
        renderHTML: (attributes) => ({ 'data-variable-key': attributes.variableKey }),
      },
      variableLabel: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-variable-label'),
        renderHTML: (attributes) => ({ 'data-variable-label': attributes.variableLabel }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-variable-key]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableChipView);
  },
});
