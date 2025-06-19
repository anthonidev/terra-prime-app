import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { Project } from '@domain/entities/lotes/project.entity';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { Block } from '@domain/entities/lotes/block.entity';
import { Lot } from '@domain/entities/lotes/lot.entity';

import {
  getProjectActives,
  getProyectBlocks,
  getProyectStages,
  getProyectLots
} from '@infrastructure/server-actions/lotes.actions';

type ProjectID = string;
type StageID = string;
type BlockID = string;
type LotID = string;

interface ProjectDataState {
  projects: Project[];
  stages: Stage[];
  blocks: Block[];
  lots: Lot[];
}

interface SelectedItems {
  project: Project | null;
  stage: Stage | null;
  block: Block | null;
  lot: Lot | null;
  currency: string | null;
}

interface LoadingState {
  projects: boolean;
  stages: boolean;
  blocks: boolean;
  lots: boolean;
}

interface UseProjectDataReturn {
  projects: Project[];
  stages: Stage[];
  blocks: Block[];
  lots: Lot[];
  selected: SelectedItems;
  loading: LoadingState;
  loadProjects: () => Promise<void>;
  loadStages: (projectId: ProjectID) => Promise<void>;
  loadBlocks: (stageId: StageID) => Promise<void>;
  loadLots: (blockId: BlockID) => Promise<void>;
  selectProject: (projectId: ProjectID) => void;
  selectStage: (stageId: StageID) => void;
  selectBlock: (blockId: BlockID) => void;
  selectLot: (lotId: LotID) => void;
}

export function useProjectData(): UseProjectDataReturn {
  const [data, setData] = useState<ProjectDataState>({
    projects: [],
    stages: [],
    blocks: [],
    lots: []
  });

  const [selected, setSelected] = useState<SelectedItems>({
    project: null,
    stage: null,
    block: null,
    lot: null,
    currency: null
  });

  const [loading, setLoading] = useState<LoadingState>({
    projects: false,
    stages: false,
    blocks: false,
    lots: false
  });

  const loadProjects = useCallback(async () => {
    setLoading((prev) => ({ ...prev, projects: true }));
    try {
      const projectsData = await getProjectActives();
      setData((prev) => ({ ...prev, projects: projectsData }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los proyectos';
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, []);

  const loadStages = useCallback(async (projectId: ProjectID) => {
    setLoading((prev) => ({ ...prev, stages: true }));
    try {
      const stagesData = await getProyectStages({ id: projectId });
      setData((prev) => ({
        ...prev,
        stages: stagesData,
        blocks: [],
        lots: []
      }));
      setSelected((prev) => ({
        ...prev,
        stage: null,
        block: null,
        lot: null
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las etapas';
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, stages: false }));
    }
  }, []);

  const loadBlocks = useCallback(async (stageId: StageID) => {
    setLoading((prev) => ({ ...prev, blocks: true }));
    try {
      const blocksData = await getProyectBlocks({ id: stageId });
      setData((prev) => ({
        ...prev,
        blocks: blocksData,
        lots: []
      }));
      setSelected((prev) => ({
        ...prev,
        block: null,
        lot: null
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las manzanas';
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, blocks: false }));
    }
  }, []);

  const loadLots = useCallback(async (blockId: BlockID) => {
    setLoading((prev) => ({ ...prev, lots: true }));
    try {
      const lotsData = await getProyectLots({ id: blockId });
      setData((prev) => ({ ...prev, lots: lotsData }));
      setSelected((prev) => ({ ...prev, lot: null }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los lotes';
      toast.error(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, lots: false }));
    }
  }, []);

  const selectProject = useCallback(
    (projectId: ProjectID) => {
      const project = data.projects.find((p) => p.id === projectId) || null;
      setSelected((prev) => ({
        ...prev,
        project,
        stage: null,
        block: null,
        lot: null,
        currency: project?.currency || null
      }));
    },
    [data.projects]
  );

  const selectStage = useCallback(
    (stageId: StageID) => {
      setSelected((prev) => ({
        ...prev,
        stage: data.stages.find((s) => s.id === stageId) || null,
        block: null,
        lot: null
      }));
    },
    [data.stages]
  );

  const selectBlock = useCallback(
    (blockId: BlockID) => {
      setSelected((prev) => ({
        ...prev,
        block: data.blocks.find((b) => b.id === blockId) || null,
        lot: null
      }));
    },
    [data.blocks]
  );

  const selectLot = useCallback(
    (lotId: LotID) => {
      setSelected((prev) => ({
        ...prev,
        lot: data.lots.find((l) => l.id === lotId) || null
      }));
    },
    [data.lots]
  );

  return {
    ...data,
    selected,
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
