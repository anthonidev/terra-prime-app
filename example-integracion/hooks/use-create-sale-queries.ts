// ============================================================
// HOOKS: Queries para el flujo de creacion de venta
// ============================================================
// Hooks de React Query para obtener datos necesarios durante
// el formulario multi-paso de creacion de venta.
// ============================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getActiveProjects,
  getProjectStages,
  getStageBlocks,
  getBlockLots,
  getClientByDocument,
} from '../lib/queries';

// ---- Paso 1: Proyectos activos ----

export function useActiveProjects() {
  return useQuery({
    queryKey: ['active-projects'],
    queryFn: getActiveProjects,
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Paso 1: Etapas del proyecto ----

export function useProjectStages(projectId: string) {
  return useQuery({
    queryKey: ['project-stages', projectId],
    queryFn: () => getProjectStages(projectId),
    enabled: !!projectId, // Solo ejecutar cuando se selecciona un proyecto
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Paso 1: Bloques de la etapa ----

export function useStageBlocks(stageId: string) {
  return useQuery({
    queryKey: ['stage-blocks', stageId],
    queryFn: () => getStageBlocks(stageId),
    enabled: !!stageId,
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Paso 1: Lotes del bloque ----

export function useBlockLots(blockId: string) {
  return useQuery({
    queryKey: ['sales', 'project-lots', blockId],
    queryFn: () => getBlockLots(blockId),
    enabled: !!blockId,
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Paso 4: Buscar cliente por documento ----

export function useClientByDocument(document: string) {
  return useQuery({
    queryKey: ['sales', 'client-by-document', document],
    queryFn: () => getClientByDocument(document),
    enabled: !!document && document.length >= 8, // Solo buscar con 8+ caracteres
    staleTime: 10 * 60 * 1000,
  });
}

// ---- EJEMPLO DE USO EN PASO 1 ----
//
// function Step1LotSelection() {
//   const [projectId, setProjectId] = useState('');
//   const [stageId, setStageId] = useState('');
//   const [blockId, setBlockId] = useState('');
//
//   const { data: projects } = useActiveProjects();
//   const { data: stages } = useProjectStages(projectId);   // se ejecuta al seleccionar proyecto
//   const { data: blocks } = useStageBlocks(stageId);        // se ejecuta al seleccionar etapa
//   const { data: lots } = useBlockLots(blockId);             // se ejecuta al seleccionar bloque
//
//   return (
//     <div>
//       <Select onChange={(e) => { setProjectId(e.target.value); setStageId(''); setBlockId(''); }}>
//         {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//       </Select>
//
//       <Select onChange={(e) => { setStageId(e.target.value); setBlockId(''); }}>
//         {stages?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//       </Select>
//
//       <Select onChange={(e) => setBlockId(e.target.value)}>
//         {blocks?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//       </Select>
//
//       <div>
//         {lots?.map(lot => (
//           <div key={lot.id}>
//             {lot.name} - {lot.area}m2 - {lot.totalPrice} {lot.projectCurrency}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
