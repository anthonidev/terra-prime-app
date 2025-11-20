'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ICON_MAPPING } from '@/features/layout/constants/menu.constants';
import type { MenuItem } from '@/features/layout/types/menu.types';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  module: MenuItem;
  parentName?: string;
  colorIndex: number;
  index: number;
}

// Colores para el borde superior y el icono
const sectionColors = ['primary', 'accent', 'chart-4', 'chart-2', 'chart-5', 'chart-3'];

export function ModuleCard({ module, parentName, colorIndex, index }: ModuleCardProps) {
  const Icon = ICON_MAPPING[module.icon as keyof typeof ICON_MAPPING] || Home;
  const targetUrl = module.url;

  if (!targetUrl) {
    return null;
  }

  const colorName = sectionColors[colorIndex % sectionColors.length];
  const borderColorClass = `border-t-${colorName}`;
  const iconColorClass = `text-${colorName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={targetUrl} className="group block h-full">
        <Card
          className={`bg-card hover:bg-muted/50 h-full border-t-4 ${borderColorClass} flex cursor-pointer flex-col transition-all duration-300 hover:shadow-lg`}
        >
          <CardContent className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex items-center gap-4">
              <div className="flex-shrink-0">
                <Icon className={`h-8 w-8 ${iconColorClass} transition-colors`} />
              </div>
              <h3 className="text-foreground line-clamp-2 flex-1 text-base font-semibold">
                {module.name}
              </h3>
            </div>

            <div className="mt-auto">
              <span className="text-muted-foreground/80 text-xs font-medium tracking-wider uppercase">
                {parentName || 'Principal'}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
