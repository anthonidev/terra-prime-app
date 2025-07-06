'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AvailableGuidesResponse } from '@/types/chat/chatbot.types';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

interface GuidesListProps {
  guides: AvailableGuidesResponse;
  onSelectGuide: (guideKey: string) => void;
  isLoading: boolean;
}

export const GuidesList = ({ guides, onSelectGuide, isLoading }: GuidesListProps) => {
  if (guides.guides.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <BookOpen className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">Sin guías disponibles</h3>
        <p className="text-muted-foreground max-w-[280px] text-sm">
          Las guías de ayuda aparecerán aquí cuando estén disponibles para tu rol
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-1.5 px-4 pb-4">
        {guides.guides.map((guide, index) => (
          <Card
            key={guide.guideKey}
            className="group border-border/50 hover:border-border cursor-pointer py-0 transition-all duration-200 hover:shadow-sm"
            onClick={() => !isLoading && onSelectGuide(guide.guideKey)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {/* Icono */}
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="bg-primary/10 group-hover:bg-primary/15 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                      <BookOpen className="text-primary h-5 w-5" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-foreground group-hover:text-primary line-clamp-1 text-sm font-medium transition-colors">
                      {guide.title}
                    </h4>

                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {guide.description}
                    </p>
                  </div>
                </div>

                {/* Indicador de acción al costado */}
                <div className="text-primary flex flex-shrink-0 items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Abrir guía</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer con información del rol */}
      {guides.userRole && (
        <div className="px-4 pb-4">
          <div className="border-t pt-4">
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
              <Star className="h-3 w-3" />
              <span>Contenido personalizado para:</span>
              <Badge variant="outline" className="text-xs">
                {guides.userRole.name}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Espaciado inferior */}
      <div className="h-4" />
    </div>
  );
};
