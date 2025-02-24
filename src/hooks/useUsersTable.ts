// src/hooks/useUsersTable.ts
import { useState, useCallback, useEffect } from "react";
import {
  PaginatedUsers,
  CreateUserDto,
  UpdateUserDto,
  Role,
  UserList,
} from "@/types/user.types";
import {
  getUsers,
  createUser,
  updateUser,
} from "@/lib/actions/users/userActions";
import { getRoles } from "@/lib/actions/users/roleActions";
import { toast } from "sonner";

interface UseUsersTableProps {
  initialPage?: number;
  initialLimit?: number;
}

interface MutationState {
  loading: boolean;
  error: Error | null;
}

export function useUsersTable({
  initialPage = 1,
  initialLimit = 10,
}: UseUsersTableProps = {}) {
  // Estados existentes para la tabla
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  // Estados para mutaciones
  const [mutationState, setMutationState] = useState<MutationState>({
    loading: false,
    error: null,
  });

  const fetchRoles = useCallback(async () => {
    try {
      setRolesLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setRolesLoading(false);
    }
  }, []);
  // Fetch usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUsers({
        search,
        page: currentPage,
        limit: itemsPerPage,
        isActive,
        order,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, itemsPerPage, isActive, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  // Handlers existentes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleIsActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    setCurrentPage(1);
  };

  const handleOrderChange = (value: "ASC" | "DESC") => {
    setOrder(value);
    setCurrentPage(1);
  };

  // Nuevas funciones para mutaciones
  const handleCreateUser = async (
    userData: CreateUserDto
  ): Promise<UserList> => {
    setMutationState({ loading: true, error: null });
    try {
      const newUser = await createUser(userData);
      await fetchUsers(); // Refrescar la tabla después de crear
      toast.success("Usuario creado correctamente");
      return newUser;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Error al crear usuario");
      setMutationState({ loading: false, error: err });
      throw err;
    } finally {
      setMutationState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUpdateUser = async (
    id: string,
    userData: UpdateUserDto
  ): Promise<UserList> => {
    setMutationState({ loading: true, error: null });
    try {
      const updatedUser = await updateUser(id, userData);
      toast.success("Usuario actualizado correctamente");
      await fetchUsers(); // Refrescar la tabla después de actualizar
      return updatedUser;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Error al actualizar usuario");
      setMutationState({ loading: false, error: err });
      throw err;
    } finally {
      setMutationState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    // Estado de la tabla
    data,
    loading,
    search,
    currentPage,
    itemsPerPage,
    isActive,
    order,

    roles,
    rolesLoading,
    // Estado de mutaciones
    mutationLoading: mutationState.loading,
    mutationError: mutationState.error,

    // Handlers de la tabla
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,

    // Handlers de mutaciones
    handleCreateUser,
    handleUpdateUser,

    // Acciones
    refresh: fetchUsers,
  };
}
