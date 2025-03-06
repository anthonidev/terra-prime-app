import React from "react";
import UsersTable from "@/components/users/UsersTable";
export default function Usuarios() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios del sistema
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
