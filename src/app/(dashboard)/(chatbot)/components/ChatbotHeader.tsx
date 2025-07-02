import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Book, Bot, History, Plus, ArrowLeft, X } from 'lucide-react';

interface ChatbotHeaderProps {
  userRole: { code: string; name: string } | null;
  currentView: 'chat' | 'history' | 'guides' | 'guide-detail';
  onNewChat: () => void;
  onViewHistory: () => void;
  onViewGuides: () => void;
  onClose: () => void;
  currentSessionId: string | null;
}

export const ChatbotHeader = ({
  currentView,
  onNewChat,
  onViewHistory,
  onViewGuides,
  onClose
}: ChatbotHeaderProps) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'chat':
        return 'Asistente';
      case 'history':
        return 'Historial';
      case 'guides':
        return 'Guías';
      case 'guide-detail':
        return 'Guía';
      default:
        return 'Asistente';
    }
  };

  const getViewIcon = () => {
    switch (currentView) {
      case 'chat':
        return <Bot className="h-4 w-4" />;
      case 'history':
        return <History className="h-4 w-4" />;
      case 'guides':
      case 'guide-detail':
        return <Book className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const isMainView = currentView === 'chat';

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Navigation */}
        <div className="flex items-center gap-3">
          {!isMainView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <div className="text-gray-600 dark:text-gray-400">{getViewIcon()}</div>
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getViewTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {isMainView && (
            <>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onNewChat}
                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Nuevo chat
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onViewHistory}
                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Historial
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onViewGuides}
                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Book className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Guías
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-700" />
            </>
          )}

          {/* Close button - always visible */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Cerrar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};
