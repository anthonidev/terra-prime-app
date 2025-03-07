import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LotResponseDto } from "@/types/project.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";
import LotActions from "./LotActions";
interface ProjectLotsTableProps {
  lots: LotResponseDto[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCreateLot: (blockId?: string) => void;
  onEditLot: (lot: LotResponseDto) => void;
}
export default function ProjectLotsTable({
  lots,
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onCreateLot,
  onEditLot,
}: ProjectLotsTableProps) {
  const [activeSortColumn, setActiveSortColumn] = useState<string | null>(null);
  const handleSort = (column: string) => {
    if (activeSortColumn !== column) {
      setActiveSortColumn(column);
    }
  };
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency === "PEN" ? "PEN" : "USD",
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400";
      case "Inactivo":
        return "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-400";
      case "Vendido":
        return "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900 dark:text-purple-400";
      case "Separado":
        return "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };
  const getResultsRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);
    return `${start}-${end} de ${totalItems}`;
  };
  const lotsByStatus = {
    activos: lots.filter((lot) => lot.status === "Activo").length,
    inactivos: lots.filter((lot) => lot.status === "Inactivo").length,
    vendidos: lots.filter((lot) => lot.status === "Vendido").length,
    separados: lots.filter((lot) => lot.status === "Separado").length,
  };
  const totalLotValue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);
  const currency =
    lots.length > 0
      ? lots[0].totalPrice > lots[0].lotPrice + lots[0].urbanizationPrice
        ? "USD"
        : "PEN"
      : "PEN";
  if (isLoading) {
    return (
      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!lots.length) {
    return (
      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3 flex justify-between items-center">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
          <LotActions variant="table-header" onCreateClick={onCreateLot} />
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center bg-secondary/5 rounded-md border border-dashed">
            <div className="bg-secondary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              No se encontraron lotes
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No hay lotes que coincidan con los filtros seleccionados. Intenta
              ajustar tus criterios de búsqueda.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
              >
                Reiniciar filtros
              </Button>
              <Button
                onClick={() => onCreateLot()}
                className="bg-primary text-primary-foreground"
                size="sm"
              >
                Crear lote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-sm border-border/80">
      <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
            </Badge>
          </div>
          {}
          <div className="flex items-center gap-3 mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>{lotsByStatus.activos} activos</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
              <span>{lotsByStatus.separados} separados</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></div>
              <span>{lotsByStatus.vendidos} vendidos</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></div>
              <span>{lotsByStatus.inactivos} inactivos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar a Excel</DropdownMenuItem>
              <DropdownMenuItem>Exportar a CSV</DropdownMenuItem>
              <DropdownMenuItem>Imprimir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <LotActions variant="table-header" onCreateClick={onCreateLot} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="bg-secondary/10 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-medium">
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("name")}
                    >
                      Ubicación
                      {activeSortColumn === "name" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    <div
                      className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("area")}
                    >
                      Área (m²)
                      {activeSortColumn === "area" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    <div
                      className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("lotPrice")}
                    >
                      Precio Lote
                      {activeSortColumn === "lotPrice" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    <div
                      className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("urbanizationPrice")}
                    >
                      Precio Urb.
                      {activeSortColumn === "urbanizationPrice" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    <div
                      className="flex items-center justify-end gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("totalPrice")}
                    >
                      Precio Total
                      {activeSortColumn === "totalPrice" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-primary"
                      onClick={() => handleSort("status")}
                    >
                      Estado
                      {activeSortColumn === "status" && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-right w-[100px]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {lots.map((lot, index) => {
                    return (
                      <motion.tr
                        key={lot.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-secondary/5 cursor-pointer"
                        onClick={() => onEditLot(lot)}
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-8 rounded-md bg-primary/10 text-primary font-medium">
                              {lot.name}
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="text-xs text-muted-foreground">
                                Etapa:{" "}
                                <span className="font-medium">
                                  {lot.stageName}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Mz:{" "}
                                <span className="font-medium">
                                  {lot.blockName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          {typeof lot.area === "number"
                            ? lot.area.toFixed(2)
                            : Number(lot.area).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium py-2">
                          {formatCurrency(lot.lotPrice, currency)}
                        </TableCell>
                        <TableCell className="text-right font-medium py-2">
                          {formatCurrency(lot.urbanizationPrice, currency)}
                        </TableCell>
                        <TableCell className="text-right font-medium py-2">
                          {formatCurrency(lot.totalPrice, currency)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            className={`border ${getStatusBgColor(lot.status)}`}
                          >
                            {lot.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end items-center space-x-1">
                            <LotActions
                              variant="table-cell"
                              lot={lot}
                              onCreateClick={onCreateLot}
                              onEditClick={onEditLot}
                            />
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-card/60 border-t">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <div className="text-sm text-muted-foreground">
                Mostrando {getResultsRange()}
              </div>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(totalLotValue, currency)} en total
              </div>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex h-8 w-8"
                aria-label="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs">Anterior</span>
              </Button>
              <span className="text-sm font-medium px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                <span className="hidden sm:inline text-xs">Siguiente</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex h-8 w-8"
                aria-label="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
