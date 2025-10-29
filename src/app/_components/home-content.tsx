"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut } from "lucide-react";

export function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Bienvenido</CardTitle>
            <CardDescription>
              Estás autenticado en Terra Prime App
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <div className="rounded-lg bg-primary/10 p-4">
                <h2 className="text-xl font-semibold text-primary">
                  Bienvenido {user.fullName}
                </h2>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Documento:</span>{" "}
                    {user.document}
                  </p>
                  <p>
                    <span className="font-medium">Rol:</span> {user.role.name}
                  </p>
                </div>
              </div>
            )}

            <Button onClick={logout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
