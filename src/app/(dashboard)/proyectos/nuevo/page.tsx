import ProjectUpload from "@/components/project/ProjectUpload";
import React from "react";

export default function NuevoProyecto() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h1>
        <p className="text-muted-foreground">
          Crea un nuevo proyecto importando un archivo Excel
        </p>
      </div>
      <ProjectUpload />
    </div>
  );
}
