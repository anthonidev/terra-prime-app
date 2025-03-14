import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Search } from "lucide-react";
import LeadTableRow from "./LeadTableRow";
import LeadsTablePagination from "./LeadsTablePagination";
import { Lead } from "@/types/leads.types";

interface LeadsTableProps {
  data: {
    data: Lead[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null;
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  onViewDetails: (id: string) => void;
  onRegisterDeparture: (id: string) => void;
}

export default function LeadsTable({
  data,
  loading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onViewDetails,
  onRegisterDeparture,
}: LeadsTableProps) {
  // Render de estado de carga
  const renderLoading = () => (
    <TableRow>
      <TableCell colSpan={7} className="h-96 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando leads...</p>
        </div>
      </TableCell>
    </TableRow>
  );

  // Render de estado vacío
  const renderEmpty = () => (
    <TableRow>
      <TableCell colSpan={7} className="h-96 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No se encontraron leads</h3>
          <p className="text-muted-foreground mb-4">
            No hay leads que coincidan con los criterios de búsqueda.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Listado de Leads
          </CardTitle>

          {data && !loading && (
            <Badge variant="outline" className="font-normal">
              {data.meta.totalItems}{" "}
              {data.meta.totalItems === 1 ? "resultado" : "resultados"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                <TableHead className="font-medium">Información</TableHead>
                <TableHead className="font-medium">Documento</TableHead>
                <TableHead className="font-medium">Contacto</TableHead>
                <TableHead className="font-medium">Fuente</TableHead>
                <TableHead className="font-medium">Estado</TableHead>
                <TableHead className="font-medium">Fecha</TableHead>
                <TableHead className="font-medium text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? renderLoading()
                : data?.data && data.data.length > 0
                  ? data.data.map((lead) => (
                      <LeadTableRow
                        key={lead.id}
                        lead={lead}
                        onViewDetails={onViewDetails}
                        onRegisterDeparture={onRegisterDeparture}
                      />
                    ))
                  : renderEmpty()}
            </TableBody>
          </Table>
        </div>

        {data && !loading && data.data.length > 0 && (
          <LeadsTablePagination
            meta={data.meta}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
