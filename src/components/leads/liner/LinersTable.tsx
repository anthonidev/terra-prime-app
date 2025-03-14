"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLiners } from "@/hooks/leads/useLiners";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Plus, User } from "lucide-react";
import LinersTableFilters from "./LinersTableFilters";
import LinersTablePagination from "./LinersTablePagination";
import CreateLinerModal from "./CreateLinerModal";
import UpdateLinerModal from "./UpdateLinerModal";
export default function LinersTable() {
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
    selectedLiner,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,
    openCreateModal,
    openUpdateModal,
    closeModals,
    handleCreateLiner,
    handleUpdateLiner,
  } = useLiners();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LinersTableFilters
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
          Nuevo Liner
        </Button>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">
                Nombre completo
              </TableHead>
              <TableHead className="text-table-header-foreground">
                Documento
              </TableHead>
              <TableHead className="text-table-header-foreground">
                Tipo
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
                  Cargando liners...
                </TableCell>
              </TableRow>
            ) : data?.data.length ? (
              data.data.map((liner) => (
                <TableRow
                  key={liner.id}
                  className="bg-table-row hover:bg-table-row-hover"
                >
                  <TableCell className="text-table-row-foreground font-medium">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary/70" />
                      {liner.firstName} {liner.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    {liner.document}
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge variant="outline" className="bg-secondary/30">
                      {liner.documentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge variant={liner.isActive ? "default" : "destructive"}>
                      {liner.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    {format(new Date(liner.createdAt), "PPP", { locale: es })}
                  </TableCell>
                  <TableCell className="text-table-row-foreground text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openUpdateModal(liner)}
                    >
                      <Pencil className="h-4 w-4" />
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
                  No se encontraron liners.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data && (
        <LinersTablePagination
          data={data}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
      <CreateLinerModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onCreate={handleCreateLiner}
      />
      {selectedLiner && (
        <UpdateLinerModal
          isOpen={isUpdateModalOpen}
          onClose={closeModals}
          liner={selectedLiner}
          onUpdate={handleUpdateLiner}
        />
      )}
    </div>
  );
}
