'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  AvailableGuidesResponse,
  GuideDetailResponse,
  HistoryResponse,
  MessageRequest,
  MessageResponse,
  QuickHelpResponse,
  RateLimitResponse,
  SearchContextRequest,
  SearchContextResponse,
  SessionsResponse
} from '@/types/chat/chatbot.types';
import { revalidateTag } from 'next/cache';

const CHATBOT_CACHE_TAG = 'chatbot';

export async function getQuickHelp(): Promise<QuickHelpResponse> {
  try {
    return await httpClient<QuickHelpResponse>('/api/chatbot/quick-help', {
      method: 'GET',
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-quick-help`],
        revalidate: 3600
      }
    });
  } catch (error) {
    console.error('Error al obtener ayuda rápida:', error);
    throw error;
  }
}

export async function getRateLimitStatus(): Promise<RateLimitResponse> {
  try {
    return await httpClient<RateLimitResponse>('/api/chatbot/rate-limit/status', {
      method: 'GET',
      cache: 'no-store'
    });
  } catch (error) {
    console.error('Error al obtener estado de límite:', error);
    throw error;
  }
}

export async function sendMessage(data: MessageRequest) {
  try {
    const result = await httpClient<MessageResponse>('/api/chatbot/message', {
      method: 'POST',
      body: data,
      cache: 'no-store'
    });

    revalidateTag(`${CHATBOT_CACHE_TAG}-sessions`);
    revalidateTag(`${CHATBOT_CACHE_TAG}-rate-limit`);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar mensaje'
    };
  }
}

export async function searchContext(data: SearchContextRequest) {
  try {
    const result = await httpClient<SearchContextResponse>('/api/chatbot/search-context', {
      method: 'POST',
      body: data,
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-search`],
        revalidate: 600
      }
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al buscar contexto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error en la búsqueda'
    };
  }
}

export async function getAvailableGuides(): Promise<AvailableGuidesResponse> {
  try {
    return await httpClient<AvailableGuidesResponse>('/api/chatbot/available-guides', {
      method: 'GET',
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-guides`],
        revalidate: 3600
      }
    });
  } catch (error) {
    console.error('Error al obtener guías disponibles:', error);
    throw error;
  }
}

export async function getGuideDetail(guideKey: string): Promise<GuideDetailResponse> {
  try {
    return await httpClient<GuideDetailResponse>(`/api/chatbot/guide/${guideKey}`, {
      method: 'GET',
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-guide-${guideKey}`],
        revalidate: 3600
      }
    });
  } catch (error) {
    console.error(`Error al obtener guía ${guideKey}:`, error);
    throw error;
  }
}

export async function getChatSessions(): Promise<SessionsResponse> {
  try {
    return await httpClient<SessionsResponse>('/api/chatbot/sessions', {
      method: 'GET',
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-sessions`],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    throw error;
  }
}

export async function getSessionHistory(sessionId: string): Promise<HistoryResponse> {
  try {
    return await httpClient<HistoryResponse>(`/api/chatbot/history/${sessionId}`, {
      method: 'GET',
      next: {
        tags: [`${CHATBOT_CACHE_TAG}-history-${sessionId}`],
        revalidate: 60
      }
    });
  } catch (error) {
    console.error(`Error al obtener historial de sesión ${sessionId}:`, error);
    throw error;
  }
}

export async function closeSession(sessionId: string) {
  try {
    const result = await httpClient(`/api/chatbot/session/${sessionId}`, {
      method: 'DELETE',
      cache: 'no-store'
    });

    revalidateTag(`${CHATBOT_CACHE_TAG}-sessions`);
    revalidateTag(`${CHATBOT_CACHE_TAG}-history-${sessionId}`);

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al cerrar sesión ${sessionId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cerrar sesión'
    };
  }
}
