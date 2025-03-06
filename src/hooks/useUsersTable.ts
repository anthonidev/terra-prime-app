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
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
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
  const handleCreateUser = async (
    userData: CreateUserDto
  ): Promise<UserList> => {
    setMutationState({ loading: true, error: null });
    try {
      const newUser = await createUser(userData);
      await fetchUsers(); 
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
      await fetchUsers(); 
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
    data,
    loading,
    search,
    currentPage,
    itemsPerPage,
    isActive,
    order,
    roles,
    rolesLoading,
    mutationLoading: mutationState.loading,
    mutationError: mutationState.error,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsActiveChange,
    handleOrderChange,
    handleCreateUser,
    handleUpdateUser,
    refresh: fetchUsers,
  };
}
