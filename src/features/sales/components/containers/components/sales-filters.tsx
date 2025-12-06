'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { useActiveProjects } from '../../../hooks/use-active-projects';
import { SaleType, StatusSale } from '../../../types';

interface SalesFiltersProps {
  order: 'ASC' | 'DESC';
  onToggleOrder: () => void;
  status?: StatusSale;
  onStatusChange: (status: StatusSale | undefined) => void;
  type?: SaleType;
  onTypeChange: (type: SaleType | undefined) => void;
  projectId?: string;
  onProjectChange: (projectId: string | undefined) => void;
  clientName?: string;
  onClientNameChange: (name: string | undefined) => void;
}

export function SalesFilters({
  order,
  onToggleOrder,
  status,
  onStatusChange,
  type,
  onTypeChange,
  projectId,
  onProjectChange,
  clientName,
  onClientNameChange,
}: SalesFiltersProps) {
  const OrderIcon = order === 'ASC' ? ArrowUp : ArrowDown;
  const { data: projects = [] } = useActiveProjects();

  const handleClearFilters = () => {
    onStatusChange(undefined);
    onTypeChange(undefined);
    onProjectChange(undefined);
    onClientNameChange(undefined);
  };

  const hasActiveFilters = status || type || projectId || clientName;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="border-none shadow-sm">
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Filters Row */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search Client */}
              <div className="relative col-span-1 lg:col-span-2">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente..."
                  className="pl-9"
                  value={clientName || ''}
                  onChange={(e) => onClientNameChange(e.target.value || undefined)}
                />
              </div>

              {/* Status Filter */}
              <Select
                value={status || 'ALL'}
                onValueChange={(val) =>
                  onStatusChange(val === 'ALL' ? undefined : (val as StatusSale))
                }
              >
                <SelectTrigger className={status ? 'border-primary' : ''}>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  {Object.values(StatusSale).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select
                value={type || 'ALL'}
                onValueChange={(val) => onTypeChange(val === 'ALL' ? undefined : (val as SaleType))}
              >
                <SelectTrigger className={type ? 'border-primary' : ''}>
                  <SelectValue placeholder="Tipo de venta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los tipos</SelectItem>
                  <SelectItem value={SaleType.DIRECT_PAYMENT}>Contado</SelectItem>
                  <SelectItem value={SaleType.FINANCED}>Financiado</SelectItem>
                </SelectContent>
              </Select>

              {/* Project Filter */}
              <Select
                value={projectId || 'ALL'}
                onValueChange={(val) => onProjectChange(val === 'ALL' ? undefined : val)}
              >
                <SelectTrigger className={projectId ? 'border-primary' : ''}>
                  <SelectValue placeholder="Proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los proyectos</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={onToggleOrder} className="h-9 gap-2">
                <OrderIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {order === 'ASC' ? 'Más Antiguas' : 'Más Recientes'}
                </span>
                <span className="sm:hidden">Orden</span>
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 gap-2 text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
