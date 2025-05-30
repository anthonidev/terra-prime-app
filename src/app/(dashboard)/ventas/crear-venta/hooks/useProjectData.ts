import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import {
  ProyectsActivesItems,
  ProyectStagesItems,
  ProyectBlocksItems,
  ProyectLotsItems
} from '@/types/sales';
import { getProyectBlocks, getProyectLots, getProyectsActives, getProyectStages } from '../action';

interface UseProjectDataReturn {
  projects: ProyectsActivesItems[];
  stages: ProyectStagesItems[];
  blocks: ProyectBlocksItems[];
  lots: ProyectLotsItems[];

  selectedProject: ProyectsActivesItems | null;
  selectedStage: ProyectStagesItems | null;
  selectedBlock: ProyectBlocksItems | null;
  selectedLot: ProyectLotsItems | null;

  loading: {
    projects: boolean;
    stages: boolean;
    blocks: boolean;
    lots: boolean;
  };

  loadProjects: () => Promise<void>;
  loadStages: (projectId: string) => Promise<void>;
  loadBlocks: (stageId: string) => Promise<void>;
  loadLots: (blockId: string) => Promise<void>;

  selectProject: (projectId: string) => void;
  selectStage: (stageId: string) => void;
  selectBlock: (blockId: string) => void;
  selectLot: (lotId: string) => void;
}

export function useProjectData(): UseProjectDataReturn {
  const [projects, setProjects] = useState<ProyectsActivesItems[]>([]);
  const [stages, setStages] = useState<ProyectStagesItems[]>([]);
  const [blocks, setBlocks] = useState<ProyectBlocksItems[]>([]);
  const [lots, setLots] = useState<ProyectLotsItems[]>([]);

  const [selectedProject, setSelectedProject] = useState<ProyectsActivesItems | null>(null);
  const [selectedStage, setSelectedStage] = useState<ProyectStagesItems | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ProyectBlocksItems | null>(null);
  const [selectedLot, setSelectedLot] = useState<ProyectLotsItems | null>(null);

  const [loading, setLoading] = useState({
    projects: false,
    stages: false,
    blocks: false,
    lots: false
  });

  const loadProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, projects: true }));
    try {
      const projectsData = await getProyectsActives();
      setProjects(projectsData);
    } catch (error) {
      toast.error('Error al cargar los proyectos');
      console.error('Error loading projects:', error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, []);

  const loadStages = useCallback(async (projectId: string) => {
    setLoading((prev) => ({ ...prev, stages: true }));
    setStages([]);
    setBlocks([]);
    setLots([]);
    setSelectedStage(null);
    setSelectedBlock(null);
    setSelectedLot(null);

    try {
      const stagesData = await getProyectStages({ id: projectId });
      setStages(stagesData);
    } catch (error) {
      toast.error('Error al cargar las etapas');
      console.error('Error loading stages:', error);
    } finally {
      setLoading((prev) => ({ ...prev, stages: false }));
    }
  }, []);

  const loadBlocks = useCallback(async (stageId: string) => {
    setLoading((prev) => ({ ...prev, blocks: true }));
    setBlocks([]);
    setLots([]);
    setSelectedBlock(null);
    setSelectedLot(null);

    try {
      const blocksData = await getProyectBlocks({ id: stageId });
      setBlocks(blocksData);
    } catch (error) {
      toast.error('Error al cargar las manzanas');
      console.error('Error loading blocks:', error);
    } finally {
      setLoading((prev) => ({ ...prev, blocks: false }));
    }
  }, []);

  const loadLots = useCallback(async (blockId: string) => {
    setLoading((prev) => ({ ...prev, lots: true }));
    setLots([]);
    setSelectedLot(null);

    try {
      const lotsData = await getProyectLots({ id: blockId });
      setLots(lotsData);
    } catch (error) {
      toast.error('Error al cargar los lotes');
      console.error('Error loading lots:', error);
    } finally {
      setLoading((prev) => ({ ...prev, lots: false }));
    }
  }, []);

  const selectProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      setSelectedProject(project || null);
    },
    [projects]
  );

  const selectStage = useCallback(
    (stageId: string) => {
      const stage = stages.find((s) => s.id === stageId);
      setSelectedStage(stage || null);
    },
    [stages]
  );

  const selectBlock = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId);
      setSelectedBlock(block || null);
    },
    [blocks]
  );

  const selectLot = useCallback(
    (lotId: string) => {
      const lot = lots.find((l) => l.id === lotId);
      setSelectedLot(lot || null);
    },
    [lots]
  );

  return {
    projects,
    stages,
    blocks,
    lots,

    selectedProject,
    selectedStage,
    selectedBlock,
    selectedLot,

    loading,

    loadProjects,
    loadStages,
    loadBlocks,
    loadLots,

    selectProject,
    selectStage,
    selectBlock,
    selectLot
  };
}
