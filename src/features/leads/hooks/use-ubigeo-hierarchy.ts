'use client';

import { useMemo } from 'react';
import type { UbigeoItem } from '../types';

interface UbigeoHierarchy {
  department: UbigeoItem;
  province: UbigeoItem;
  district: UbigeoItem;
}

export function useUbigeoHierarchy(ubigeos: UbigeoItem[] | undefined) {
  const getDepartments = useMemo(() => {
    if (!ubigeos) return [];
    return ubigeos.filter((u) => u.parentId === null);
  }, [ubigeos]);

  const getProvinces = (departmentId: number) => {
    if (!ubigeos) return [];
    const department = ubigeos.find((u) => u.id === departmentId);
    return department?.children || [];
  };

  const getDistricts = (provinceId: number) => {
    if (!ubigeos) return [];

    const findProvinceAndGetChildren = (items: UbigeoItem[]): UbigeoItem[] => {
      for (const item of items) {
        if (item.id === provinceId) {
          return item.children || [];
        }
        if (item.children) {
          const found = findProvinceAndGetChildren(item.children);
          if (found.length > 0) {
            return found;
          }
        }
      }
      return [];
    };

    return findProvinceAndGetChildren(ubigeos);
  };

  const findHierarchyFromDistrict = (districtId: number): UbigeoHierarchy | null => {
    if (!ubigeos) return null;

    for (const dept of ubigeos.filter((u) => u.parentId === null)) {
      if (dept.children) {
        for (const prov of dept.children) {
          if (prov.children) {
            const dist = prov.children.find((d) => d.id === districtId);
            if (dist) {
              return {
                department: dept,
                province: prov,
                district: dist,
              };
            }
          }
        }
      }
    }
    return null;
  };

  return {
    departments: getDepartments,
    getProvinces,
    getDistricts,
    findHierarchyFromDistrict,
  };
}
