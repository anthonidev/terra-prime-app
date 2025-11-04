'use client';

import { Pencil, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { User } from '../types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Card className="overflow-hidden transition-colors hover:bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar y Info Principal */}
          <div className="flex gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={user.photo || undefined} alt={user.firstName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-2">
              {/* Nombre */}
              <div>
                <h3 className="font-semibold truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              {/* Documento y Rol */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Doc: {user.document}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {user.role.name}
                </Badge>
                <Badge
                  variant={user.isActive ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(user.createdAt), 'dd MMM yyyy', {
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Acción directa: Editar */}
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => onEdit(user)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
