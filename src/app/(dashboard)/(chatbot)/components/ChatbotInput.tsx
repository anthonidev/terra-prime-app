import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { Send, Loader2, AlertTriangle } from 'lucide-react';
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
    if (!rateLimitStatus) return 'bg-gray-200 dark:bg-gray-700';
    const percentage = getRateLimitProgress();
    if (percentage < 20) return 'bg-red-500';
    if (percentage < 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPlaceholder = () => {
    if (rateLimitStatus?.isBlocked) {
      return 'Límite de mensajes alcanzado. Intenta más tarde...';
    }
    return 'Escribe tu pregunta aquí...';
  };

  const isButtonDisabled = !inputMessage.trim() || disabled || isSubmitting;
  const showRateLimit =
    rateLimitStatus && (rateLimitStatus.remaining < 10 || rateLimitStatus.isBlocked);

  return (
    <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Rate limit indicator - show when relevant */}
      {showRateLimit && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              {rateLimitStatus!.remaining < 5 && <AlertTriangle className="h-3 w-3 text-red-500" />}
              <span>
                {rateLimitStatus!.remaining} de {rateLimitStatus!.limit} mensajes restantes
              </span>
            </div>

            {rateLimitStatus!.isBlocked && (
              <span className="text-xs text-red-600 dark:text-red-400">
                Disponible a las {new Date(rateLimitStatus!.resetTime).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="mt-2">
            <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${getRateLimitProgress()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholder()}
              disabled={disabled || isSubmitting}
              className={`max-h-[120px] min-h-[44px] resize-none border-gray-300 bg-white text-sm text-gray-900 transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-gray-100 dark:focus:ring-gray-100 ${rateLimitStatus?.isBlocked ? 'cursor-not-allowed opacity-50' : ''} `}
              rows={1}
            />
          </div>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendMessage}
                  disabled={isButtonDisabled}
                  size="sm"
                  className={`h-11 w-11 flex-shrink-0 rounded-lg p-0 transition-all ${
                    isButtonDisabled
                      ? 'cursor-not-allowed bg-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-600'
                      : 'bg-gray-900 hover:scale-105 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200'
                  } ${!isButtonDisabled ? 'text-white dark:text-gray-900' : 'text-gray-500 dark:text-gray-400'} `}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {isSubmitting
                  ? 'Enviando...'
                  : isButtonDisabled
                    ? 'Escribe un mensaje'
                    : 'Enviar mensaje'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Help text - simplified */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Enter
              </kbd>
              <span>enviar</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                Shift + Enter
              </kbd>
              <span>nueva línea</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
