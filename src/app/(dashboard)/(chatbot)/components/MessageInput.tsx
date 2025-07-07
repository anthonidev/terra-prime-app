'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertTriangle, BookOpen, HelpCircle, Loader2, Plus, Send } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onShowQuickHelpList?: () => void;
  onShowGuidesList?: () => void;
  isLoading: boolean;
  rateLimitStatus: RateLimitStatus | null;
  hasQuickHelp?: boolean;
  hasGuides?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  onShowQuickHelpList,
  onShowGuidesList,
  isLoading,
  rateLimitStatus,
  hasQuickHelp,
  hasGuides
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading && !rateLimitStatus?.isBlocked) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    setShowShortcuts(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowShortcuts(false), 150);
  };

  const handleQuickHelpClick = () => {
    onShowQuickHelpList?.();
    setIsMenuOpen(false);
  };

  const handleGuidesClick = () => {
    onShowGuidesList?.();
    setIsMenuOpen(false);
  };

  // Solo mostrar rate limit cuando esté cerca del límite (≤10) o esté bloqueado
  const showRateLimitWarning =
    rateLimitStatus && (rateLimitStatus.isBlocked || rateLimitStatus.remaining <= 10);

  const isDisabled = isLoading || rateLimitStatus?.isBlocked;
  const canSend = message.trim() && !isDisabled;
  const hasMenuItems = hasQuickHelp || hasGuides;

  return (
    <div className="bg-background/95 border-t backdrop-blur-sm">
      {/* Rate Limit Warning */}
      {showRateLimitWarning && (
        <div className="px-4 pt-3">
          <Alert
            variant={rateLimitStatus.isBlocked ? 'destructive' : 'default'}
            className="text-xs"
          >
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
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
        </div>
      )}

      {/* Message Input */}
      <div className="p-4">
        <div className="relative">
          {/* Input Container - Estilo Claude */}
          <div className="border-border bg-background focus-within:ring-primary/20 relative rounded-xl border shadow-sm transition-all focus-within:ring-2">
            <div className="flex items-end">
              {/* Plus Menu Button */}
              {hasMenuItems && (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-muted m-2 h-8 w-8 flex-shrink-0 rounded-lg p-0"
                      disabled={isDisabled}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {hasQuickHelp && (
                      <DropdownMenuItem onClick={handleQuickHelpClick} className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Preguntas frecuentes</span>
                      </DropdownMenuItem>
                    )}

                    {hasGuides && (
                      <DropdownMenuItem onClick={handleGuidesClick} className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Guías de ayuda</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Textarea */}
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={
                    rateLimitStatus?.isBlocked
                      ? 'Límite de mensajes alcanzado...'
                      : isLoading
                        ? 'Enviando mensaje...'
                        : 'Envía un mensaje a SmartBot...'
                  }
                  disabled={isDisabled}
                  className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent max-h-[120px] min-h-[44px] resize-none border-0 bg-transparent p-3 text-sm leading-relaxed shadow-none focus-visible:ring-0"
                  rows={1}
                />

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute top-3 right-3">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!canSend}
                size="sm"
                className="m-2 h-8 w-8 flex-shrink-0 rounded-lg p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Shortcuts helper */}
          {showShortcuts && !isDisabled && (
            <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="h-5 overflow-hidden px-1.5 font-mono text-xs">
                    Enter
                  </Badge>
                  <span>enviar</span>
                </div>
                /
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="h-5 overflow-hidden px-1.5 font-mono text-xs">
                    Shift
                  </Badge>
                  <Badge variant="outline" className="h-5 overflow-hidden px-1.5 font-mono text-xs">
                    Enter
                  </Badge>
                  <span>nueva línea</span>
                </div>
              </div>

              {message.length > 0 && (
                <div className="text-muted-foreground text-xs">
                  {message.split('\n').length} línea{message.split('\n').length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
