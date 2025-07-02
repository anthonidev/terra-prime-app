import { RateLimitStatus } from '@/types/chat/chatbot.types';
import { AlertCircle, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getRateLimitStatus } from '../actions';
import Chatbot from './ChatBot';

const ChatbotButton: React.FC = () => {
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

  const getButtonStyle = () => {
    if (rateLimitStatus?.isBlocked) {
      return 'bg-red-500 hover:bg-red-600 cursor-not-allowed';
    }
    if (rateLimitStatus && rateLimitStatus.remaining < 10) {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    return 'bg-blue-600 hover:bg-blue-700';
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
      {/* Chatbot Button */}
      <div className="group relative">
        <button
          onClick={handleChatbotToggle}
          disabled={rateLimitStatus?.isBlocked}
          className={`relative rounded-lg p-2 text-white transition-all duration-200 ${getButtonStyle()} ${rateLimitStatus?.isBlocked ? 'opacity-50' : 'hover:scale-105'} `}
          title={getTooltipText()}
        >
          <MessageCircle className="h-5 w-5" />

          {/* Notification dot */}
          {hasNewNotification && (
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
          )}

          {/* Warning indicator */}
          {rateLimitStatus && rateLimitStatus.remaining < 5 && !rateLimitStatus.isBlocked && (
            <div className="absolute -right-1 -bottom-1">
              <AlertCircle className="h-3 w-3 text-yellow-300" />
            </div>
          )}
        </button>

        {/* Rate limit indicator */}
        {rateLimitStatus && (
          <div className="absolute top-full right-0 z-50 mt-1 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {rateLimitStatus.remaining}/{rateLimitStatus.limit} mensajes
          </div>
        )}
      </div>

      {/* Chatbot Sheet */}
      <Chatbot isOpen={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </>
  );
};

export default ChatbotButton;
