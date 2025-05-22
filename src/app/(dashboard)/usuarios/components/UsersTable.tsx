'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { UsersTableFilters } from './UsersTableFilters';
import { UpdateUserModal } from './UpdateUserModal';
import { CreateUserDto, Role, UpdateUserDto, UserList } from '@/types/user';
import { Button } from '@components/ui/button';
import { CreateUserModal } from './CreateUserModal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { StatusBadge } from '@components/common/table/StatusBadge';
import { Pencil, Users } from 'lucide-react';
import { TablePagination } from '@components/common/table/TablePagination';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: UserList[];
  isLoading: boolean;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;
  currentPage: number;
  itemsPerPage: number;
  roles: Role[];
  rolesLoading: boolean;
  search: string;
  isActive: boolean | undefined;
  order: 'ASC' | 'DESC';
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleSearchChange: (value: string) => void;
  handleIsActiveChange: (value: boolean | undefined) => void;
  handleOrderChange: (value: 'ASC' | 'DESC') => void;
  handleUpdateUser: (id: string, userData: UpdateUserDto) => Promise<UserList>;
  handleCreateUser: (userData: CreateUserDto) => Promise<UserList>;
}

export default function UsersTable({
  data,
  isLoading,
  meta,
  currentPage,
  itemsPerPage,
  roles,
  rolesLoading,
  search,
  isActive,
  order,
  handleSearchChange,
  handleIsActiveChange,
  handleOrderChange,
  handleUpdateUser,
  handleCreateUser,
  onPageChange,
  onPageSizeChange
}: Props) {
  const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleEdit = (user: UserList) => {
    setSelectedUser(user);
  };

  const handleCloseModals = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(false);
  };

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
          className="hidden bg-gradient-to-r from-[#025864] to-[#00CA7C] text-white transition-colors duration-1000 hover:bg-gradient-to-r hover:from-[#00CA7C] hover:to-[#025864] lg:flex"
        >
          <span>
            <svg width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="currentColor"
                  d="M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7m-1.178 7.672C6.425 13.694 8.605 13 11 13q.671 0 1.316.07a1 1 0 0 1 .72 1.557A5.97 5.97 0 0 0 12 18c0 .92.207 1.79.575 2.567a1 1 0 0 1-.89 1.428L11 22c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69ZM18 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1"
                />
              </g>
            </svg>
          </span>
          Nuevo Usuario
        </Button>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : isMobile ? (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="text-primary h-5 w-5" />
                <h3>Usuarios</h3>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-[#025864] to-[#00CA7C] text-white transition-colors duration-1000 hover:bg-gradient-to-r hover:from-[#00CA7C] hover:to-[#025864]"
              >
                <span>
                  <svg width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <g fill="none">
                      <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="currentColor"
                        d="M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7m-1.178 7.672C6.425 13.694 8.605 13 11 13q.671 0 1.316.07a1 1 0 0 1 .72 1.557A5.97 5.97 0 0 0 12 18c0 .92.207 1.79.575 2.567a1 1 0 0 1-.89 1.428L11 22c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69ZM18 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1"
                      />
                    </g>
                  </svg>
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.length > 0 ? (
                data.map((reconsumo, i) => (
                  <Card key={reconsumo.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col divide-y">
                        {/* Cabecera con estado e ID */}
                        <div className="bg-muted/20 flex items-center justify-between p-4">
                          <StatusBadge status={reconsumo.document} />
                          <div className="text-sm font-medium">
                            <span>#{i}</span>
                          </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="space-y-3 p-4">
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground text-xs">Fecha del período:</div>
                            <div className="text-sm">
                              {format(new Date(reconsumo.createdAt), 'dd/MM/yyyy', { locale: es })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="rounded-lg border p-6 text-center">
                  <p className="text-muted-foreground">No hay reconsumos registrados</p>
                </div>
              )}

              {meta && meta.totalItems > 0 && (
                <TablePagination
                  pagination={{
                    pageIndex: currentPage - 1,
                    pageSize: itemsPerPage
                  }}
                  pageCount={meta.totalPages}
                  pageIndex={currentPage - 1}
                  canNextPage={currentPage >= meta.totalPages}
                  canPreviousPage={currentPage <= 1}
                  setPageIndex={(idx) => onPageChange(Number(idx) + 1)}
                  setPageSize={() => onPageSizeChange}
                  previousPage={() => onPageChange(Math.max(1, currentPage - 1))}
                  nextPage={() => onPageChange(Math.min(meta.totalPages, currentPage + 1))}
                  totalItems={meta.totalItems}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de creación </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.document}</TableCell>
                  <TableCell className="font-medium">{user.firstName}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="font-medium">{user.role.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </TableCell>
                  <TableCell className="font-medium">{user.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {meta && meta.totalItems > 0 && (
        <div className="mt-4">
          <TablePagination
            pagination={{
              pageIndex: currentPage - 1,
              pageSize: itemsPerPage
            }}
            pageCount={meta.totalPages}
            pageIndex={currentPage - 1}
            canNextPage={currentPage >= meta.totalPages}
            canPreviousPage={currentPage <= 1}
            setPageIndex={(idx) => onPageChange(Number(idx) + 1)}
            setPageSize={() => onPageSizeChange}
            previousPage={() => onPageChange(Math.max(1, currentPage - 1))}
            nextPage={() => onPageChange(Math.min(meta.totalPages, currentPage + 1))}
            totalItems={meta.totalItems}
          />
        </div>
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
