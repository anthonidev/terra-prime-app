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
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {timeLeft.isExpired ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                PIN Expirado
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                PIN Activo
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">PIN de Administrador</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-muted rounded-lg border-2 border-border">
                <p className="text-3xl font-mono font-bold tracking-wider text-center">
                  {pin}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copiar PIN"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Countdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo restante
            </label>
            <div className="p-4 bg-muted rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${timeLeft.isExpired ? 'text-destructive' : 'text-foreground'}`}>
                    {getCountdownText()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expira el {format(new Date(expiresAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                <Badge variant={timeLeft.isExpired ? 'destructive' : 'default'}>
                  {timeLeft.isExpired ? 'Expirado' : 'Activo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {!timeLeft.isExpired && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Nota:</strong> Este PIN está activo y puede ser utilizado para operaciones administrativas.
                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 10 && (
                  <span className="block mt-1 text-orange-600 dark:text-orange-400 font-medium">
                    ⚠️ El PIN expirará pronto. Considera regenerarlo.
                  </span>
                )}
              </p>
            </div>
          )}

          {timeLeft.isExpired && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-900 dark:text-red-100">
                <strong>Advertencia:</strong> Este PIN ha expirado y ya no puede ser utilizado.
                Por favor, genera un nuevo PIN.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onRegenerate}
              disabled={isRegenerating}
              variant={timeLeft.isExpired ? 'default' : 'outline'}
            >
              {isRegenerating ? 'Regenerando...' : 'Regenerar PIN'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
