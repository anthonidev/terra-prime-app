'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface Props {
  currentStep: 'upload' | 'review' | 'success';
}
const UploadProgress: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="text-muted-foreground flex items-center overflow-x-auto">
      <Badge variant={currentStep === 'upload' ? 'default' : 'outline'} className="mr-2 text-sm">
        1. Cargar archivo
      </Badge>
      <ChevronRight className="text-muted-foreground/50 mx-1 h-4 w-4" />
      <Badge variant={currentStep === 'review' ? 'default' : 'outline'} className="mr-2 text-sm">
        2. Revisar datos
      </Badge>
      <ChevronRight className="text-muted-foreground/50 mx-1 h-4 w-4" />
      <Badge variant={currentStep === 'success' ? 'default' : 'outline'} className="text-sm">
        3. Finalizar
      </Badge>
    </div>
  );
};
export default UploadProgress;
