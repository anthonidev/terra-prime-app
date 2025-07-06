'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageSquarePlus, History, BookOpen, X, ArrowLeft } from 'lucide-react';
import { ViewType } from '../hooks/useChatbot';

interface ChatHeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewChat: () => void;
  onCloseChat: () => void; // Nuevo prop para cerrar el chat
  sessionCount: number;
}

export const ChatHeader = ({
  currentView,
  onViewChange,
  onNewChat,
  onCloseChat, // Recibimos la función para cerrar
  sessionCount
}: ChatHeaderProps) => {
  const getTitle = () => {
    switch (currentView) {
      case 'sessions':
        return 'Todas las Sesiones';
      case 'guides':
        return 'Guías de Ayuda';
      case 'guide-detail':
        return 'Detalle de Guía';
      default:
        return 'Asistente Virtual';
    }
  };

  const showBackButton = currentView !== 'chat';

  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('chat')}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          {currentView === 'chat' && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onNewChat} className="h-8 w-8 p-0">
                    <MessageSquarePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nuevo Chat</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('sessions')}
                    className="h-8 w-8 p-0"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver Todas las Sesiones</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('guides')}
                    className="h-8 w-8 p-0"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guías de Ayuda</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {/* Botón cerrar chat - siempre visible */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseChat}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cerrar Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
