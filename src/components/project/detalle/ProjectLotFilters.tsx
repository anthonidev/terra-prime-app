import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LotStatus, ProjectDetailDto } from "@/types/project.types";
import { Activity, Building2, Filter, FilterX, Layers, Search } from "lucide-react";

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

  // Contar cuántos filtros activos hay
  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.search) count++;
    if (currentFilters.stageId) count++;
    if (currentFilters.blockId) count++;
    if (currentFilters.status) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const hasActiveFilters = activeFiltersCount > 0;

  if (isLoading) {
    return (
      <Card className="bg-card/60 shadow-sm">
        <div className="p-3 flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <CardContent className="pt-0 pb-3 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 shadow-sm">
      <div className="px-3 py-1 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Filtros de lotes</h3>
          {hasActiveFilters && (
            <Badge 
              variant="outline" 
              className="ml-1 px-1.5 py-0 h-5 text-xs bg-secondary/30 hover:bg-secondary/50"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
          >
            <FilterX className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      <CardContent className="py-1 px-3">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="search" className="text-xs font-medium text-muted-foreground mb-0.5">
                Buscar Lote
              </Label>
              {currentFilters.search as string && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0" 
                  onClick={() => onFilterChange({ ...currentFilters, search: undefined })}
                >
                  <FilterX className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                id="search"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <button type="submit" className="sr-only">Buscar</button>
            </form>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="stage-filter" className="text-xs font-medium text-muted-foreground mb-0.5">
                Etapa
              </Label>
              {currentFilters.stageId as string && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0" 
                  onClick={() => handleStageChange("all")}
                >
                  <FilterX className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Select
              value={(currentFilters.stageId as string) || "all"}
              onValueChange={handleStageChange}
            >
              <SelectTrigger id="stage-filter" className="h-8 text-sm">
                <div className="flex items-center">
                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <SelectValue placeholder="Todas las etapas" />
                </div>
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="block-filter" className="text-xs font-medium text-muted-foreground mb-0.5">
                Manzana
              </Label>
              {currentFilters.blockId as string && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0" 
                  onClick={() => handleBlockChange("all")}
                >
                  <FilterX className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Select
              value={(currentFilters.blockId as string) || "all"}
              onValueChange={handleBlockChange}
            >
              <SelectTrigger id="block-filter" className="h-8 text-sm">
                <div className="flex items-center">
                  <Layers className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <SelectValue placeholder="Todas las manzanas" />
                </div>
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="status-filter" className="text-xs font-medium text-muted-foreground mb-0.5">
                Estado
              </Label>
              {currentFilters.status as string && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0" 
                  onClick={() => handleStatusChange("all")}
                >
                  <FilterX className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Select
              value={(currentFilters.status as string) || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status-filter" className="h-8 text-sm">
                <div className="flex items-center">
                  <Activity className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <SelectValue placeholder="Todos los estados" />
                </div>
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
        </motion.div>
      </CardContent>
    </Card>
  );
}