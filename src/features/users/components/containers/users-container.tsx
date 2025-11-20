'use client';

import { Plus } from 'lucide-react';

import { PageHeader } from '@/shared/components/common/page-header';
import { Button } from '@/components/ui/button';

import { useUsersContainer } from '../../hooks/use-users-container';
import { UsersFilters } from '../filters/users-filters';
import { UsersTable } from '../tables/users-table';
import { UserFormDialog } from '../dialogs/user-form-dialog';
import { UsersSkeleton } from '../skeletons/users-skeleton';

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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los usuarios</p>
          <p className="text-muted-foreground mt-2 text-sm">Intenta recargar la página</p>
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
        <p className="text-muted-foreground text-sm">Total de usuarios: {data.meta.totalItems}</p>
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
      <UserFormDialog open={isDialogOpen} onOpenChange={handleDialogChange} user={selectedUser} />
    </div>
  );
}
