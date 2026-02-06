'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_META, QUICK_ACCESS_URLS } from '@/features/dashboard/lib/constants';
import { ICON_MAPPING } from '@/features/layout/constants/menu.constants';
import { useMenu } from '@/features/layout/hooks/use-menu';
import type { MenuItem } from '@/features/layout/types/menu.types';
import { useReducedMotion, motion } from 'framer-motion';
import { AlertCircle, Folder, Home, Zap } from 'lucide-react';
import { ModuleCard } from './module-card';

interface NavigableView {
  view: MenuItem;
  parentName?: string;
}

interface CategoryGroup {
  name: string;
  icon: string;
  items: NavigableView[];
}

function getAllNavigableViews(items: MenuItem[]): NavigableView[] {
  const result: NavigableView[] = [];

  items.forEach((parent) => {
    if (parent.url && parent.url !== '/' && (!parent.children || parent.children.length === 0)) {
      result.push({ view: parent, parentName: undefined });
    }

    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        if (child.url) {
          result.push({ view: child, parentName: parent.name });
        }
      });
    }
  });

  return result;
}

function groupMenuByCategory(items: MenuItem[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];

  items.forEach((parent) => {
    if (parent.url === '/') return;

    if (parent.children && parent.children.length > 0) {
      const children = parent.children.filter((c) => c.url);
      if (children.length > 0) {
        groups.push({
          name: parent.name,
          icon: parent.icon,
          items: children.map((child) => ({ view: child, parentName: parent.name })),
        });
      }
    }
  });

  const standalone = items.filter(
    (item) => item.url && item.url !== '/' && (!item.children || item.children.length === 0)
  );

  if (standalone.length > 0) {
    groups.push({
      name: 'Principal',
      icon: 'dashboard',
      items: standalone.map((item) => ({ view: item, parentName: undefined })),
    });
  }

  return groups;
}

function QuickAccessRow({ views, sectionDelay }: { views: NavigableView[]; sectionDelay: number }) {
  const prefersReducedMotion = useReducedMotion();

  if (views.length === 0) return null;

  return (
    <section aria-labelledby="quick-access-heading">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: sectionDelay, ease: 'easeOut' }}
        className="mb-3 flex items-center gap-2"
      >
        <Zap className="text-chart-4 h-4 w-4" aria-hidden="true" />
        <h2 id="quick-access-heading" className="text-sm font-semibold tracking-tight">
          Acceso rápido
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {views.map(({ view }, index) => (
          <ModuleCard
            key={view.url}
            module={view}
            index={index}
            variant="compact"
            sectionDelay={sectionDelay}
          />
        ))}
      </div>
    </section>
  );
}

function CategorySection({
  group,
  sectionIndex,
  sectionDelay,
}: {
  group: CategoryGroup;
  sectionIndex: number;
  sectionDelay: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const meta = CATEGORY_META[group.name];
  const Icon = ICON_MAPPING[group.icon as keyof typeof ICON_MAPPING] || Home;
  const headingId = `category-heading-${sectionIndex}`;

  return (
    <section aria-labelledby={headingId}>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: sectionDelay, ease: 'easeOut' }}
        className="mb-4 flex items-center gap-3"
      >
        <div className={meta?.colorClass}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id={headingId} className="text-base font-semibold tracking-tight">
            {group.name}
          </h2>
          {meta?.description && <p className="text-muted-foreground text-sm">{meta.description}</p>}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {group.items.map(({ view }, index) => (
          <ModuleCard key={view.url} module={view} index={index} sectionDelay={sectionDelay} />
        ))}
      </div>
    </section>
  );
}

function ModulesGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Quick access skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Category sections skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(3)].map((_, j) => (
              <Card key={j} className="bg-muted/20 h-[140px] overflow-hidden border-none">
                <CardContent className="p-4">
                  <div className="mb-4 flex justify-between">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModulesGrid() {
  const { data, isLoading, isError } = useMenu();

  const allModules = data?.views || [];
  const navigableViews = getAllNavigableViews(allModules);
  const groups = groupMenuByCategory(allModules);

  const quickAccessViews = QUICK_ACCESS_URLS.map((url) =>
    navigableViews.find((v) => v.view.url === url)
  ).filter((v): v is NavigableView => v !== undefined);

  const SECTION_GAP = 0.15;

  const sectionDelays = useMemo(() => {
    const delays: number[] = [];
    let acc = 0;

    if (quickAccessViews.length > 0) {
      delays.push(acc);
      acc += SECTION_GAP + quickAccessViews.length * 0.04;
    }

    groups.forEach((group) => {
      delays.push(acc);
      acc += SECTION_GAP + group.items.length * 0.05;
    });

    return delays;
  }, [quickAccessViews.length, groups]);

  if (isLoading) {
    return <ModulesGridSkeleton />;
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-8 text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-destructive text-lg font-semibold">Error al cargar los módulos</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            No se pudieron cargar los módulos disponibles. Por favor, intenta nuevamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (navigableViews.length === 0) {
    return (
      <Card className="bg-muted/10 border-dashed">
        <CardContent className="py-16 text-center">
          <div className="bg-muted/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Folder className="text-muted-foreground h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-xl font-medium">No hay vistas disponibles</h3>
          <p className="text-muted-foreground mx-auto mb-4 max-w-md">
            No tienes vistas asignadas en este momento.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Contacta con tu administrador para obtener acceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  const quickAccessDelay = quickAccessViews.length > 0 ? sectionDelays[0] : 0;
  const groupDelayOffset = quickAccessViews.length > 0 ? 1 : 0;

  return (
    <div className="space-y-8">
      {quickAccessViews.length > 0 && (
        <QuickAccessRow views={quickAccessViews} sectionDelay={quickAccessDelay} />
      )}

      {groups.map((group, sectionIndex) => (
        <CategorySection
          key={group.name}
          group={group}
          sectionIndex={sectionIndex}
          sectionDelay={sectionDelays[sectionIndex + groupDelayOffset] ?? 0}
        />
      ))}
    </div>
  );
}
