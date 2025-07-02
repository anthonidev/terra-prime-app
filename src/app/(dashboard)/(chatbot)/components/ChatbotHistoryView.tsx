import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatSession } from '@/types/chat/chatbot.types';
import { Clock, MessageCircle, Circle, ChevronRight } from 'lucide-react';
import React from 'react';

interface ChatbotHistoryViewProps {
  sessions: ChatSession[];
  isLoading: boolean;
  onSelectSession: (sessionId: string) => void;
  onBackToChat: () => void;
}

export const ChatbotHistoryView: React.FC<ChatbotHistoryViewProps> = ({
  sessions,
  isLoading,
  onSelectSession,
  onBackToChat
}) => {
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

  const getDetailedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6">
            {/* Description */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Aquí puedes revisar todas tus conversaciones anteriores con el asistente virtual.
              </p>
            </div>

            {/* Sessions List */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card className="border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageCircle className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    No hay conversaciones previas
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center text-sm">
                    Cuando inicies conversaciones con el asistente, aparecerán aquí para que puedas
                    revisarlas más tarde.
                  </p>
                  <Button onClick={onBackToChat} variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Iniciar nueva conversación
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Active session first */}
                {sessions
                  .filter((session) => session.isActive)
                  .map((session) => (
                    <Card
                      key={session.id}
                      className="border-border bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all hover:shadow-md"
                      onClick={() => onSelectSession(session.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                              <h3 className="text-foreground font-semibold">Sesión Activa</h3>
                              <Badge variant="default" className="text-xs">
                                En curso
                              </Badge>
                            </div>

                            <p className="text-muted-foreground mb-3 text-sm">
                              Tu conversación actual con el asistente virtual.
                            </p>

                            <div className="text-muted-foreground flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Finalizada {formatDate(session.updatedAt)}</span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className="text-muted-foreground h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
