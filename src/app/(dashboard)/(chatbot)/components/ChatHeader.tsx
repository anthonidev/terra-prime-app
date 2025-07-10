'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, BookOpen, Bot, History, MessageSquarePlus, X } from 'lucide-react';
import { ViewType } from '../hooks/useChatbot';

interface ChatHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewChat: () => void;
  onCloseChat: () => void;
  sessionCount: number;
}

export const ChatHeader = ({
  currentView,
  onViewChange,
  onNewChat,
  onCloseChat,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  sessionCount
}: ChatHeaderProps) => {
  const getTitle = () => {
    switch (currentView) {
      case 'sessions':
        return 'Historial de Conversaciones';
      case 'guides':
        return 'Centro de Ayuda';
      case 'guide-detail':
        return 'Guía Detallada';
      default:
        return 'SmartBot';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'sessions':
        return 'Tus conversaciones anteriores';
      case 'guides':
        return 'Encuentra respuestas rápidas';
      case 'guide-detail':
        return 'Información detallada';
      default:
        return 'Tu asistente inteligente';
    }
  };

  const showBackButton = currentView !== 'chat';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const isMainView = currentView === 'chat';

  return (
    <div className="bg-background flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('chat')}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Logo/Avatar del bot */}
            <div className="relative">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Bot className="text-primary-foreground h-5 w-5" />
              </div>
              {/* Indicador de estado activo */}
              <div className="border-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-500" />
            </div>
          </div>
        )}

        {/* Título y subtítulo */}
        <div className="flex flex-col">
          <h1 className="text-foreground text-lg font-semibold">{getTitle()}</h1>
          <p className="text-muted-foreground text-sm">{getSubtitle()}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          {currentView === 'chat' && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onNewChat} className="h-9 w-9 p-0">
                    <MessageSquarePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Nueva conversación</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('sessions')}
                    className="h-9 w-9 p-0"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Historial</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('guides')}
                    className="h-9 w-9 p-0"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Centro de ayuda</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {/* Botón de cerrar - siempre visible */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseChat}
                className="text-muted-foreground hover:text-destructive ml-2 h-9 w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Cerrar chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
