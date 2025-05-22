'use client';

import UsersTable from '@/app/(dashboard)/usuarios/components/UsersTable';
import { PageHeader } from '@components/common/PageHeader';
import { useUsers } from '@/app/(dashboard)/usuarios/hooks/useUsers';

export default function Usuarios() {
  const {
    usersItems,
    usersMeta,
    usersLoading,
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
    handleCreateUser
  } = useUsers();

  return (
    <div className="container py-8">
      <PageHeader title="Usuarios" subtitle="Gestiona los usuarios del sistema" variant="default" />
      <UsersTable
        data={usersItems}
        isLoading={usersLoading}
        meta={usersMeta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
        search={search}
        handleCreateUser={handleCreateUser}
        handleUpdateUser={handleUpdateUser}
        handleSearchChange={handleSearchChange}
        isActive={isActive}
        handleIsActiveChange={handleIsActiveChange}
        order={order}
        handleOrderChange={handleOrderChange}
        roles={roles}
        rolesLoading={rolesLoading}
      />
    </div>
  );
}
