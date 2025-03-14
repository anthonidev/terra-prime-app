import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LotStatus, ProjectDetailDto } from "@/types/project.types";
import {
  Activity,
  Building2,
  Filter,
  FilterX,
  Layers,
  Search,
  Tag,
  X,
  ChevronDown,
  ArrowDownUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  isLoading,
}: ProjectLotFiltersProps) {
  const [searchValue, setSearchValue] = useState<string>(
    (currentFilters.search as string) || "",
  );
  const [isOpen, setIsOpen] = useState(true);
  const getStatsFromProject = () => {
    if (!projectDetail) return { stages: 0, blocks: 0, lots: 0 };
    let totalLots = 0;
    projectDetail.stages.forEach((stage) => {
      stage.blocks.forEach((block) => {
        totalLots += block.lotCount;
      });
    });
    return {
      stages: projectDetail.stages.length,
      blocks: projectDetail.stages.reduce(
        (acc, stage) => acc + stage.blocks.length,
        0,
      ),
      lots: totalLots,
    };
  };
  const stats = getStatsFromProject();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...currentFilters, search: searchValue || undefined });
  };
  const handleStageChange = (value: string) => {
    if (value === "all") {
      onFilterChange({
        ...currentFilters,
        stageId: undefined,
        blockId: undefined,
      });
    } else {
      const newFilters: Record<string, unknown> = {
        ...currentFilters,
        stageId: value,
      };
      if (currentFilters.blockId) {
        const blockBelongsToStage = projectDetail?.stages
          .find((stage) => stage.id === value)
          ?.blocks.some((block) => block.id === currentFilters.blockId);
        if (!blockBelongsToStage) {
          delete newFilters.blockId;
        }
      }
      onFilterChange(newFilters);
    }
  };
  const handleBlockChange = (value: string) => {
    if (value === "all") {
      onFilterChange({
        ...currentFilters,
        blockId: undefined,
      });
    } else {
      onFilterChange({ ...currentFilters, blockId: value });
    }
  };
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      onFilterChange({
        ...currentFilters,
        status: undefined,
      });
    } else {
      onFilterChange({ ...currentFilters, status: value });
    }
  };
  const getAvailableBlocks = () => {
    if (!projectDetail) return [];
    const blocks: { id: string; name: string; stageName: string }[] = [];
    if (currentFilters.stageId) {
      const selectedStage = projectDetail.stages.find(
        (stage) => stage.id === currentFilters.stageId,
      );
      if (selectedStage) {
        selectedStage.blocks.forEach((block) => {
          blocks.push({
            id: block.id,
            name: block.name,
            stageName: selectedStage.name,
          });
        });
      }
    } else {
      projectDetail.stages.forEach((stage) => {
        stage.blocks.forEach((block) => {
          blocks.push({
            id: block.id,
            name: block.name,
            stageName: stage.name,
          });
        });
      });
    }
    return blocks.sort(
      (a, b) =>
        a.stageName.localeCompare(b.stageName) || a.name.localeCompare(b.name),
    );
  };
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/60 shadow-sm overflow-hidden">
        {}
        <motion.div
          className="px-3 py-2 flex justify-between items-center border-b"
          layout
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Filter className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="font-medium text-sm flex items-center gap-1.5">
              Filtros de lotes
              {hasActiveFilters && (
                <Badge
                  variant="outline"
                  className="ml-1 px-1.5 py-0 h-5 text-xs bg-primary/10 text-primary"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onReset}
                      className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <FilterX className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limpiar todos los filtros</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-7 w-7 p-0">
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </motion.div>
        <CollapsibleContent>
          {}
          {hasActiveFilters && (
            <div className="px-3 py-1.5 border-b bg-muted/20 flex flex-wrap gap-1.5">
              {(currentFilters.search as string) && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-primary/5 border-primary/20 pl-2 h-6"
                >
                  <Search className="h-3 w-3 text-primary/70" />
                  <span className="text-xs">
                    {`"${currentFilters.search as string}"`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 hover:bg-primary/20 rounded-full"
                    onClick={() =>
                      onFilterChange({ ...currentFilters, search: undefined })
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {(currentFilters.stageId as string) && projectDetail?.stages && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-primary/5 border-primary/20 pl-2 h-6"
                >
                  <Building2 className="h-3 w-3 text-primary/70" />
                  <span className="text-xs">
                    {projectDetail.stages.find(
                      (s) => s.id === currentFilters.stageId,
                    )?.name || "Etapa"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 hover:bg-primary/20 rounded-full"
                    onClick={() => handleStageChange("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {(currentFilters.blockId as string) && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-primary/5 border-primary/20 pl-2 h-6"
                >
                  <Layers className="h-3 w-3 text-primary/70" />
                  <span className="text-xs">
                    {getAvailableBlocks().find(
                      (b) => b.id === currentFilters.blockId,
                    )?.name || "Manzana"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 hover:bg-primary/20 rounded-full"
                    onClick={() => handleBlockChange("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {(currentFilters.status as string) && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-primary/5 border-primary/20 pl-2 h-6"
                >
                  <Activity className="h-3 w-3 text-primary/70" />
                  <span className="text-xs">
                    {currentFilters.status as string}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 hover:bg-primary/20 rounded-full"
                    onClick={() => handleStatusChange("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <div className="flex-1"></div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="text-xs h-6 px-2 hover:text-destructive hover:bg-destructive/5"
                >
                  Limpiar todos
                </Button>
              </div>
            </div>
          )}
          {}
          <CardContent className="py-2 px-3">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="search"
                    className="text-xs font-medium text-muted-foreground mb-0.5 flex items-center gap-1"
                  >
                    <Search className="h-3 w-3" />
                    <span>Buscar lote</span>
                  </Label>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    id="search"
                    placeholder="Nombre, etapa, manzana..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-7 h-8 text-xs"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <button type="submit" className="sr-only">
                    Buscar
                  </button>
                </form>
              </div>
              {}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="stage-filter"
                    className="text-xs font-medium text-muted-foreground mb-0.5 flex items-center gap-1"
                  >
                    <Building2 className="h-3 w-3" />
                    <span>Etapa</span>
                  </Label>
                </div>
                <Select
                  value={(currentFilters.stageId as string) || "all"}
                  onValueChange={handleStageChange}
                >
                  <SelectTrigger
                    id="stage-filter"
                    className={`h-8 text-xs ${currentFilters.stageId ? "border-primary text-primary" : ""}`}
                  >
                    <SelectValue placeholder="Todas las etapas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las etapas</SelectItem>
                    {projectDetail?.stages.map((stage) => (
                      <SelectItem
                        key={stage.id}
                        value={stage.id}
                        className="text-xs"
                      >
                        {stage.name} (
                        {stage.blocks.reduce(
                          (acc, block) => acc + block.lotCount,
                          0,
                        )}{" "}
                        lotes)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="block-filter"
                    className="text-xs font-medium text-muted-foreground mb-0.5 flex items-center gap-1"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Manzana</span>
                  </Label>
                </div>
                <Select
                  value={(currentFilters.blockId as string) || "all"}
                  onValueChange={handleBlockChange}
                  disabled={getAvailableBlocks().length === 0}
                >
                  <SelectTrigger
                    id="block-filter"
                    className={`h-8 text-xs ${currentFilters.blockId ? "border-primary text-primary" : ""}`}
                  >
                    <SelectValue placeholder="Todas las manzanas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      Todas las manzanas
                    </SelectItem>
                    {getAvailableBlocks().map((block) => (
                      <SelectItem
                        key={block.id}
                        value={block.id}
                        className="text-xs"
                      >
                        {block.stageName} - {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="status-filter"
                    className="text-xs font-medium text-muted-foreground mb-0.5 flex items-center gap-1"
                  >
                    <Activity className="h-3 w-3" />
                    <span>Estado</span>
                  </Label>
                </div>
                <Select
                  value={(currentFilters.status as string) || "all"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    id="status-filter"
                    className={`h-8 text-xs ${currentFilters.status ? "border-primary text-primary" : ""}`}
                  >
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className="text-xs flex items-center gap-1.5"
                    >
                      <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
                      <span>Todos los estados</span>
                    </SelectItem>
                    <SelectItem
                      value={LotStatus.ACTIVE}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Activo</span>
                    </SelectItem>
                    <SelectItem
                      value={LotStatus.INACTIVE}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      <span>Inactivo</span>
                    </SelectItem>
                    <SelectItem
                      value={LotStatus.RESERVED}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>Separado</span>
                    </SelectItem>
                    <SelectItem
                      value={LotStatus.SOLD}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                      <span>Vendido</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            {}
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{stats.stages} etapas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{stats.blocks} manzanas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{stats.lots} lotes</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-xs h-7 py-0 px-2.5"
              >
                <FilterX className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
