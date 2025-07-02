import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertTriangle, Send } from 'lucide-react';
import React from 'react';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  rateLimitStatus: RateLimitStatus | null;
}

export const ChatbotInput = ({ onSendMessage, disabled, rateLimitStatus }: ChatbotInputProps) => {
  const [inputMessage, setInputMessage] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (message && !disabled) {
      onSendMessage(message);
      setInputMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
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

  const getRateLimitColor = () => {
    if (!rateLimitStatus) return 'bg-primary';
    if (rateLimitStatus.remaining < 5) return 'bg-destructive';
    if (rateLimitStatus.remaining < 10) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <div className="border-border bg-background space-y-3 border-t p-4">
      {/* Rate limit indicator */}
      {rateLimitStatus && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs">
              Mensajes: {rateLimitStatus.remaining}/{rateLimitStatus.limit}
            </span>
            {rateLimitStatus.remaining < 10 && (
              <Badge
                variant={rateLimitStatus.remaining < 5 ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {rateLimitStatus.remaining < 5 ? (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Límite bajo
                  </>
                ) : (
                  'Advertencia'
                )}
              </Badge>
            )}
          </div>

          <Progress value={getRateLimitProgress()} className="h-1.5" />
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            disabled={disabled}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary max-h-[100px] min-h-[40px] resize-none text-sm focus:border-transparent focus:ring-1"
            rows={1}
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || disabled}
                size="sm"
                className="h-10 w-10 flex-shrink-0 rounded-lg p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar mensaje</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Help text */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          <kbd className="bg-muted rounded px-1 py-0.5 text-xs">Enter</kbd> para enviar
        </span>
        {rateLimitStatus?.isBlocked && (
          <span className="text-destructive text-xs">
            Límite hasta {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};
