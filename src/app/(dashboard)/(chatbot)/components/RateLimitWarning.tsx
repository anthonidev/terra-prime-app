import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertTriangle, Ban, Clock } from 'lucide-react';

interface RateLimitWarningProps {
  rateLimitStatus: RateLimitStatus | null;
  message: string | null;
}

export const RateLimitWarning = ({ rateLimitStatus, message }: RateLimitWarningProps) => {
  if (!rateLimitStatus || !message) return null;

  const getAlertVariant = () => {
    if (rateLimitStatus.isBlocked) return 'destructive';
    if (rateLimitStatus.remaining < 5) return 'destructive';
    return 'default';
  };

  const getIcon = () => {
    if (rateLimitStatus.isBlocked) return <Ban className="h-4 w-4" />;
    if (rateLimitStatus.remaining < 5) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getProgressValue = () => {
    return (rateLimitStatus.remaining / rateLimitStatus.limit) * 100;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const getProgressColor = () => {
    if (rateLimitStatus.remaining < 5) return 'bg-destructive';
    if (rateLimitStatus.remaining < 10) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <Alert variant={getAlertVariant()} className="border-l-4">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-2">
          <AlertDescription className="font-medium">{message}</AlertDescription>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {rateLimitStatus.remaining} de {rateLimitStatus.limit} mensajes disponibles
              </span>
              <Badge
                variant={rateLimitStatus.isBlocked ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {rateLimitStatus.isBlocked ? 'Bloqueado' : 'Activo'}
              </Badge>
            </div>

            <Progress value={getProgressValue()} className="h-2" />

            {rateLimitStatus.isBlocked && (
              <p className="text-muted-foreground text-xs">
                Se reiniciará a las {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
};
