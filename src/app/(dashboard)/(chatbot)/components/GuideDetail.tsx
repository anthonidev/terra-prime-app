'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuideDetailResponse } from '@/types/chat/chatbot.types';
import { CheckCircle, BookOpen } from 'lucide-react';

interface GuideDetailProps {
  guide: GuideDetailResponse;
  isLoading: boolean;
}

export const GuideDetail = ({ guide, isLoading }: GuideDetailProps) => {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {guide.guide.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{guide.guide.description}</p>
        </div>

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Pasos a seguir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guide.guide.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
