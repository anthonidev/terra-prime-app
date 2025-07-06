'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { Bot, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatbotSheet } from './ChatbotSheet';
import { getRateLimitStatus } from '../actions/chatbotMessage';

const ChatbotButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRateLimit();
  }, []);

  const loadRateLimit = async () => {
    try {
      setIsLoading(true);
      const response = await getRateLimitStatus();
      if (response.success) {
        setRateLimitStatus(response.rateLimitStatus);
      }
    } catch (err) {
      console.error('Error loading rate limit:', err);
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
        return <MessageCircle className="h-4 w-4 animate-pulse" />;
      case 'blocked':
        return <Bot className="h-4 w-4 opacity-50" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getButtonVariant = () => {
    const state = getButtonState();

    switch (state) {
      case 'blocked':
        return 'secondary' as const;
      case 'warning':
        return 'destructive' as const;
      case 'caution':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  const getTooltipContent = () => {
    const state = getButtonState();

    switch (state) {
      case 'loading':
        return 'Verificando disponibilidad...';
      case 'blocked':
        return `Límite alcanzado. Se reinicia: ${new Date(rateLimitStatus!.resetTime).toLocaleTimeString()}`;
      case 'warning':
        return `Solo ${rateLimitStatus!.remaining} mensajes disponibles`;
      case 'caution':
        return `${rateLimitStatus!.remaining} mensajes restantes`;
      default:
        return 'Abrir Asistente Virtual';
    }
  };

  const showRemainingBadge = () => {
    return (
      rateLimitStatus && !isLoading && !rateLimitStatus.isBlocked && rateLimitStatus.remaining <= 15
    );
  };

  const getStatusIndicatorColor = () => {
    if (isLoading) return 'bg-gray-400';
    if (rateLimitStatus?.isBlocked) return 'bg-gray-400';
    if (rateLimitStatus && rateLimitStatus.remaining < 5) return 'bg-red-500';
    if (rateLimitStatus && rateLimitStatus.remaining < 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                onClick={handleChatbotToggle}
                variant={getButtonVariant()}
                size="lg"
                className="h-12 w-12 rounded-full shadow-lg transition-all hover:shadow-xl"
                disabled={isLoading}
              >
                {getButtonIcon()}
              </Button>

              {/* Status indicator */}
              {rateLimitStatus && (
                <div
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusIndicatorColor()}`}
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
