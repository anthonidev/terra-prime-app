"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLeadSources } from "@/hooks/leads/useLeadSources";
import LeadSourcesTableFilters from "./LeadSourcesTableFilters";
import LeadSourcesTablePagination from "./LeadSourcesTablePagination";
import CreateLeadSourceModal from "./CreateLeadSourceModal";
import UpdateLeadSourceModal from "./UpdateLeadSourceModal";
export default function LeadSourcesTable() {
  const {
    data,
    loading,
    search,
    currentPage,
    itemsPerPage,
    isActive,
    order,
    isCreateModalOpen,
    isUpdateModalOpen,
    selectedLeadSource,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,
    openCreateModal,
    openUpdateModal,
    closeModals,
    handleCreateLeadSource,
    handleUpdateLeadSource,
  } = useLeadSources();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LeadSourcesTableFilters
          search={search}
          onSearchChange={handleSearchChange}
          isActive={isActive}
          onIsActiveChange={handleIsActiveChange}
          order={order}
          onOrderChange={handleOrderChange}
        />
        <Button
          onClick={openCreateModal}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Fuente
        </Button>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">ID</TableHead>
              <TableHead className="text-table-header-foreground">
                Nombre
              </TableHead>
              <TableHead className="text-table-header-foreground">
                Estado
              </TableHead>
              <TableHead className="text-table-header-foreground">
                Fecha de creación
              </TableHead>
              <TableHead className="text-table-header-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center bg-table-loading-background"
                >
                  Cargando fuentes de leads...
                </TableCell>
              </TableRow>
            ) : data?.data.length ? (
              data.data.map((source) => (
                <TableRow
                  key={source.id}
                  className="bg-table-row hover:bg-table-row-hover"
                >
                  <TableCell className="text-table-row-foreground">
                    {source.id}
                  </TableCell>
                  <TableCell className="text-table-row-foreground font-medium">
                    {source.name}
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge
                      variant={source.isActive ? "default" : "destructive"}
                    >
                      {source.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    {format(new Date(source.createdAt), "PPP", { locale: es })}
                  </TableCell>
                  <TableCell className="text-table-row-foreground text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openUpdateModal(source)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center bg-table-empty-background text-table-empty-foreground"
                >
                  No se encontraron fuentes de leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data && (
        <LeadSourcesTablePagination
          data={data}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
      <CreateLeadSourceModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onCreate={handleCreateLeadSource}
      />
      {selectedLeadSource && (
        <UpdateLeadSourceModal
          isOpen={isUpdateModalOpen}
          onClose={closeModals}
          leadSource={selectedLeadSource}
          onUpdate={handleUpdateLeadSource}
        />
      )}
    </div>
  );
}
