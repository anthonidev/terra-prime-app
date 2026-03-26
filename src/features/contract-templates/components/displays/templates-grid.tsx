'use client';

import { useMemo, ViewTransition } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Eye,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';
import { generateHTML } from '@tiptap/html';
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
import Image from '@tiptap/extension-image';
import { mergeAttributes, Node } from '@tiptap/core';

import { Badge } from '@/components/ui/badge';
import { FontSize } from '../editor/font-size';
import { Indent } from '../editor/indent';
import { LineHeight } from '../editor/line-height';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateOnly } from '@/shared/utils/date-formatter';
import type { ContractTemplateListItem } from '../../types';
import { TemplateStatus } from '../../types';

const STATUS_BADGE: Record<
  TemplateStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline'; dot: string }
> = {
  [TemplateStatus.DRAFT]: { label: 'Borrador', variant: 'secondary', dot: 'bg-muted-foreground' },
  [TemplateStatus.ACTIVE]: { label: 'Activo', variant: 'default', dot: 'bg-emerald-500' },
  [TemplateStatus.INACTIVE]: { label: 'Inactivo', variant: 'outline', dot: 'bg-orange-400' },
};

const extensions = [
  StarterKit,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  UnderlineExt,
  Color,
  TextStyle,
  Highlight.configure({ multicolor: true }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  FontSize,
  Indent,
  LineHeight,
  Node.create({
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
      return [
        'span',
        mergeAttributes(HTMLAttributes, {
          style:
            'display: inline-flex; align-items: center; gap: 2px; background: hsl(var(--primary) / 0.1); color: hsl(var(--primary)); border: 1px solid hsl(var(--primary) / 0.2); border-radius: 4px; padding: 0 6px; font-size: 0.75rem; font-family: monospace; white-space: nowrap;',
        }),
        ['span', { style: 'opacity: 0.6; font-size: 0.65rem;' }, '{ }'],
        ['span', {}, HTMLAttributes['data-variable-label'] || HTMLAttributes['data-variable-key']],
      ];
    },
  }),
  Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: null,
          parseHTML: (element) => {
            const width = element.getAttribute('width') || element.style.width;
            return width ? parseInt(width, 10) || null : null;
          },
          renderHTML: (attributes) => {
            if (!attributes.width) return {};
            return { width: attributes.width };
          },
        },
        textAlign: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-text-align'),
          renderHTML: (attributes) => {
            if (!attributes.textAlign) return {};
            return { 'data-text-align': attributes.textAlign };
          },
        },
      };
    },
    renderHTML({ HTMLAttributes }) {
      const { textAlign, width, ...rest } = HTMLAttributes;
      const styles: string[] = ['display: block'];
      if (width) styles.push(`width: ${width}px`);
      if (textAlign === 'center') {
        styles.push('margin-left: auto', 'margin-right: auto');
      } else if (textAlign === 'right') {
        styles.push('margin-left: auto', 'margin-right: 0');
      }
      return ['img', { ...rest, style: styles.join('; ') }];
    },
  }).configure({ allowBase64: true }),
];

function getPreviewHtml(contentPreview: Record<string, unknown>): string {
  try {
    return generateHTML(contentPreview as Parameters<typeof generateHTML>[0], extensions);
  } catch {
    return '<p style="color: var(--muted-foreground)">Sin vista previa disponible</p>';
  }
}

interface TemplatesGridProps {
  data: ContractTemplateListItem[];
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplatesGrid({ data, onPublish, onUnpublish, onDelete }: TemplatesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.map((template) => (
        <ViewTransition key={template.id} name={`template-${template.id}`}>
          <TemplateCard
            template={template}
            onPublish={() => onPublish(template.id)}
            onUnpublish={() => onUnpublish(template.id)}
            onDelete={() => onDelete(template.id)}
          />
        </ViewTransition>
      ))}
    </div>
  );
}

interface TemplateCardProps {
  template: ContractTemplateListItem;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}

function TemplateCard({ template, onPublish, onUnpublish, onDelete }: TemplateCardProps) {
  const badge = STATUS_BADGE[template.status];
  const isDraft = template.status === TemplateStatus.DRAFT;
  const isActive = template.status === TemplateStatus.ACTIVE;

  const previewHtml = useMemo(
    () => getPreviewHtml(template.contentPreview),
    [template.contentPreview]
  );

  return (
    <Link
      href={`/contratos/plantillas/${template.id}`}
      className="bg-card group flex cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-lg"
    >
      {/* A4 Preview */}
      <div className="bg-muted/30 relative overflow-hidden border-b" style={{ height: 220 }}>
        <div
          className="tiptap-content prose dark:prose-invert absolute top-0 left-1/2 origin-top -translate-x-1/2 scale-[0.82] overflow-hidden bg-white dark:bg-zinc-900"
          style={{
            fontFamily: '"Book Antiqua", Palatino, "Palatino Linotype", serif',
            fontSize: '11pt',
            lineHeight: '1.3',
            padding: '24px 32px',
            width: '122%',
            maxWidth: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
        <div className="from-muted/30 pointer-events-none absolute right-0 bottom-0 left-0 h-14 bg-gradient-to-t to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{template.name}</h3>
            {template.description && (
              <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                {template.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Badge variant={badge.variant} className="gap-1 text-[10px]">
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
              {badge.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/contratos/plantillas/${template.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalle
                  </Link>
                </DropdownMenuItem>
                {isDraft && (
                  <DropdownMenuItem asChild>
                    <Link href={`/contratos/plantillas/editar/${template.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isDraft && (
                  <DropdownMenuItem onClick={onPublish}>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Publicar
                  </DropdownMenuItem>
                )}
                {isActive && (
                  <DropdownMenuItem onClick={onUnpublish}>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Despublicar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Meta */}
        <div className="text-muted-foreground mt-auto flex items-center gap-3 border-t pt-2 text-[11px]">
          <span className="flex items-center gap-1">
            <FolderOpen className="h-3 w-3" />
            {template.project?.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateOnly(template.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
