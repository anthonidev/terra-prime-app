'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  generateRadicationPdf,
  regenerateRadicationPdf,
  generatePaymentAccordPdf,
  regeneratePaymentAccordPdf,
} from '../lib/mutations';

export function useGenerateRadicationPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: string) => generateRadicationPdf(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
      toast.success('PDF de radicación generado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al generar PDF de radicación');
      console.error('Error generating radication PDF:', error);
    },
  });
}

export function useRegenerateRadicationPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: string) => regenerateRadicationPdf(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
      toast.success('PDF de radicación regenerado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al regenerar PDF de radicación');
      console.error('Error regenerating radication PDF:', error);
    },
  });
}

export function useGeneratePaymentAccordPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: string) => generatePaymentAccordPdf(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
      toast.success('PDF de acuerdo de pagos generado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al generar PDF de acuerdo de pagos');
      console.error('Error generating payment accord PDF:', error);
    },
  });
}

export function useRegeneratePaymentAccordPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: string) => regeneratePaymentAccordPdf(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
      toast.success('PDF de acuerdo de pagos regenerado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al regenerar PDF de acuerdo de pagos');
      console.error('Error regenerating payment accord PDF:', error);
    },
  });
}
