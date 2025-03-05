import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LotResponseDto } from "@/types/project.types";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

interface ProjectLotsTableProps {
  lots: LotResponseDto[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function ProjectLotsTable({
  lots,
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  onPageChange
}: ProjectLotsTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency === 'PEN' ? 'PEN' : 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'default';
      case 'Inactivo':
        return 'default';
      case 'Vendido':
        return 'destructive';
      case 'Separado':
        return 'default';
      default:
        return 'default';
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
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </Card>
    );
  }

  if (!lots.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No se encontraron lotes con los filtros seleccionados.</p>
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)}>
          Volver a la primera página
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote</TableHead>
            <TableHead>Manzana</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead className="text-right">Área (m²)</TableHead>
            <TableHead className="text-right">Precio Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots.map((lot) => {
            const currency = lot.totalPrice > 0 ? 
              (lot.totalPrice > lot.lotPrice + lot.urbanizationPrice ? 'USD' : 'PEN') : 'PEN';
          
            return (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{lot.name}</TableCell>
                <TableCell>{lot.blockName}</TableCell>
                <TableCell>{lot.stageName}</TableCell>
                <TableCell className="text-right">
                  {typeof lot.area === 'number' 
                    ? lot.area.toFixed(2) 
                    : Number(lot.area).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(lot.totalPrice, currency)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(lot.status)}>{lot.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/lotes/${lot.id}`}>
                    <Button variant="ghost" size="sm">Ver</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          Mostrando {getResultsRange()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <div className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}