"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./Columns";
import { UsersTableFilters } from "./UsersTableFilters";
import { UsersTablePagination } from "./UsersTablePagination";
import { UpdateUserModal } from "./UpdateUserModal";
import { UserList } from "@/types/user.types";
import { useUsersTable } from "@/hooks/useUsersTable";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CreateUserModal } from "./CreateUserModal";
export default function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    data,
    loading,
    roles,
    rolesLoading,
    search,
    currentPage,
    itemsPerPage,
    isActive,
    order,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,
    handleUpdateUser,
    handleCreateUser,
  } = useUsersTable();
  const handleEdit = (user: UserList) => {
    setSelectedUser(user);
  };
  const handleCloseModals = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(false);
  };
  const table = useReactTable({
    data: data?.items || [],
    columns: columns(handleEdit),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <UsersTableFilters
          search={search}
          onSearchChange={handleSearchChange}
          isActive={isActive}
          onIsActiveChange={handleIsActiveChange}
          order={order}
          onOrderChange={handleOrderChange}
        />
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-table-header hover:bg-table-header"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-table-header-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns(handleEdit).length}
                  className="h-24 text-center bg-table-loading-background"
                >
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-table-row hover:bg-table-row-hover"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-table-row-foreground"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns(handleEdit).length}
                  className="h-24 text-center bg-table-empty-background text-table-empty-foreground"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data && (
        <UsersTablePagination
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
      {selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          isOpen={true}
          onClose={handleCloseModals}
          onUpdate={handleUpdateUser}
          roles={roles}
          rolesLoading={rolesLoading}
        />
      )}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onCreate={handleCreateUser}
        roles={roles}
        rolesLoading={rolesLoading}
      />
    </div>
  );
}
