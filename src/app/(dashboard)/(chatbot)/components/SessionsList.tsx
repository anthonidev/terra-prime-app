'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChatSession } from '@/types/chat/chatbot.types';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SessionsListProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading: boolean;
}

export const SessionsList = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  isLoading
}: SessionsListProps) => {
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: es });
    } else if (isYesterday(date)) {
      return 'Ayer';
    } else {
      return format(date, 'dd/MM', { locale: es });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSessionId(sessionId);
    try {
      await onDeleteSession(sessionId);
    } finally {
      setDeletingSessionId(null);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <MessageSquare className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">Sin conversaciones</h3>
        <p className="text-muted-foreground max-w-[240px] text-sm">
          Tus conversaciones anteriores aparecerán aquí. Inicia una nueva conversación para
          comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-1.5 p-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="group border-border/50 hover:border-border cursor-pointer py-0 transition-all duration-200 hover:shadow-sm"
            onClick={() => onSelectSession(session.id)}
          >
            <CardContent className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Título de la sesión */}
                  <h4 className="text-foreground group-hover:text-primary mb-0.5 line-clamp-2 text-sm font-medium transition-colors">
                    {session.title}
                  </h4>

                  {/* Metadata de tiempo */}
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{formatSessionDate(session.updatedAt)}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span>
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                        locale: es
                      })}
                    </span>
                  </div>
                </div>

                {/* Menú de acciones */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isLoading || deletingSessionId === session.id}
                    >
                      {deletingSessionId === session.id ? (
                        <div className="border-muted-foreground h-3 w-3 animate-spin rounded-full border border-t-transparent" />
                      ) : (
                        <MoreVertical className="h-3 w-3" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="text-destructive focus:text-destructive"
                      disabled={deletingSessionId === session.id}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Espaciado inferior para mejor scroll */}
      <div className="h-4" />
    </div>
  );
};
