'use client';

import { useCallback, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { SaleDetailSectionId, SectionLayoutItem } from '../lib/sale-detail-sections';
import { getDefaultLayout, SALE_DETAIL_SECTIONS } from '../lib/sale-detail-sections';

function getStorageKey(userId: string, roleCode: string) {
  return `sale-detail-layout:${userId}:${roleCode}`;
}

function loadLayout(userId: string, roleCode: string): SectionLayoutItem[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(userId, roleCode));
    if (!raw) return null;
    return JSON.parse(raw) as SectionLayoutItem[];
  } catch {
    return null;
  }
}

function saveLayout(userId: string, roleCode: string, layout: SectionLayoutItem[]) {
  try {
    localStorage.setItem(getStorageKey(userId, roleCode), JSON.stringify(layout));
  } catch {
    // localStorage full or unavailable
  }
}

function migrateLayout(
  stored: SectionLayoutItem[],
  defaultLayout: SectionLayoutItem[]
): SectionLayoutItem[] {
  const validIds = new Set(defaultLayout.map((s) => s.id));

  // Keep only stored sections that still exist for this role
  const filtered = stored.filter((s) => validIds.has(s.id));

  // Find new sections not in stored layout
  const storedIds = new Set(filtered.map((s) => s.id));
  const missing = defaultLayout.filter((s) => !storedIds.has(s.id));

  // Append missing sections at the end
  return [...filtered, ...missing];
}

export function useSaleDetailLayout(userId: string, roleCode: string) {
  const defaultLayout = useMemo(() => getDefaultLayout(roleCode), [roleCode]);

  const [sections, setSections] = useState<SectionLayoutItem[]>(() => {
    const stored = loadLayout(userId, roleCode);
    if (!stored) return defaultLayout;
    return migrateLayout(stored, defaultLayout);
  });

  const sectionDefinitions = useMemo(() => {
    const map = new Map<SaleDetailSectionId, (typeof SALE_DETAIL_SECTIONS)[number]>();
    for (const def of SALE_DETAIL_SECTIONS) {
      map.set(def.id, def);
    }
    return map;
  }, []);

  const persist = useCallback(
    (layout: SectionLayoutItem[]) => {
      setSections(layout);
      saveLayout(userId, roleCode, layout);
    },
    [userId, roleCode]
  );

  const reorderSections = useCallback(
    (activeId: string, overId: string) => {
      setSections((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === activeId);
        const newIndex = prev.findIndex((s) => s.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const next = arrayMove(prev, oldIndex, newIndex);
        saveLayout(userId, roleCode, next);
        return next;
      });
    },
    [userId, roleCode]
  );

  const toggleVisibility = useCallback(
    (sectionId: SaleDetailSectionId) => {
      setSections((prev) => {
        const next = prev.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s));
        saveLayout(userId, roleCode, next);
        return next;
      });
    },
    [userId, roleCode]
  );

  const resetToDefault = useCallback(() => {
    persist(defaultLayout);
  }, [defaultLayout, persist]);

  const isCustomized = useMemo(() => {
    if (sections.length !== defaultLayout.length) return true;
    return sections.some(
      (s, i) => s.id !== defaultLayout[i].id || s.visible !== defaultLayout[i].visible
    );
  }, [sections, defaultLayout]);

  return {
    sections,
    sectionDefinitions,
    reorderSections,
    toggleVisibility,
    resetToDefault,
    isCustomized,
  };
}
