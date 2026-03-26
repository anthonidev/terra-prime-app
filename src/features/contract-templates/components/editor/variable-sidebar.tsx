'use client';

import { useMemo, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Braces,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FolderOpen,
  Landmark,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTemplateVariables } from '../../hooks/use-template-variables';
import type { CustomVariable, PredefinedVariable } from '../../types';

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Braces; color: string }> = {
  SYSTEM: { label: 'Sistema', icon: Settings, color: 'text-slate-500' },
  SALE: { label: 'Venta', icon: ShoppingCart, color: 'text-emerald-500' },
  FINANCING: { label: 'Financiamiento', icon: Landmark, color: 'text-blue-500' },
  CLIENT: { label: 'Cliente', icon: User, color: 'text-violet-500' },
  PROJECT: { label: 'Proyecto', icon: FolderOpen, color: 'text-amber-500' },
  PAYMENT: { label: 'Pago', icon: CreditCard, color: 'text-rose-500' },
  CUSTOM: { label: 'Personalizadas', icon: Braces, color: 'text-cyan-500' },
};

interface VariableSidebarProps {
  editor: Editor | null;
  customVariables: CustomVariable[];
  onAddCustomVariable: () => void;
}

export function VariableSidebar({
  editor,
  customVariables,
  onAddCustomVariable,
}: VariableSidebarProps) {
  const { data: predefinedVariables = [] } = useTemplateVariables();
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const groups: Record<string, PredefinedVariable[]> = {};

    const filtered = predefinedVariables.filter(
      (v) =>
        v.label.toLowerCase().includes(search.toLowerCase()) ||
        v.key.toLowerCase().includes(search.toLowerCase())
    );

    for (const variable of filtered) {
      const cat = variable.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(variable);
    }

    return groups;
  }, [predefinedVariables, search]);

  const filteredCustom = useMemo(
    () =>
      customVariables.filter(
        (v) =>
          v.label.toLowerCase().includes(search.toLowerCase()) ||
          v.key.toLowerCase().includes(search.toLowerCase())
      ),
    [customVariables, search]
  );

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const insertVariable = (key: string, label: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'variableChip',
        attrs: { variableKey: key, variableLabel: label },
      })
      .run();
  };

  const totalVars = predefinedVariables.length + customVariables.length;

  return (
    <div className="bg-card flex w-full shrink-0 flex-col overflow-hidden border-l xl:w-[280px]">
      {/* Header */}
      <div className="space-y-2.5 border-b px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Braces className="text-primary h-4 w-4" />
            <h3 className="text-sm font-semibold">Variables</h3>
          </div>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
            {totalVars}
          </Badge>
        </div>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2 left-2.5 h-3.5 w-3.5" />
          <Input
            placeholder="Buscar variable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 rounded-md pl-8 text-xs"
          />
        </div>
      </div>

      {/* Variable list */}
      <TooltipProvider delayDuration={400}>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-0.5 p-1.5">
            {Object.entries(grouped).map(([category, variables]) => {
              const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.CUSTOM;
              return (
                <CategorySection
                  key={category}
                  label={config.label}
                  icon={config.icon}
                  iconColor={config.color}
                  count={variables.length}
                  collapsed={collapsedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                >
                  {variables.map((v) => (
                    <VariableButton
                      key={v.key}
                      label={v.label}
                      variableKey={v.key}
                      onClick={() => insertVariable(v.key, v.label)}
                    />
                  ))}
                </CategorySection>
              );
            })}

            <CategorySection
              label="Personalizadas"
              icon={CATEGORY_CONFIG.CUSTOM.icon}
              iconColor={CATEGORY_CONFIG.CUSTOM.color}
              count={filteredCustom.length}
              collapsed={collapsedCategories.has('CUSTOM')}
              onToggle={() => toggleCategory('CUSTOM')}
              action={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddCustomVariable();
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Agregar variable
                  </TooltipContent>
                </Tooltip>
              }
            >
              {filteredCustom.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center gap-1 py-3 text-center text-[11px]">
                  <Braces className="h-4 w-4 opacity-40" />
                  <span>Sin variables personalizadas</span>
                </div>
              ) : (
                filteredCustom.map((v) => (
                  <VariableButton
                    key={v.key}
                    label={v.label}
                    variableKey={v.key}
                    onClick={() => insertVariable(v.key, v.label)}
                  />
                ))
              )}
            </CategorySection>
          </div>
        </div>
      </TooltipProvider>

      {/* Footer hint */}
      <div className="text-muted-foreground border-t px-3 py-2 text-center text-[10px]">
        Click en una variable para insertarla
      </div>
    </div>
  );
}

function CategorySection({
  label,
  icon: Icon,
  iconColor,
  count,
  collapsed,
  onToggle,
  action,
  children,
}: {
  label: string;
  icon: typeof Braces;
  iconColor: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md">
      <div className="hover:bg-muted/60 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors">
        <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-2">
          {collapsed ? (
            <ChevronRight className="text-muted-foreground h-3 w-3 shrink-0" />
          ) : (
            <ChevronDown className="text-muted-foreground h-3 w-3 shrink-0" />
          )}
          <Icon className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
          <span className="flex-1 text-left font-medium">{label}</span>
        </button>
        {action}
        <Badge variant="outline" className="h-4 px-1 text-[9px] font-normal">
          {count}
        </Badge>
      </div>
      {!collapsed && <div className="mb-1 ml-3 space-y-px border-l pl-2">{children}</div>}
    </div>
  );
}

function VariableButton({
  label,
  variableKey,
  onClick,
}: {
  label: string;
  variableKey: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className="hover:bg-primary/5 hover:text-primary flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] transition-colors"
        >
          <span className="bg-primary/40 h-1.5 w-1.5 shrink-0 rounded-full" />
          <span className="truncate">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        <code className="text-[10px]">{`{{${variableKey}}}`}</code>
      </TooltipContent>
    </Tooltip>
  );
}
