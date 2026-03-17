'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Table2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDialog } from '@/shared/components/form-dialog';

interface InsertTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
}

export function InsertTableDialog({ open, onOpenChange, editor }: InsertTableDialogProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const handleSubmit = () => {
    if (!editor) return;

    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();

    onOpenChange(false);
    setRows(3);
    setCols(3);
    setWithHeaderRow(true);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Insertar tabla"
      description="Configura las dimensiones de la tabla"
      icon={Table2}
      submitLabel="Insertar"
      onSubmit={handleSubmit}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="table-rows">Filas</Label>
            <Input
              id="table-rows"
              type="number"
              min={1}
              max={20}
              value={rows}
              onChange={(e) => setRows(Math.min(20, Math.max(1, Number(e.target.value))))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="table-cols">Columnas</Label>
            <Input
              id="table-cols"
              type="number"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => setCols(Math.min(10, Math.max(1, Number(e.target.value))))}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="table-header"
            checked={withHeaderRow}
            onCheckedChange={(checked) => setWithHeaderRow(checked === true)}
          />
          <Label htmlFor="table-header" className="cursor-pointer text-sm font-normal">
            Incluir fila de encabezado
          </Label>
        </div>
      </div>
    </FormDialog>
  );
}
