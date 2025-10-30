'use client';

import { useState } from 'react';
import { useFindLeadByDocument } from './use-register-lead';
import type { Lead, DocumentType } from '../types';

interface UseLeadSearchResult {
  existingLead: Lead | null;
  showInOfficeDialog: boolean;
  showExistingLeadDialog: boolean;
  isSearching: boolean;
  searchLead: (documentType: DocumentType, document: string) => void;
  handleAcceptExistingLead: () => void;
  handleCancelExistingLead: () => void;
  closeInOfficeDialog: () => void;
  resetSearch: () => void;
}

interface UseLeadSearchCallbacks {
  onLeadNotFound: () => void;
  onAcceptExistingLead: (lead: Lead) => void;
}

export function useLeadSearch({
  onLeadNotFound,
  onAcceptExistingLead,
}: UseLeadSearchCallbacks): UseLeadSearchResult {
  const [existingLead, setExistingLead] = useState<Lead | null>(null);
  const [showInOfficeDialog, setShowInOfficeDialog] = useState(false);
  const [showExistingLeadDialog, setShowExistingLeadDialog] = useState(false);

  const { mutate: findLead, isPending: isSearching } = useFindLeadByDocument();

  const searchLead = (documentType: DocumentType, document: string) => {
    if (!document || !documentType) {
      return;
    }

    findLead(
      { documentType, document },
      {
        onSuccess: (response) => {
          // Si hay data, significa que encontró el lead
          if (response.data) {
            const lead = response.data;
            setExistingLead(lead);

            // success: false con data = lead en oficina
            // success: true con data = lead existe pero no está en oficina
            if (!response.success && lead.isInOffice) {
              setShowInOfficeDialog(true);
            } else if (response.success && !lead.isInOffice) {
              setShowExistingLeadDialog(true);
            }
          }
        },
        onError: (error: any) => {
          // 404 = No se encontró el lead
          if (error?.response?.status === 404) {
            onLeadNotFound();
          }
        },
      }
    );
  };

  const handleAcceptExistingLead = () => {
    if (existingLead) {
      onAcceptExistingLead(existingLead);
      setShowExistingLeadDialog(false);
    }
  };

  const handleCancelExistingLead = () => {
    setShowExistingLeadDialog(false);
    setExistingLead(null);
  };

  const closeInOfficeDialog = () => {
    setShowInOfficeDialog(false);
    setExistingLead(null);
  };

  const resetSearch = () => {
    setExistingLead(null);
    setShowInOfficeDialog(false);
    setShowExistingLeadDialog(false);
  };

  return {
    existingLead,
    showInOfficeDialog,
    showExistingLeadDialog,
    isSearching,
    searchLead,
    handleAcceptExistingLead,
    handleCancelExistingLead,
    closeInOfficeDialog,
    resetSearch,
  };
}
