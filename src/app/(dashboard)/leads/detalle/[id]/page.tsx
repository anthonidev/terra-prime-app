'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import LeadDetailHeader from '../components/LeadDetailHeader';
import LeadVisits from '../components/LeadVisits';
import LeadEditForm from '../components/LeadEditForm';
import { useLeadDetail } from '../../hooks/useLeadDetail';
export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { lead, loading, updating, error, updateLeadContact, registerDeparture } = useLeadDetail(
    params.id
  );
  if (!loading && !lead && !error) {
    notFound();
  }
  const handleOpenEditModal = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);
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
      {}
      <div className="mb-6">
        <Link href="/leads">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground mb-2 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver a Leads</span>
          </Button>
        </Link>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <User className="text-primary h-8 w-8" />
          {loading ? (
            <Skeleton className="h-9 w-48" />
          ) : lead ? (
            `${lead.firstName} ${lead.lastName}`
          ) : (
            'Detalle de Lead'
          )}
        </h1>
        <p className="text-muted-foreground">Gestiona la información y visitas del lead</p>
      </div>
      <Separator className="mb-6" />
      {}
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
            {}
            <LeadDetailHeader
              lead={lead}
              onEditClick={handleOpenEditModal}
              onRegisterDeparture={registerDeparture}
              isUpdating={updating}
            />
            {}
            <LeadVisits lead={lead} />
            {}
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
