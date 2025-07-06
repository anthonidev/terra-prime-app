'use server';
import { httpClient } from '@/lib/api/http-client';
import {
  AvailableGuidesResponse,
  GuideDetailResponse,
  QuickHelpResponse
} from '@/types/chat/chatbot.types';
const CHATBOT_CACHE_TAG = 'chatbot';

export async function getQuickHelp(): Promise<QuickHelpResponse> {
  try {
    return await httpClient<QuickHelpResponse>('/api/chatbot/help/quick-help', {
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

export async function getAvailableGuides(): Promise<AvailableGuidesResponse> {
  try {
    return await httpClient<AvailableGuidesResponse>('/api/chatbot/help/available-guides', {
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
    return await httpClient<GuideDetailResponse>(`/api/chatbot/help/guide/${guideKey}`, {
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
