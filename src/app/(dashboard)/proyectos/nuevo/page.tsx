'use client';

import { PageHeader } from '@components/common/PageHeader';
import ProjectUpload from '@components/project/ProjectUpload';

export default function NuevoProyecto() {
  return (
    <div className="container py-5">
      <PageHeader
        title="Nuevo Proyecto"
        subtitle="Crea un nuevo proyecto importando un archivo Excel"
        variant="default"
      />
      <ProjectUpload />
    </div>
  );
}
