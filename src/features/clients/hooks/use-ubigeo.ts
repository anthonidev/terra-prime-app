import { useQuery } from '@tanstack/react-query';
import { getDepartments, getProvinces, getDistricts } from '../lib/queries';

export function useDepartments() {
  return useQuery({
    queryKey: ['clients-departments'],
    queryFn: getDepartments,
    staleTime: Infinity,
  });
}

export function useProvinces(departmentId?: number) {
  return useQuery({
    queryKey: ['clients-provinces', departmentId],
    queryFn: () => getProvinces(departmentId!),
    enabled: !!departmentId,
    staleTime: Infinity,
  });
}

export function useDistricts(provinceId?: number) {
  return useQuery({
    queryKey: ['clients-districts', provinceId],
    queryFn: () => getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: Infinity,
  });
}
