import { Input } from "@/components/ui/input";
import {
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  MapPin,
  FilterX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LeadsTableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isInOffice: boolean | undefined;
  onIsInOfficeChange: (value: boolean | undefined) => void;
  startDate: string | undefined;
  endDate: string | undefined;
  onDateRangeChange: (start?: string, end?: string) => void;
  order: "ASC" | "DESC";
  onOrderChange: (value: "ASC" | "DESC") => void;
  onResetFilters: () => void;
}

export default function LeadsTableFilters({
  search,
  onSearchChange,
  isInOffice,
  onIsInOfficeChange,
  startDate,
  endDate,
  onDateRangeChange,
  order,
  onOrderChange,
  onResetFilters,
}: LeadsTableFiltersProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  // Determinar si hay filtros activos
  const hasActiveFilters =
    search || isInOffice !== undefined || dateRange.from || dateRange.to;

  // Manejador para cambios en el calendario
  const handleCalendarChange = (range: { from?: Date; to?: Date }) => {
    setDateRange({
      from: range.from ?? undefined,
      to: range.to ?? undefined,
    });
    onDateRangeChange(range.from?.toISOString(), range.to?.toISOString());
  };

  return (
    <div className="bg-card shadow-sm rounded-md border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FilterX className="h-4 w-4 text-primary" />
          Filtros de búsqueda
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Filtros activos
            </Badge>
          )}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 text-xs"
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background border-input"
          />
        </div>

        {/* Filtro de en oficina */}
        <Select
          value={isInOffice === undefined ? "all" : isInOffice.toString()}
          onValueChange={(value) => {
            onIsInOfficeChange(
              value === "all" ? undefined : value === "true" ? true : false
            );
          }}
        >
          <SelectTrigger className="bg-background border-input">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Estado de visita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">En oficina</SelectItem>
            <SelectItem value="false">No en oficina</SelectItem>
          </SelectContent>
        </Select>

        {/* Selector de fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                (dateRange.from || dateRange.to) && "text-primary"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: es })
                )
              ) : (
                "Seleccionar fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) =>
                handleCalendarChange(
                  range ?? { from: undefined, to: undefined }
                )
              }
              numberOfMonths={2}
              locale={es}
            />
            <div className="flex justify-end gap-2 p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  onDateRangeChange(undefined, undefined);
                }}
              >
                Limpiar
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Orden */}
        <Select
          value={order}
          onValueChange={(value: "ASC" | "DESC") => onOrderChange(value)}
        >
          <SelectTrigger className="bg-background border-input">
            {order === "DESC" ? (
              <SortDesc className="mr-2 h-4 w-4 text-muted-foreground" />
            ) : (
              <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Más recientes</SelectItem>
            <SelectItem value="ASC">Más antiguos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
