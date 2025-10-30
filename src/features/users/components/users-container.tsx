'use client';

import { Plus } from 'lucide-react';

import { PageHeader } from '@/shared/components/common/page-header';
import { Button } from '@/components/ui/button';

import { useUsersContainer } from '../hooks/use-users-container';
import { UsersFilters } from './users-filters';
import { UsersTable } from './users-table';
import { UserFormDialog } from './user-form-dialog';
import { UsersSkeleton } from './users-skeleton';

export function UsersContainer() {
  const {
    filters,
    data,
    isLoading,
    isError,
    isDialogOpen,
    selectedUser,
    handleFiltersChange,
    handlePageChange,
    handleCreateUser,
    handleEditUser,
    handleDialogChange,
  } = useUsersContainer();

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los usuarios</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de usuarios"
        description="Administra los usuarios de la aplicación"
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total de usuarios: {data.meta.totalItems}
        </p>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Crear usuario
        </Button>
      </div>

      {/* Filters */}
      <UsersFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Table */}
      <UsersTable
        users={data.items}
        meta={data.meta}
        onPageChange={handlePageChange}
        onEditUser={handleEditUser}
      />

      {/* Create/Edit Dialog */}
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        user={selectedUser}
      />
    </div>
  );
}
