import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      minIndent: 0,
      maxIndent: 10,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft;
              if (!marginLeft) return 0;
              const value = parseInt(marginLeft, 10);
              return isNaN(value) ? 0 : Math.round(value / 40);
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent <= 0) return {};
              return { style: `margin-left: ${attributes.indent * 40}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, {
              indent: Math.min(
                (this.editor.getAttributes(type).indent || 0) + 1,
                this.options.maxIndent
              ),
            })
          );
        },
      outdent:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, {
              indent: Math.max(
                (this.editor.getAttributes(type).indent || 0) - 1,
                this.options.minIndent
              ),
            })
          );
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});
