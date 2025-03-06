"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface SuccessStepProps {
  resetUpload: () => void;
  goToProjectsList: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  resetUpload,
  goToProjectsList,
}) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertTitle>Proyecto creado correctamente</AlertTitle>
        <AlertDescription>
          El proyecto ha sido creado con éxito. Puedes verlo en la lista de
          proyectos o crear otro proyecto.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={goToProjectsList}>
          Ver lista de proyectos
        </Button>
        <Button
          onClick={resetUpload}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          Crear otro proyecto
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
