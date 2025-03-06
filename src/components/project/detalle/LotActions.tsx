import { Button } from "@/components/ui/button";
import { BlockDetailDto, LotResponseDto } from "@/types/project.types";
import { Edit, MapPin, Plus } from "lucide-react";

interface LotActionsProps {
  onCreateClick: (blockId?: string) => void;
  onEditClick?: (lot: LotResponseDto) => void;
  lot?: LotResponseDto;
  block?: BlockDetailDto;
  variant?: "default" | "minimal" | "block" | "table-header" | "table-cell";
}

export default function LotActions({
  onCreateClick,
  onEditClick,
  lot,
  block,
  variant = "default",
}: LotActionsProps) {
  if (variant === "minimal" && lot && onEditClick) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onEditClick(lot)}
        title="Editar lote"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === "table-cell" && lot && onEditClick) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8"
        onClick={() => onEditClick(lot)}
        title="Editar lote"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === "block" && block) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onCreateClick(block.id)}
        title="Añadir lote a esta manzana"
      >
        <Plus className="h-3.5 w-3.5" />
        <MapPin className="h-3.5 w-3.5" />
        <span>Añadir lote</span>
      </Button>
    );
  }

  if (variant === "table-header") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onCreateClick()}
      >
        <Plus className="h-4 w-4" />
        <span>Nuevo lote</span>
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
      <span>Nuevo lote</span>
    </Button>
  );
}
