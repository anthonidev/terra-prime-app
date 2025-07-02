'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileUser } from '@/types/profile/profile.types';
import { CheckCircle, Shield } from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

interface SecuritySectionProps {
  user: ProfileUser;
}

export function SecuritySection({ user }: SecuritySectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <h3 className="font-semibold">Configuración de Seguridad</h3>
            </div>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Cuenta Verificada
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Contraseña</h4>
                </div>
              </div>
              <ChangePasswordModal />
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="mb-2 text-sm font-medium">Recomendaciones de Seguridad</h5>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Cambia tu contraseña cada 90 días</li>
                <li>• Usa una combinación de letras, números y símbolos</li>
                <li>• No compartas tu contraseña con nadie</li>
                <li>• Evita usar información personal en tu contraseña</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Rol del Usuario</p>
              <Badge variant="outline">{user.role.name}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Cuenta Creada</p>
              <p className="text-muted-foreground text-sm">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
