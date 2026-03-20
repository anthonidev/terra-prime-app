'use client';

import { useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExt from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import type { JSONContent } from '@tiptap/react';

import { VariableChip } from '../editor/variable-node';
import { ResizableImage } from '../editor/resizable-image';

interface TemplatePreviewProps {
  content: string | Record<string, unknown>;
}

export function TemplatePreview({ content }: TemplatePreviewProps) {
  const parsedContent = useMemo<JSONContent | undefined>(() => {
    if (!content) return undefined;
    if (typeof content === 'object') return content as JSONContent;
    try {
      return JSON.parse(content);
    } catch {
      return undefined;
    }
  }, [content]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      UnderlineExt,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      ResizableImage.configure({ allowBase64: true }),
      VariableChip,
    ],
    content: parsedContent,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none font-normal',
        spellcheck: 'false',
      },
    },
  });

  return (
    <div
      className="bg-muted/40 overflow-y-auto rounded-lg border"
      style={{ maxHeight: 'calc(100vh - 340px)' }}
    >
      <div
        className="tiptap-content dark:bg-card mx-auto my-6 min-h-[297mm] w-[210mm] rounded border bg-white shadow-md"
        style={{
          fontFamily: '"Book Antiqua", Palatino, "Palatino Linotype", serif',
          fontSize: '11pt',
          lineHeight: '1.3',
          padding: '2.54cm',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
