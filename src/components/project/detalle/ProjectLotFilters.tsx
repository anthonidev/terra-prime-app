import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LotStatus, ProjectDetailDto } from "@/types/project.types";

interface ProjectLotFiltersProps {
  projectDetail: ProjectDetailDto | null;
  currentFilters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ProjectLotFilters({
  projectDetail,
  currentFilters,
  onFilterChange,
  onReset,
  isLoading
}: ProjectLotFiltersProps) {
  const [searchValue, setSearchValue] = useState<string>(
    (currentFilters.search as string) || ""
  );

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onFilterChange({ search: searchValue || undefined });
    };
  
    const handleStageChange = (value: string) => {
      console.log("Value",value);
      if (value === "all") {
        const { stageId, blockId, ...restFilters } = { ...currentFilters };
        onFilterChange({
          ...restFilters,
          stageId: undefined,
          blockId: undefined
        });
      } else {
        const newFilters: Record<string, unknown> = { ...currentFilters, stageId: value };
        
        if (currentFilters.blockId) {
          const blockBelongsToStage = projectDetail?.stages
            .find(stage => stage.id === value)?.blocks
            .some(block => block.id === currentFilters.blockId);
          
          if (!blockBelongsToStage) {
            delete newFilters.blockId;
          }
        }
        
        onFilterChange(newFilters);
      }
    };
  
    const handleBlockChange = (value: string) => {
      if (value === "all") {
        const { blockId, ...restFilters } = { ...currentFilters };
        onFilterChange({
          ...restFilters,
          blockId: undefined
        });
      } else {
        onFilterChange({ ...currentFilters, blockId: value });
      }
    };
  
    const handleStatusChange = (value: string) => {
      if (value === "all") {
        const { status, ...restFilters } = { ...currentFilters };
         
        onFilterChange({
          ...restFilters,
          status: undefined
        });
      } else {
        onFilterChange({ ...currentFilters, status: value });
      }
    };
  
    const getAvailableBlocks = () => {
      if (!projectDetail) return [];
      
      let blocks: { id: string; name: string; stageName: string }[] = [];
      
      if (currentFilters.stageId) {
        const selectedStage = projectDetail.stages.find(
          stage => stage.id === currentFilters.stageId
        );
        
        if (selectedStage) {
          selectedStage.blocks.forEach(block => {
            blocks.push({
              id: block.id,
              name: block.name,
              stageName: selectedStage.name
            });
          });
        }
      } else {
        projectDetail.stages.forEach(stage => {
          stage.blocks.forEach(block => {
            blocks.push({
              id: block.id,
              name: block.name,
              stageName: stage.name
            });
          });
        });
      }
      
      return blocks.sort((a, b) => 
        a.stageName.localeCompare(b.stageName) || a.name.localeCompare(b.name)
      );
    };
  
    if (isLoading) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <form onSubmit={handleSearchSubmit} className="space-y-1.5">
                <Label htmlFor="search">Buscar Lote</Label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Buscar..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </form>
            </div>
  
            <div className="space-y-1.5">
              <Label htmlFor="stage-filter">Etapa</Label>
              <Select
                value={(currentFilters.stageId as string) || "all"}
                onValueChange={handleStageChange}
              >
                <SelectTrigger id="stage-filter">
                  <SelectValue placeholder="Todas las etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  {projectDetail?.stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            <div className="space-y-1.5">
              <Label htmlFor="block-filter">Manzana</Label>
              <Select
                value={(currentFilters.blockId as string) || "all"}
                onValueChange={handleBlockChange}
              >
                <SelectTrigger id="block-filter">
                  <SelectValue placeholder="Todas las manzanas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las manzanas</SelectItem>
                  {getAvailableBlocks().map(block => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.stageName} - {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            <div className="space-y-1.5">
              <Label htmlFor="status-filter">Estado</Label>
              <Select
                value={(currentFilters.status as string) || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value={LotStatus.ACTIVE}>Activo</SelectItem>
                  <SelectItem value={LotStatus.INACTIVE}>Inactivo</SelectItem>
                  <SelectItem value={LotStatus.RESERVED}>Separado</SelectItem>
                  <SelectItem value={LotStatus.SOLD}>Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
  
          {(currentFilters.search  as string|| 
          currentFilters.stageId  as string|| 
          currentFilters.blockId  as string|| 
          currentFilters.status  as string) && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="text-xs"
            >
              <FilterX className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
    );
  }