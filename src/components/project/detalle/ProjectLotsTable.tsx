import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
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
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency === "PEN" ? "PEN" : "USD",
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "default";
      case "Inactivo":
        return "secondary";
      case "Vendido":
        return "destructive";
      case "Separado":
        return "default";
      default:
        return "default";
    }
  };

  const getResultsRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);
    return `${start}-${end} de ${totalItems}`;
  };

  if (isLoading) {
    return (
      <Card>
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
      <Card>
        <CardHeader className="pb-3 flex justify-between items-center">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
          <LotActions variant="table-header" onCreateClick={onCreateLot} />
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center bg-card/50 rounded-md border">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground mb-4">
              No se encontraron lotes con los filtros seleccionados.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="mx-auto"
            >
              Volver a la primera página
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currency =
    lots[0]?.totalPrice > 0
      ? lots[0].totalPrice > lots[0].lotPrice + lots[0].urbanizationPrice
        ? "USD"
        : "PEN"
      : "PEN";

  return (
    <Card>
      <CardHeader className="pb-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
          </Badge>
        </div>
        <LotActions variant="table-header" onCreateClick={onCreateLot} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="bg-card/60 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-medium">Ubicación</TableHead>
                  <TableHead className="font-medium text-right">
                    Área (m²)
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Precio Lote
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Precio Urb.
                  </TableHead>
                  <TableHead className="font-medium text-right">
                    Precio Total
                  </TableHead>
                  <TableHead className="font-medium">Estado</TableHead>
                  <TableHead className="font-medium text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lots.map((lot, index) => {
                  const currencySymbol = currency === "PEN" ? "S/" : "$";

                  return (
                    <motion.tr
                      key={lot.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-accent/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center min-w-10 h-8 rounded-md bg-primary/10 text-primary font-medium">
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
                      <TableCell className="text-right">
                        {typeof lot.area === "number"
                          ? lot.area.toFixed(2)
                          : Number(lot.area).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lot.lotPrice, currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lot.urbanizationPrice, currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lot.totalPrice, currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(lot.status)}>
                          {lot.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between px-4 py-3 bg-card/60 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {getResultsRange()}
            </div>
            <div className="flex items-center space-x-2">
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
              <span className="text-sm font-medium">
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
