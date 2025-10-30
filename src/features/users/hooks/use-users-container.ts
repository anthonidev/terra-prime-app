import { useCallback, useState } from 'react';

import { useUsers } from './use-users';
import type { User, UsersQueryParams } from '../types';

const DEFAULT_FILTERS: UsersQueryParams = {
  page: 1,
  limit: 20,
  order: 'DESC',
};

export function useUsersContainer() {
  const [filters, setFilters] = useState<UsersQueryParams>(DEFAULT_FILTERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, isError } = useUsers(filters);

  const handleFiltersChange = useCallback((newFilters: UsersQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  }, []);

  return {
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
  };
}
