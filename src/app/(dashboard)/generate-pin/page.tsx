'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@components/common/PageHeader';
import {
  Check,
  Copy,
  Pin,
  RefreshCw,
  Clock,
  Shield,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { usePin } from './hooks/usePin';
import { format, isAfter, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useState, useCallback, useMemo } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

function CopyButton({ text, label = 'PIN' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copiado al portapapeles`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error('Error al copiar al portapapeles');
    }
  }, [text, label]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
      disabled={!text}
    >
      {copied ? <Check className="h-4 w-4 text-blue-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

interface PinDisplayProps {
  pin: string;
  expiresAt?: string;
}

function PinDisplay({ pin, expiresAt }: PinDisplayProps) {
  const isExpiringSoon = useMemo(() => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const warningTime = addMinutes(new Date(), 15);
    return isAfter(warningTime, expiryDate);
  }, [expiresAt]);

  const isExpired = useMemo(() => {
    if (!expiresAt) return false;
    return isAfter(new Date(), new Date(expiresAt));
  }, [expiresAt]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Código PIN</p>
            {isExpired && (
              <Badge variant="destructive" className="px-2 py-1">
                <AlertCircle className="mr-1 h-3 w-3" />
                Expirado
              </Badge>
            )}
            {isExpiringSoon && !isExpired && (
              <Badge variant="outline" className="border-amber-300 px-2 py-1 text-amber-600">
                <Clock className="mr-1 h-3 w-3" />
                Expira pronto
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p
              className={`font-mono text-2xl font-bold tracking-wider ${isExpired ? 'text-gray-400 line-through' : ''}`}
            >
              {pin}
            </p>
            <CopyButton text={pin} />
          </div>
        </div>

        {expiresAt && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isExpired ? 'Expiró el' : 'Expira el'}
              </p>
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-semibold ${isExpired ? 'text-red-600' : ''}`}>
                {format(new Date(expiresAt), 'PPPP', { locale: es })}
              </p>
              <p className={`text-sm ${isExpired ? 'text-red-500' : 'text-blue-600'}`}>
                {format(new Date(expiresAt), 'hh:mm a', { locale: es })}
              </p>
            </div>
          </div>
        )}
      </div>

      {isExpired && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            Este PIN ha expirado y ya no es válido para su uso.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function PinPage() {
  const {
    existingPin,
    isLoading,
    isLoadingExisting,
    error,
    generatePin,
    loadExistingPin,
    clearError
  } = usePin();

  const hasValidExistingPin = useMemo(() => {
    if (!existingPin?.expiresAt) return false;
    return isAfter(new Date(existingPin.expiresAt), new Date());
  }, [existingPin]);

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <PageHeader
        icon={Pin}
        title="Generar PIN"
        subtitle="Administra los códigos PIN para validación en otras áreas"
        variant="gradient"
      />

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-700 dark:text-red-300">{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5 text-blue-600" />
              Generar nuevo PIN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Crea un nuevo código PIN para validación
                </p>
                {hasValidExistingPin && (
                  <p className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Ya tienes un PIN válido. Generar uno nuevo lo reemplazará.
                  </p>
                )}
              </div>
              <Button
                onClick={generatePin}
                disabled={isLoading}
                className="w-full min-w-[140px] sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Generar PIN
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {(existingPin || isLoadingExisting) && (
          <Card className="border border-blue-100 bg-blue-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Badge variant="secondary" className="px-3 py-1">
                    PIN Actual
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadExistingPin}
                  disabled={isLoadingExisting}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingExisting ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingExisting ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : existingPin ? (
                <PinDisplay pin={existingPin.pin ?? ''} expiresAt={existingPin.expiresAt} />
              ) : null}
            </CardContent>
          </Card>
        )}

        {!existingPin && !isLoadingExisting && (
          <Card className="border-dashed border-gray-300 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <CardContent className="py-12 text-center">
              <Shield className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No hay PIN activo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Genera un nuevo PIN para comenzar a usarlo en validaciones
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
