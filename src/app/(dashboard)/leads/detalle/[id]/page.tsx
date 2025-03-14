"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeft, AlertCircle, User } from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLeadDetail } from "@/hooks/leads/useLeadDetail";
import LeadDetailHeader from "@/components/leads/detail/LeadDetailHeader";
import LeadEditForm from "@/components/leads/detail/LeadEditForm";
import LeadVisits from "@/components/leads/detail/LeadVisits";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    lead,
    loading,
    updating,
    error,
    updateLeadContact,
    registerDeparture,
  } = useLeadDetail(params.id);

  // Si no está cargando y no hay lead ni error, la página no existe
  if (!loading && !lead && !error) {
    notFound();
  }

  // Handlers para el modal de edición
  const handleOpenEditModal = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // Render de skeletons durante la carga
  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );

  return (
    <div className="container py-8">
      {/* Cabecera de navegación */}
      <div className="mb-6">
        <Link href="/leads">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver a Leads</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          {loading ? (
            <Skeleton className="h-9 w-48" />
          ) : lead ? (
            `${lead.firstName} ${lead.lastName}`
          ) : (
            "Detalle de Lead"
          )}
        </h1>
        <p className="text-muted-foreground">
          Gestiona la información y visitas del lead
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Mensaje de error si existe */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {loading ? (
          renderLoadingState()
        ) : (
          <>
            {/* Información principal del lead */}
            <LeadDetailHeader
              lead={lead}
              onEditClick={handleOpenEditModal}
              onRegisterDeparture={registerDeparture}
              isUpdating={updating}
            />

            {/* Historial de visitas */}
            <LeadVisits lead={lead} />

            {/* Modal de edición */}
            {lead && (
              <LeadEditForm
                lead={lead}
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onUpdate={updateLeadContact}
                isUpdating={updating}
                error={error}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
