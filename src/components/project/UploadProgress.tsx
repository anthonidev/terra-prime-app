"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface UploadProgressProps {
  currentStep: "upload" | "review" | "success";
}
const UploadProgress: React.FC<UploadProgressProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Badge
        variant={currentStep === "upload" ? "default" : "outline"}
        className="mr-2"
      >
        1. Cargar archivo
      </Badge>
      <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
      <Badge
        variant={currentStep === "review" ? "default" : "outline"}
        className="mr-2"
      >
        2. Revisar datos
      </Badge>
      <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
      <Badge variant={currentStep === "success" ? "default" : "outline"}>
        3. Finalizar
      </Badge>
    </div>
  );
};
export default UploadProgress;
