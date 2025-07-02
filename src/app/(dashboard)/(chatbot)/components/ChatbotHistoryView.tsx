import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatSession } from '@/types/chat/chatbot.types';
import { ChevronRight, Circle, Clock, MessageCircle, MessageSquare, Trash2 } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface ChatbotHistoryViewProps {
  sessions: ChatSession[];
  isLoading: boolean;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onBackToChat: () => void;
}

export const ChatbotHistoryView = ({
  sessions,
  isLoading,
  onSelectSession,
  onDeleteSession,
  onBackToChat
}: ChatbotHistoryViewProps) => {
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} hora${Math.floor(diffInHours) !== 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
    }
  };

  const handleDeleteSession = async (sessionId: string, event: MouseEvent) => {
    event.stopPropagation(); // Prevent triggering onSelectSession
    setDeletingSessionId(sessionId);

    try {
      await onDeleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
    } finally {
      setDeletingSessionId(null);
    }
  };

  // Separate active and inactive sessions
  const activeSessions = sessions.filter((session) => session.isActive);
  const inactiveSessions = sessions.filter((session) => !session.isActive);
  const allSessions = [...activeSessions, ...inactiveSessions];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {/* Header info */}
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Historial de Conversaciones
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sessions.length > 0
                  ? `${sessions.length} conversación${sessions.length !== 1 ? 'es' : ''} guardada${sessions.length !== 1 ? 's' : ''}`
                  : 'No hay conversaciones guardadas'}
              </p>
            </div>

            {/* Sessions List */}
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center gap-3">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : allSessions.length === 0 ? (
              <Card className="border-dashed border-gray-300 dark:border-gray-600">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500" />
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                    No hay conversaciones
                  </h3>
                  <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Cuando inicies conversaciones con el asistente, aparecerán aquí para que puedas
                    revisarlas más tarde.
                  </p>
                  <Button
                    onClick={onBackToChat}
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Iniciar nueva conversación
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {allSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`group cursor-pointer transition-all hover:shadow-sm ${
                      session.isActive
                        ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        {/* Session info */}
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Circle
                            className={`h-2.5 w-2.5 flex-shrink-0 ${
                              session.isActive
                                ? 'fill-green-500 text-green-500'
                                : 'fill-gray-400 text-gray-400 dark:fill-gray-500 dark:text-gray-500'
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                {session.isActive ? 'Sesión Activa' : 'Conversación'}
                              </span>
                              {session.isActive && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 px-2 py-0 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                >
                                  Activa
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{formatDate(session.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteSession(session.id, e)}
                                  disabled={deletingSessionId === session.id}
                                  className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                Eliminar conversación
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Helper text */}
            {allSessions.length > 0 && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-start gap-2">
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      Haz clic en una conversación para continuarla o revisa su historial. Puedes
                      eliminar conversaciones pasando el cursor sobre ellas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
