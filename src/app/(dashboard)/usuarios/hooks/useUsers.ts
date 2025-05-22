import { useState, useCallback, useEffect } from 'react';
import { CreateUserDto, UpdateUserDto, Role, UserList } from '@/types/user';
import { getUsers, createUser, updateUser } from '@/lib/actions/users/userActions';
import { getRoles } from '@/lib/actions/users/roleActions';
import { toast } from 'sonner';

interface TUsers {
  usersItems: UserList[];
  usersLoading: boolean;
  usersError: string | null;
  usersMeta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;

  currentPage: number;
  itemsPerPage: number;

  search: string;
  isActive: boolean | undefined;
  order: 'ASC' | 'DESC';
  roles: Role[];
  rolesLoading: boolean;

  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  handleSearchChange: (value: string) => void;
  handleIsActiveChange: (value: boolean | undefined) => void;
  handleOrderChange: (value: 'ASC' | 'DESC') => void;
  handleCreateUser: (userData: CreateUserDto) => Promise<UserList>;
  handleUpdateUser: (id: string, userData: UpdateUserDto) => Promise<UserList>;

  refreshUsers: () => Promise<void>;
}

export function useUsers(initialPage: number = 1, initialLimit: number = 10): TUsers {
  const [usersItems, setUsersItems] = useState<UserList[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersMeta, setUsersMeta] = useState<TUsers['usersMeta']>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setUsersLoading(true);
        setUsersError(null);

        const params = {
          search,
          page,
          limit,
          isActive,
          order
        };

        const result = await getUsers(params);
        setUsersItems(result.items);
        setUsersMeta(result.meta);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    },
    [search, currentPage, itemsPerPage, isActive, order]
  );

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [fetchUsers, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (usersMeta && (page < 1 || page > usersMeta.totalPages)) return;
      setCurrentPage(page);
    },
    [usersMeta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleIsActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    setCurrentPage(1);
  };
  const handleOrderChange = (value: 'ASC' | 'DESC') => {
    setOrder(value);
    setCurrentPage(1);
  };

  const handleCreateUser = async (userData: CreateUserDto): Promise<UserList> => {
    try {
      const newUser = await createUser(userData);
      await fetchUsers();
      toast.success('Usuario creado correctamente');
      return newUser;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Error al crear usuario');
      throw err;
    }
  };

  const handleUpdateUser = async (id: string, userData: UpdateUserDto): Promise<UserList> => {
    try {
      const updatedUser = await updateUser(id, userData);
      toast.success('Usuario actualizado correctamente');
      await fetchUsers();
      return updatedUser;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Error al actualizar usuario');
      throw err;
    }
  };

  return {
    usersItems,
    usersLoading,
    search,
    usersError,
    usersMeta,
    currentPage,
    itemsPerPage,
    isActive,
    order,
    roles,
    rolesLoading,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,
    handleCreateUser,
    handleUpdateUser,
    refreshUsers: () => fetchUsers(currentPage, itemsPerPage)
  };
}
