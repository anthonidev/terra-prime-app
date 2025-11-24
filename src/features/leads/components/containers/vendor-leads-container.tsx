'use client';

import { UserCircle, AlertCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/common/page-header';

import { useVendorLeads } from '../../hooks/use-vendor-leads';
import { VendorLeadsTable } from '../tables/vendor-leads-table';
import { VendorLeadsSkeleton } from '../skeletons/vendor-leads-skeleton';

export function VendorLeadsContainer() {
  const { data, isLoading, isError, error } = useVendorLeads();

  if (isLoading) {
    return <VendorLeadsSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Prospectos"
          description="Gestiona tus leads asignados"
          icon={UserCircle}
        />

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-destructive text-sm font-medium">Error al cargar prospectos</p>
                <p className="text-muted-foreground text-xs">
                  {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Prospectos"
          description="Gestiona tus leads asignados"
          icon={UserCircle}
        />

        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
                <UserCircle className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No tienes prospectos asignados</p>
                <p className="text-muted-foreground text-xs">
                  Aún no se te han asignado prospectos. Contacta con tu supervisor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLeads = data.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Prospectos"
        description={`${totalLeads} ${totalLeads === 1 ? 'prospecto asignado' : 'prospectos asignados'}`}
        icon={UserCircle}
      />

      <VendorLeadsTable leads={data} />
    </div>
  );
}
