'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { Bot, MessageCircle, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRateLimitStatus } from '../actions';
import { ChatbotSheet } from './ChatbotSheet';

const ChatbotButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkRateLimitStatus();
  }, []);

  const checkRateLimitStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getRateLimitStatus();
      if (response.success) {
        setRateLimitStatus(response.rateLimitStatus);
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const getButtonState = () => {
    if (isLoading) return 'loading';
    if (rateLimitStatus?.isBlocked) return 'blocked';
    if (rateLimitStatus && rateLimitStatus.remaining < 5) return 'warning';
    if (rateLimitStatus && rateLimitStatus.remaining < 15) return 'caution';
    return 'available';
  };

  const getButtonIcon = () => {
    const state = getButtonState();

    switch (state) {
      case 'loading':
        return <MessageCircle className="h-4 w-4" />;
      case 'blocked':
        return <Bot className="h-4 w-4 opacity-50" />;
      case 'warning':
        return <Zap className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getButtonVariant = () => {
    const state = getButtonState();

    switch (state) {
      case 'blocked':
        return 'secondary';
      case 'warning':
        return 'destructive';
      case 'caution':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getTooltipContent = () => {
    const state = getButtonState();

    switch (state) {
      case 'loading':
        return 'Verificando disponibilidad...';
      case 'blocked':
        return `Límite alcanzado. Disponible a las ${new Date(rateLimitStatus!.resetTime).toLocaleTimeString()}`;
      case 'warning':
        return `⚠️ Solo quedan ${rateLimitStatus!.remaining} mensajes`;
      case 'caution':
        return `${rateLimitStatus!.remaining} mensajes restantes`;
      default:
        return 'Abrir asistente virtual';
    }
  };

  const showRemainingBadge = () => {
    return rateLimitStatus && rateLimitStatus.remaining < 10 && !rateLimitStatus.isBlocked;
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                onClick={handleChatbotToggle}
                disabled={rateLimitStatus?.isBlocked || isLoading}
                variant={getButtonVariant()}
                size="sm"
                className="relative h-9 w-9 rounded-lg transition-colors duration-200"
              >
                {getButtonIcon()}
              </Button>

              {/* Status indicator dot */}
              {!isLoading && (
                <div
                  className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${
                    rateLimitStatus?.isBlocked
                      ? 'bg-gray-400'
                      : rateLimitStatus && rateLimitStatus.remaining < 5
                        ? 'bg-red-500'
                        : rateLimitStatus && rateLimitStatus.remaining < 15
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  }`}
                />
              )}

              {/* Remaining messages badge */}
              {showRemainingBadge() && (
                <Badge
                  variant={rateLimitStatus!.remaining < 5 ? 'destructive' : 'secondary'}
                  className="absolute -right-2 -bottom-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-medium"
                >
                  {rateLimitStatus!.remaining}
                </Badge>
              )}
            </div>
          </TooltipTrigger>

          <TooltipContent side="left" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{getTooltipContent()}</p>
              {rateLimitStatus && !isLoading && (
                <div className="space-y-1">
                  <p className="text-xs opacity-80">
                    {rateLimitStatus.remaining}/{rateLimitStatus.limit} mensajes disponibles
                  </p>
                  {rateLimitStatus.isBlocked && (
                    <p className="text-xs opacity-80">
                      Se reinicia: {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
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
