import { Role, UserList } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FileText, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import UpdateUserButton from './buttons/UpdateUserButton';

type Props = {
  users: UserList[];
  roles: Role[];
};

export default function UsersCards({ users, roles }: Props) {
  if (!users.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron registros
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {users.map((user) => (
        <Card key={user.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.firstName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Apellido: {user.lastName}
                  </p>
                </div>
              </div>

              <Badge
                variant={user.isActive ? 'default' : 'secondary'}
                className={
                  user.isActive
                    ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }
              >
                {user.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="truncate">Email: {user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Creado: {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Actualizado: {format(new Date(user.updatedAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-2 dark:border-gray-800">
              <UpdateUserButton user={user} roles={roles} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
