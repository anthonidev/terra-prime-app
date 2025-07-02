import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertCircle, Bot, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRateLimitStatus } from '../actions';
import { ChatbotSheet } from './ChatbotSheet';

const ChatbotButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    checkRateLimitStatus();
  }, []);

  const checkRateLimitStatus = async () => {
    try {
      const response = await getRateLimitStatus();
      if (response.success) {
        setRateLimitStatus(response.rateLimitStatus);

        if (response.rateLimitStatus.remaining < 10 && response.rateLimitStatus.remaining > 0) {
          setHasNewNotification(true);
        }
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
    }
  };

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
    setHasNewNotification(false);
  };

  const getButtonVariant = () => {
    if (rateLimitStatus?.isBlocked) return 'destructive';
    if (rateLimitStatus && rateLimitStatus.remaining < 10) return 'secondary';
    return 'default';
  };

  const getButtonIcon = () => {
    if (rateLimitStatus?.isBlocked) return <AlertCircle className="h-5 w-5" />;
    return <Bot className="h-5 w-5" />;
  };

  const getTooltipText = () => {
    if (rateLimitStatus?.isBlocked) {
      return `Límite alcanzado. Disponible después de ${new Date(rateLimitStatus.resetTime).toLocaleTimeString()}`;
    }
    if (rateLimitStatus && rateLimitStatus.remaining < 10) {
      return `⚠️ Te quedan ${rateLimitStatus.remaining} mensajes`;
    }
    return 'Abrir asistente virtual';
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                onClick={handleChatbotToggle}
                disabled={rateLimitStatus?.isBlocked}
                variant={getButtonVariant()}
                size="lg"
                className="relative rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              >
                {getButtonIcon()}

                {/* Animated sparkles for active state */}
                {!rateLimitStatus?.isBlocked && (
                  <Sparkles className="text-primary absolute -top-1 -right-1 h-3 w-3 animate-pulse" />
                )}
              </Button>

              {/* Notification dot */}
              {hasNewNotification && !rateLimitStatus?.isBlocked && (
                <div className="bg-destructive absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full"></div>
              )}

              {/* Rate limit badge */}
              {rateLimitStatus && rateLimitStatus.remaining < 5 && !rateLimitStatus.isBlocked && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -bottom-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {rateLimitStatus.remaining}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{getTooltipText()}</p>
              {rateLimitStatus && (
                <p className="text-muted-foreground text-xs">
                  {rateLimitStatus.remaining}/{rateLimitStatus.limit} mensajes disponibles
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Chatbot Sheet */}
      <ChatbotSheet isOpen={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </>
  );
};

export default ChatbotButton;
