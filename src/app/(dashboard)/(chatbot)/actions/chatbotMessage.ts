'use server';
import { httpClient } from '@/lib/api/http-client';
import {
  HistoryResponse,
  MessageRequest,
  MessageResponse,
  RateLimitResponse,
  SessionsResponse
} from '@/types/chat/chatbot.types';
import { revalidateTag } from 'next/cache';

const CHATBOT_CACHE_TAG = 'chatbot';

export async function sendMessage(
  data: MessageRequest
): Promise<MessageResponse | { success: false; error: string }> {
  try {
    const result = await httpClient<MessageResponse>('/api/chatbot/message', {
      method: 'POST',
      body: data,
      cache: 'no-store'
    });

    revalidateTag(`${CHATBOT_CACHE_TAG}-sessions`);
    revalidateTag(`${CHATBOT_CACHE_TAG}-rate-limit`);

    return result;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar mensaje'
    };
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

export async function deleteSession(sessionId: string) {
  try {
    const result = await httpClient<{
      success: boolean;
      message: string;
      error?: string;
    }>(`/api/chatbot/chat/session/${sessionId}`, {
      method: 'DELETE',
      cache: 'no-store'
    });

    revalidateTag(`${CHATBOT_CACHE_TAG}-sessions`);
    revalidateTag(`${CHATBOT_CACHE_TAG}-history-${sessionId}`);

    return result;
  } catch (error) {
    console.error(`Error al cerrar sesión ${sessionId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cerrar sesión'
    };
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
