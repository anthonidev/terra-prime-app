'use client';

import { Copy, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { useCountdown } from '../hooks/use-countdown';

interface PinDisplayProps {
  pin: string;
  expiresAt: Date;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function PinDisplay({ pin, expiresAt, onRegenerate, isRegenerating }: PinDisplayProps) {
  const timeLeft = useCountdown(expiresAt);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin);
    toast.success('PIN copiado al portapapeles');
  };

  const formatTimeUnit = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const getCountdownText = () => {
    if (timeLeft.isExpired) {
      return 'Expirado';
    }

    const parts = [];
    if (timeLeft.days > 0) parts.push(formatTimeUnit(timeLeft.days, 'día'));
    if (timeLeft.hours > 0) parts.push(formatTimeUnit(timeLeft.hours, 'hora'));
    if (timeLeft.minutes > 0) parts.push(formatTimeUnit(timeLeft.minutes, 'minuto'));
    if (timeLeft.seconds > 0 && timeLeft.days === 0) {
      parts.push(formatTimeUnit(timeLeft.seconds, 'segundo'));
    }

    return parts.join(', ');
  };

  return (
    <Card className="max-w-2xl border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            {timeLeft.isExpired ? (
              <AlertCircle className="text-destructive h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
          </div>
          <CardTitle className="text-base">
            {timeLeft.isExpired ? 'PIN Expirado' : 'PIN Activo'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PIN Display */}
        <div className="space-y-2">
          <label className="text-xs font-medium">PIN de Administrador</label>
          <div className="flex items-center gap-2">
            <div className="bg-muted/50 border-border flex-1 rounded-lg border-2 border-dashed p-4">
              <p className="text-foreground text-center font-mono text-3xl font-bold tracking-[0.2em]">
                {pin}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              title="Copiar PIN"
              className="hover:bg-muted/50 h-[68px] w-[68px] p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Countdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            Tiempo restante
          </label>
          <div className="bg-muted/30 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xl font-bold ${timeLeft.isExpired ? 'text-destructive' : 'text-foreground'}`}
                >
                  {getCountdownText()}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Expira el{' '}
                  {format(new Date(expiresAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
              <Badge
                variant={timeLeft.isExpired ? 'destructive' : 'default'}
                className="shrink-0 text-xs"
              >
                {timeLeft.isExpired ? 'Expirado' : 'Activo'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {!timeLeft.isExpired && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/50">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>Nota:</strong> Este PIN está activo y puede ser utilizado para operaciones
              administrativas.
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 10 && (
                <span className="mt-1 block font-medium text-orange-600 dark:text-orange-400">
                  ⚠️ El PIN expirará pronto. Considera regenerarlo.
                </span>
              )}
            </p>
          </div>
        )}

        {timeLeft.isExpired && (
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/50">
            <p className="text-xs text-red-900 dark:text-red-100">
              <strong>Advertencia:</strong> Este PIN ha expirado y ya no puede ser utilizado. Por
              favor, genera un nuevo PIN.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant={timeLeft.isExpired ? 'default' : 'outline'}
            size="sm"
          >
            {isRegenerating ? 'Regenerando...' : 'Regenerar PIN'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
