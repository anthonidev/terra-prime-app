'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveLeadSources, getUbigeos } from '../lib/queries';
import { getActiveProjects } from '@/features/sales/lib/queries';

export function useActiveLeadSources() {
  return useQuery({
    queryKey: ['active-lead-sources'],
    queryFn: getActiveLeadSources,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUbigeos() {
  return useQuery({
    queryKey: ['ubigeos'],
    queryFn: getUbigeos,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useActiveProjectsForLead() {
  return useQuery({
    queryKey: ['active-projects-for-lead'],
    queryFn: getActiveProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
