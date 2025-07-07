'use client';

import {
  AvailableGuidesResponse,
  ChatMessage,
  ChatSession,
  GuideDetailResponse,
  QuickHelpResponse,
  RateLimitStatus
} from '@/types/chat/chatbot.types';
import { useCallback, useRef, useState } from 'react';
import { getAvailableGuides, getGuideDetail, getQuickHelp } from '../actions/chatbotHelp';
import {
  deleteSession,
  getChatSessions,
  getRateLimitStatus,
  getSessionHistory,
  sendMessage
} from '../actions/chatbotMessage';

export type ViewType = 'chat' | 'sessions' | 'guides' | 'guide-detail';
export interface TemporalContent {
  id: string;
  type: 'quick-help-list' | 'guide-list' | 'guide-detail';
  title: string;
  data: QuickHelpResponse | AvailableGuidesResponse | GuideDetailResponse;
  timestamp: string;
}

export const useChatbot = () => {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [quickHelp, setQuickHelp] = useState<QuickHelpResponse | null>(null);
  const [availableGuides, setAvailableGuides] = useState<AvailableGuidesResponse | null>(null);
  const [currentGuide, setCurrentGuide] = useState<GuideDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [temporalContent, setTemporalContent] = useState<TemporalContent | null>(null);

  const showQuickHelpList = useCallback(() => {
    if (quickHelp) {
      const content: TemporalContent = {
        id: `temp-help-list-${Date.now()}`,
        type: 'quick-help-list',
        title: 'Preguntas Frecuentes',
        data: quickHelp,
        timestamp: new Date().toISOString()
      };
      setTemporalContent(content);
    }
  }, [quickHelp]);

  const showGuidesList = useCallback(() => {
    if (availableGuides) {
      const content: TemporalContent = {
        id: `temp-guides-list-${Date.now()}`,
        type: 'guide-list',
        title: 'Guías Disponibles',
        data: availableGuides,
        timestamp: new Date().toISOString()
      };
      setTemporalContent(content);
    }
  }, [availableGuides]);

  const showGuideDetail = useCallback(async (guideKey: string) => {
    try {
      setIsLoading(true);
      const response = await getGuideDetail(guideKey);
      if (response.success) {
        const content: TemporalContent = {
          id: `temp-guide-detail-${Date.now()}`,
          type: 'guide-detail',
          title: response.guide.title,
          data: response,
          timestamp: new Date().toISOString()
        };
        setTemporalContent(content);
      }
    } catch (err) {
      console.error('Error loading guide detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearTemporalContent = useCallback(() => {
    setTemporalContent(null);
  }, []);
  // Legacy ref para compatibilidad con componentes existentes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ref para almacenar la función de scroll del hook useScrollToBottom
  const scrollToBottomFuncRef = useRef<(() => void) | null>(null);

  // Función para registrar la función de scroll desde ChatContent
  const registerScrollFunction = useCallback((scrollFunc: () => void) => {
    scrollToBottomFuncRef.current = scrollFunc;
  }, []);

  // Función pública para triggear scroll desde componentes externos
  const triggerScrollToBottom = useCallback(() => {
    if (scrollToBottomFuncRef.current) {
      scrollToBottomFuncRef.current();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadRateLimit = useCallback(async () => {
    try {
      const response = await getRateLimitStatus();
      if (response.success) {
        setRateLimitStatus(response.rateLimitStatus);
      }
    } catch (err) {
      console.error('Error loading rate limit:', err);
    }
  }, []);

  const loadQuickHelp = useCallback(async () => {
    try {
      const response = await getQuickHelp();
      if (response.success) {
        setQuickHelp(response);
      }
    } catch (err) {
      console.error('Error loading quick help:', err);
    }
  }, []);

  const loadAvailableGuides = useCallback(async () => {
    try {
      const response = await getAvailableGuides();
      if (response.success) {
        setAvailableGuides(response);
      }
    } catch (err) {
      console.error('Error loading guides:', err);
    }
  }, []);

  const loadGuideDetail = useCallback(async (guideKey: string) => {
    try {
      setIsLoading(true);
      const response = await getGuideDetail(guideKey);
      if (response.success) {
        setCurrentGuide(response);
        setCurrentView('guide-detail');
      }
    } catch (err) {
      setError('Error al cargar el detalle de la guía');
      console.error('Error loading guide detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findOrCreateRecentSession = useCallback(async (sessions: ChatSession[]) => {
    if (sessions.length === 0) {
      return null;
    }

    const mostRecent = sessions[0];
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const lastUpdate = new Date(mostRecent.updatedAt);

    if (lastUpdate > thirtyMinutesAgo) {
      return mostRecent;
    }

    return null;
  }, []);

  const loadSessionHistory = useCallback(
    async (sessionId: string) => {
      try {
        setIsLoading(true);
        const response = await getSessionHistory(sessionId);
        if (response.success) {
          setMessages(response.messages);
          // Pequeño delay para asegurar scroll después de cargar mensajes
          setTimeout(() => {
            triggerScrollToBottom();
          }, 200);
        }
      } catch (err) {
        setError('Error al cargar el historial de la sesión');
        console.error('Error loading session history:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [triggerScrollToBottom]
  );

  const initializeChatbot = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar rate limit status
      await loadRateLimit();

      // Cargar sesiones
      const sessionsResponse = await getChatSessions();
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.sessions);

        // Buscar sesión reciente o crear nueva
        const recentSession = await findOrCreateRecentSession(sessionsResponse.sessions);
        if (recentSession) {
          setCurrentSession(recentSession);
          await loadSessionHistory(recentSession.id);
          setCurrentView('chat');
        } else {
          await createNewChat();
        }
      }

      // Cargar datos auxiliares
      await Promise.all([loadQuickHelp(), loadAvailableGuides()]);
    } catch (err) {
      setError('Error al inicializar el chatbot');
      console.error('Error initializing chatbot:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    findOrCreateRecentSession,
    loadSessionHistory,
    loadRateLimit,
    loadQuickHelp,
    loadAvailableGuides
  ]);

  const createNewChat = useCallback(async () => {
    try {
      setCurrentSession(null);
      setMessages([]);
      setCurrentView('chat');
      await loadQuickHelp();
    } catch (err) {
      setError('Error al crear nuevo chat');
      console.error('Error creating new chat:', err);
    }
  }, [loadQuickHelp]);

  const selectSession = useCallback(
    async (sessionId: string) => {
      try {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          setCurrentSession(session);
          await loadSessionHistory(sessionId);
          setCurrentView('chat');
        }
      } catch (err) {
        setError('Error al seleccionar la sesión');
        console.error('Error selecting session:', err);
      }
    },
    [sessions, loadSessionHistory]
  );

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isSendingMessage) return;

      try {
        setIsSendingMessage(true);
        setError(null);

        // Agregar mensaje del usuario inmediatamente
        const userMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          role: 'user',
          content: messageText.trim(),
          createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, userMessage]);

        // Enviar mensaje
        const response = await sendMessage({
          message: messageText.trim(),
          sessionId: currentSession?.id
        });

        if (response.success) {
          // Crear mensaje de respuesta con metadatos correctos del backend
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.response,
            createdAt: response.timestamp,
            // Usar metadatos del backend si están disponibles, sino usar 'system' como fallback
            metadata: response.metadata || {
              queryType: 'system'
            }
          };

          // Actualizar mensajes y sesión actual
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== userMessage.id),
            { ...userMessage, id: `user-${Date.now()}` },
            assistantMessage
          ]);

          // Si no había sesión, crear/actualizar la sesión actual
          if (!currentSession && response.sessionId) {
            const newSession: ChatSession = {
              id: response.sessionId,
              title: messageText.slice(0, 50) + (messageText.length > 50 ? '...' : ''),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setCurrentSession(newSession);
            setSessions((prev) => [newSession, ...prev]);
          }

          // Actualizar rate limit
          await loadRateLimit();

          // Scroll automático después de agregar respuesta
          setTimeout(triggerScrollToBottom, 100);
        } else {
          setError(response.error || 'Error al enviar mensaje');
          // Remover mensaje temporal del usuario
          setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        }
      } catch (err) {
        setError('Error al enviar mensaje');
        console.error('Error sending message:', err);
        // Remover mensaje temporal del usuario
        setMessages((prev) => prev.filter((m) => m.id.startsWith('temp-')));
      } finally {
        setIsSendingMessage(false);
      }
    },
    [currentSession, isSendingMessage, loadRateLimit, triggerScrollToBottom]
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const response = await deleteSession(sessionId);
        if (response.success) {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));

          // Si es la sesión actual, crear nueva
          if (currentSession?.id === sessionId) {
            await createNewChat();
          }
        } else {
          setError(response.error || 'Error al eliminar sesión');
        }
      } catch (err) {
        setError('Error al eliminar sesión');
        console.error('Error deleting session:', err);
      }
    },
    [currentSession, createNewChat]
  );

  // Añadir registerScrollFunction al return
  const chatbotReturn = {
    currentView,
    setCurrentView,
    sessions,
    currentSession,
    messages,
    isLoading,
    isSendingMessage,
    rateLimitStatus,
    quickHelp,
    availableGuides,
    currentGuide,
    error,
    initializeChatbot,
    createNewChat,
    selectSession,
    handleSendMessage,
    handleDeleteSession,
    loadGuideDetail,
    clearError,
    triggerScrollToBottom,
    registerScrollFunction,
    messagesEndRef,
    temporalContent,
    showQuickHelpList,
    showGuidesList,
    showGuideDetail,
    clearTemporalContent
  };

  return chatbotReturn;
};
