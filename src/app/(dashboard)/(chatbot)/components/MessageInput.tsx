'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { Send, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  rateLimitStatus: RateLimitStatus | null;
}

export const MessageInput = ({ onSendMessage, isLoading, rateLimitStatus }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading && !rateLimitStatus?.isBlocked) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Solo mostrar rate limit cuando esté cerca del límite (≤10) o esté bloqueado
  const showRateLimitWarning =
    rateLimitStatus && (rateLimitStatus.isBlocked || rateLimitStatus.remaining <= 10);

  // Solo mostrar status cuando esté cerca del límite o para dar contexto
  const showRateLimitStatus =
    rateLimitStatus && !rateLimitStatus.isBlocked && rateLimitStatus.remaining <= 15;

  return (
    <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-700">
      {/* Rate Limit Warning - Solo cuando es crítico */}
      {showRateLimitWarning && (
        <Alert variant={rateLimitStatus.isBlocked ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {rateLimitStatus.isBlocked ? (
              <>
                Has alcanzado el límite de mensajes. Se reiniciará el{' '}
                {new Date(rateLimitStatus.resetTime).toLocaleString('es-ES')}.
              </>
            ) : rateLimitStatus.remaining <= 5 ? (
              <>Te quedan solo {rateLimitStatus.remaining} mensajes disponibles.</>
            ) : (
              <>Te acercas al límite de mensajes ({rateLimitStatus.remaining} restantes).</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Message Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              rateLimitStatus?.isBlocked
                ? 'Límite de mensajes alcanzado...'
                : isLoading
                  ? 'Enviando mensaje...'
                  : 'Escribe tu mensaje...'
            }
            disabled={isLoading || rateLimitStatus?.isBlocked}
            className="max-h-[120px] min-h-[40px] resize-none pr-12"
            rows={1}
          />

          {/* Loading indicator dentro del textarea */}
          {isLoading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading || rateLimitStatus?.isBlocked}
          size="sm"
          className="px-3"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Rate Limit Status - Solo cuando es relevante mostrar */}
      {showRateLimitStatus && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {rateLimitStatus.remaining}/{rateLimitStatus.limit} mensajes disponibles
          </span>
          <span>
            Se reinicia: {new Date(rateLimitStatus.resetTime).toLocaleTimeString('es-ES')}
          </span>
        </div>
      )}
    </div>
  );
};
