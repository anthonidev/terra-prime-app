import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Braces } from 'lucide-react';

export function VariableChipView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="span" className="inline">
      <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-sm">
        <Braces className="h-3 w-3" />
        {node.attrs.variableLabel}
      </span>
    </NodeViewWrapper>
  );
}
