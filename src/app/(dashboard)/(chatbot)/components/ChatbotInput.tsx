import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertTriangle, Send, Loader2 } from 'lucide-react';
import React from 'react';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  rateLimitStatus: RateLimitStatus | null;
}

export const ChatbotInput = ({ onSendMessage, disabled, rateLimitStatus }: ChatbotInputProps) => {
  const [inputMessage, setInputMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (message && !disabled && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSendMessage(message);
        setInputMessage('');
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const getRateLimitProgress = () => {
    if (!rateLimitStatus) return 100;
    return (rateLimitStatus.remaining / rateLimitStatus.limit) * 100;
  };

  const getProgressColor = () => {
    if (!rateLimitStatus) return 'bg-primary';
    const percentage = getRateLimitProgress();
    if (percentage < 20) return 'bg-destructive';
    if (percentage < 40) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const isButtonDisabled = !inputMessage.trim() || disabled || isSubmitting;

  return (
    <div className="border-border bg-background space-y-3 border-t p-4">
      {/* Rate limit indicator */}
      {rateLimitStatus && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs">
              Mensajes disponibles: {rateLimitStatus.remaining}/{rateLimitStatus.limit}
            </span>
            {rateLimitStatus.remaining < 10 && (
              <Badge
                variant={rateLimitStatus.remaining < 5 ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {rateLimitStatus.remaining < 5 ? (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Límite crítico
                  </>
                ) : (
                  'Advertencia'
                )}
              </Badge>
            )}
          </div>

          <div className="relative">
            <Progress value={getRateLimitProgress()} className="h-2" />
            <div
              className={`absolute inset-0 h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${getRateLimitProgress()}%` }}
            />
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              rateLimitStatus?.isBlocked
                ? 'Límite de mensajes alcanzado...'
                : 'Escribe tu pregunta aquí...'
            }
            disabled={disabled || isSubmitting}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary max-h-[120px] min-h-[44px] resize-none text-sm focus:ring-1"
            rows={1}
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSendMessage}
                disabled={isButtonDisabled}
                size="sm"
                className="h-11 w-11 flex-shrink-0 rounded-lg p-0 transition-all hover:scale-105"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isSubmitting
                  ? 'Enviando...'
                  : isButtonDisabled
                    ? 'Escribe un mensaje'
                    : 'Enviar mensaje'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Help text */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Enter</kbd>
          <span>para enviar</span>
          <span className="text-muted-foreground/60">•</span>
          <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Shift + Enter</kbd>
          <span>nueva línea</span>
        </div>

        {rateLimitStatus?.isBlocked && (
          <span className="text-destructive text-xs">
            Disponible a las {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};
