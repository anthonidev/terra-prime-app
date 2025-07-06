'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from '@/types/chat/chatbot.types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bot, Check, Copy, User } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isOlderThanTwoHours =
    new Date().getTime() - new Date(message.createdAt).getTime() > 2 * 60 * 60 * 1000;

  const formatTime = (dateString: string) => {
    if (isOlderThanTwoHours) {
      return new Date(dateString).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const getMetadataLabel = (queryType: string) => {
    switch (queryType) {
      case 'database':
        return 'BD';
      case 'system':
        return 'Sistema';
      default:
        return queryType;
    }
  };

  const getMetadataColor = (queryType: string) => {
    switch (queryType) {
      case 'database':
        return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800';
      case 'system':
        return 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  if (isUser) {
    return (
      <div className="group flex justify-end gap-3">
        <div className="flex max-w-[80%] flex-col items-end space-y-1">
          {/* Mensaje del usuario */}
          <div className="relative">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm">
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-muted-foreground flex items-center gap-2 px-1 text-xs">
            <span>{formatTime(message.createdAt)}</span>
          </div>
        </div>

        {/* Avatar del usuario */}
        <div className="flex-shrink-0">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
            <User className="text-muted-foreground h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  // Mensaje del asistente
  return (
    <div className="group w-full py-3">
      <div className="space-y-1">
        {/* Header con nombre del bot */}
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
            <Bot className="text-primary h-3 w-3" />
          </div>
          <span className="text-foreground text-sm font-medium">SmartBot</span>
        </div>

        {/* Contenido del mensaje */}
        <div className="group/message relative">
          <div className="text-foreground pl-8 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Botón de copiar - aparece en hover */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="bg-background/80 border-border/50 hover:bg-muted absolute top-0 right-0 h-7 w-7 rounded-full border p-0 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover/message:opacity-100"
          >
            {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>

        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-2 pl-8 text-xs">
          <span>{formatTime(message.createdAt)}</span>

          {message.metadata?.queryType && (
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getMetadataColor(message.metadata.queryType)}`}
            >
              {getMetadataLabel(message.metadata.queryType)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
