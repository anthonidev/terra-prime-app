import { Button } from "@/components/ui/button";
import { BlockDetailDto, StageDetailDto } from "@/types/project.types";
import { Building2, Edit, Plus } from "lucide-react";
interface BlockActionsProps {
  onCreateClick: (stageId?: string) => void;
  onEditClick?: (block: BlockDetailDto) => void;
  block?: BlockDetailDto;
  stage?: StageDetailDto;
  variant?: "default" | "minimal" | "stage";
}
export default function BlockActions({
  onCreateClick,
  onEditClick,
  block,
  stage,
  variant = "default",
}: BlockActionsProps) {
  if (variant === "minimal" && block && onEditClick) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEditClick(block)}
        title="Editar manzana"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }
  if (variant === "stage" && stage) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onCreateClick(stage.id)}
        title="Añadir manzana a esta etapa"
      >
        <Plus className="h-3.5 w-3.5" />
        <Building2 className="h-3.5 w-3.5" />
        <span>Añadir manzana</span>
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={() => onCreateClick()}
    >
      <Plus className="h-4 w-4" />
      <span>Nueva Manzana</span>
    </Button>
  );
}
