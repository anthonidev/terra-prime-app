import {
  closeSession,
  getAvailableGuides,
  getChatSessions,
  getGuideDetail,
  getQuickHelp,
  getRateLimitStatus,
  getSessionHistory,
  searchContext,
  sendMessage
} from '../actions';
import {
  ChatMessage,
  ChatSession,
  Guide,
  GuideDetailResponse,
  MessageRequest,
  RateLimitStatus,
  SearchContextRequest
} from '@/types/chat/chatbot.types';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseChatbotReturn {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentSessionId: string | null;
  rateLimitStatus: RateLimitStatus | null;
  quickHelp: string[];
  userRole: { code: string; name: string } | null;
  availableGuides: Guide[];
  selectedGuide: GuideDetailResponse | null;
  sessions: ChatSession[];

  // Actions
  initializeChatbot: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  loadSessionHistory: (sessionId: string) => Promise<void>;
  loadGuides: () => Promise<void>;
  loadGuideDetail: (guideKey: string) => Promise<void>;
  searchContent: (query: string) => Promise<void>;
  closeCurrentSession: () => Promise<void>;
  clearError: () => void;
  resetChatbot: () => void;

  // UI helpers
  isRateLimited: boolean;
  shouldShowWarning: boolean;
  getRateLimitMessage: () => string | null;
}

export const useChatbot = (): UseChatbotReturn => {
  // Core state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Chatbot specific state
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [quickHelp, setQuickHelp] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<{ code: string; name: string } | null>(null);
  const [availableGuides, setAvailableGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuideDetailResponse | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Computed values
  const isRateLimited = rateLimitStatus?.isBlocked || false;
  const shouldShowWarning = rateLimitStatus ? rateLimitStatus.remaining < 10 : false;

  // Helper functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetChatbot = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setSelectedGuide(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const getRateLimitMessage = useCallback((): string | null => {
    if (!rateLimitStatus) return null;

    if (rateLimitStatus.isBlocked) {
      return `🚫 Límite alcanzado. Intenta después de ${new Date(rateLimitStatus.resetTime).toLocaleTimeString()}`;
    }

    if (rateLimitStatus.remaining < 10) {
      return `⚠️ Te quedan ${rateLimitStatus.remaining} mensajes`;
    }

    return null;
  }, [rateLimitStatus]);

  // Initialize chatbot
  const initializeChatbot = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cancel any previous requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load initial data
      const [quickHelpResponse, rateLimitResponse, sessionsResponse] = await Promise.allSettled([
        getQuickHelp(),
        getRateLimitStatus(),
        getChatSessions()
      ]);

      // Handle quick help
      if (quickHelpResponse.status === 'fulfilled' && quickHelpResponse.value.success) {
        setQuickHelp(quickHelpResponse.value.help);
        setUserRole(quickHelpResponse.value.userRole);
      }

      // Handle rate limit
      if (rateLimitResponse.status === 'fulfilled' && rateLimitResponse.value.success) {
        setRateLimitStatus(rateLimitResponse.value.rateLimitStatus);
      }

      // Handle sessions
      if (sessionsResponse.status === 'fulfilled' && sessionsResponse.value.success) {
        setSessions(sessionsResponse.value.sessions);

        // Load active session if exists
        const activeSession = sessionsResponse.value.sessions.find((s) => s.isActive);
        if (activeSession) {
          setCurrentSessionId(activeSession.id);
          await loadSessionHistory(activeSession.id);
        }
      }
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      setError('Error al inicializar el chatbot');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load session history
  const loadSessionHistory = useCallback(async (sessionId: string) => {
    try {
      const historyResponse = await getSessionHistory(sessionId);
      if (historyResponse.success) {
        setMessages(historyResponse.messages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
      setError('Error al cargar el historial');
    }
  }, []);

  // Send message
  const sendChatMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading || isRateLimited) return;

      try {
        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: messageText,
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, userMessage]);

        // Prepare request
        const messageRequest: MessageRequest = {
          message: messageText,
          ...(currentSessionId && { sessionId: currentSessionId })
        };

        const response = await sendMessage(messageRequest);

        if (response.success && response.data) {
          // Update session ID if it's a new conversation
          if (!currentSessionId) {
            setCurrentSessionId(response.data.sessionId);
          }

          // Add assistant response
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.data.response,
            createdAt: response.data.timestamp
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Update rate limit status
          if (response.data.rateLimitInfo) {
            setRateLimitStatus((prev) =>
              prev
                ? {
                    ...prev,
                    current: prev.limit - response.data.rateLimitInfo.remaining,
                    remaining: response.data.rateLimitInfo.remaining
                  }
                : null
            );
          }
        } else {
          setError(response.error || 'Error al enviar mensaje');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Error al enviar mensaje');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, isRateLimited, currentSessionId]
  );

  // Load guides
  const loadGuides = useCallback(async () => {
    try {
      setIsLoading(true);
      const guidesResponse = await getAvailableGuides();
      if (guidesResponse.success) {
        setAvailableGuides(guidesResponse.guides);
      }
    } catch (error) {
      console.error('Error loading guides:', error);
      setError('Error al cargar las guías');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load guide detail
  const loadGuideDetail = useCallback(async (guideKey: string) => {
    try {
      setIsLoading(true);
      const guideResponse = await getGuideDetail(guideKey);
      if (guideResponse.success) {
        setSelectedGuide(guideResponse);
      }
    } catch (error) {
      console.error('Error loading guide detail:', error);
      setError('Error al cargar la guía');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search content
  const searchContent = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const searchRequest: SearchContextRequest = { query };
      const searchResponse = await searchContext(searchRequest);

      if (searchResponse.success && searchResponse.data) {
        // Handle search results - could add to state if needed
        console.log('Search results:', searchResponse.data.results);
      }
    } catch (error) {
      console.error('Error searching content:', error);
      setError('Error en la búsqueda');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Close current session
  const closeCurrentSession = useCallback(async () => {
    if (!currentSessionId) return;

    try {
      setIsLoading(true);
      const response = await closeSession(currentSessionId);

      if (response.success) {
        setCurrentSessionId(null);
        setMessages([]);
        // Refresh sessions list
        const sessionsResponse = await getChatSessions();
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.sessions);
        }
      }
    } catch (error) {
      console.error('Error closing session:', error);
      setError('Error al cerrar la sesión');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages,
    isLoading,
    error,
    currentSessionId,
    rateLimitStatus,
    quickHelp,
    userRole,
    availableGuides,
    selectedGuide,
    sessions,

    // Actions
    initializeChatbot,
    sendChatMessage,
    loadSessionHistory,
    loadGuides,
    loadGuideDetail,
    searchContent,
    closeCurrentSession,
    clearError,
    resetChatbot,

    // UI helpers
    isRateLimited,
    shouldShowWarning,
    getRateLimitMessage
  };
};
