'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
import { toast } from 'sonner';

import { cn } from '@/shared/lib/utils';
import { VariableChip } from './variable-node';
import { ResizableImage } from './resizable-image';
import { TiptapToolbar } from './tiptap-toolbar';
import { VariableSidebar } from './variable-sidebar';
import { TableMenu } from './table-menu';
import { InsertTableDialog } from '../dialogs/insert-table-dialog';
import type { CustomVariable } from '../../types';

interface TiptapEditorProps {
  content?: JSONContent;
  onUpdate: (json: JSONContent) => void;
  customVariables: CustomVariable[];
  onAddCustomVariable: () => void;
  onSave?: () => void;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onUpdate,
  customVariables,
  onAddCustomVariable,
  onSave,
  editable = true,
}: TiptapEditorProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);

  const insertImageFile = useCallback((file: File) => {
    if (file.size > 500 * 1024) {
      toast.error('La imagen no debe superar 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editorRef.current?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpdate = useCallback(
    (json: JSONContent) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onUpdate(json);
      }, 300);
    },
    [onUpdate]
  );

  useEffect(() => {
    if (!onSave) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escribe el contenido del contrato...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      UnderlineExt,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      ResizableImage.configure({ allowBase64: true, inline: false }),
      VariableChip,
    ],
    content,
    editable,
    onUpdate: ({ editor: ed }) => {
      handleUpdate(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert max-w-none focus:outline-none font-normal',
          !editable && 'cursor-default'
        ),
        spellcheck: 'false',
      },
      handlePaste: (view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        // Check files first (copy from file explorer)
        if (clipboard.files?.length) {
          for (const file of Array.from(clipboard.files)) {
            if (file.type.startsWith('image/')) {
              event.preventDefault();
              insertImageFile(file);
              return true;
            }
          }
        }

        // Check items (screenshot / clipboard image)
        const items = clipboard.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) insertImageFile(file);
              return true;
            }
          }
        }

        // Check for HTML with img src (copy image from browser)
        const html = clipboard.getData('text/html');
        if (html) {
          const match = html.match(/<img[^>]+src="(data:image\/[^"]+)"/);
          if (match?.[1]) {
            event.preventDefault();
            editorRef.current?.chain().focus().setImage({ src: match[1] }).run();
            return true;
          }
        }

        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        for (const file of Array.from(files)) {
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            insertImageFile(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return (
    <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-lg border">
      <div className="flex min-w-0 flex-1 flex-col">
        {editable && (
          <TiptapToolbar
            editor={editor}
            onInsertTable={() => setTableDialogOpen(true)}
            onInsertImage={insertImageFile}
          />
        )}
        <div className="bg-muted/40 flex-1 overflow-y-auto">
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
      </div>
      {editable && (
        <VariableSidebar
          editor={editor}
          customVariables={customVariables}
          onAddCustomVariable={onAddCustomVariable}
        />
      )}
      {editable && editor && <TableMenu editor={editor} />}
      <InsertTableDialog open={tableDialogOpen} onOpenChange={setTableDialogOpen} editor={editor} />
    </div>
  );
}
