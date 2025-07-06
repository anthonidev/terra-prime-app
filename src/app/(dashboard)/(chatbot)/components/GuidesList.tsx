'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AvailableGuidesResponse } from '@/types/chat/chatbot.types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface GuidesListProps {
  guides: AvailableGuidesResponse;
  onSelectGuide: (guideKey: string) => void;
  isLoading: boolean;
}

export const GuidesList = ({ guides, onSelectGuide, isLoading }: GuidesListProps) => {
  if (guides.guides.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          No hay guías disponibles
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Las guías de ayuda aparecerán aquí cuando estén disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-3 overflow-y-auto p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explora las guías paso a paso para diferentes funcionalidades del sistema
        </p>
      </div>

      {guides.guides.map((guide) => (
        <Card
          key={guide.guideKey}
          className="cursor-pointer py-0 transition-all hover:shadow-md"
          onClick={() => !isLoading && onSelectGuide(guide.guideKey)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-1 items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
                    {guide.title}
                  </h4>
                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {guide.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}

      {guides.userRole && (
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Guías disponibles para: <span className="font-medium">{guides.userRole.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};
