'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ICON_MAPPING } from '@/features/layout/constants/menu.constants';
import type { MenuItem } from '@/features/layout/types/menu.types';
import { cn } from '@/shared/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  module: MenuItem;
  index: number;
  variant?: 'default' | 'compact';
  sectionDelay?: number;
}

export function ModuleCard({
  module,
  index,
  variant = 'default',
  sectionDelay = 0,
}: ModuleCardProps) {
  const Icon = ICON_MAPPING[module.icon as keyof typeof ICON_MAPPING] || Home;
  const prefersReducedMotion = useReducedMotion();
  const targetUrl = module.url;

  if (!targetUrl) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: sectionDelay + index * 0.04, ease: 'easeOut' }}
      >
        <Link href={targetUrl} className="group block">
          <Card className="bg-card hover:border-primary/20 border transition-[border-color,box-shadow] duration-300 hover:shadow-md">
            <CardContent className="flex items-center gap-3 px-4 py-3">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-1.5 transition-colors duration-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                {module.name}
              </span>
              <ArrowRight
                className="text-muted-foreground/30 group-hover:text-primary/50 ml-auto h-4 w-4 -translate-x-1 opacity-0 transition-[transform,opacity,color] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: sectionDelay + index * 0.05, ease: 'easeOut' }}
      className="h-full"
    >
      <Link href={targetUrl} className="group block h-full">
        <Card
          className={cn(
            'bg-card hover:bg-card hover:border-primary/20 group relative h-full overflow-hidden border',
            'transition-[border-color,box-shadow] duration-300 hover:shadow-xl'
          )}
        >
          <CardContent className="flex h-full flex-col p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-2 transition-colors duration-300">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <ArrowRight
                className="text-muted-foreground/30 group-hover:text-primary/50 h-5 w-5 -translate-x-2 opacity-0 transition-[transform,opacity,color] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h3 className="text-foreground group-hover:text-primary mb-1 text-base font-bold tracking-tight transition-colors">
                {module.name}
              </h3>
            </div>

            <div className="from-primary/5 via-primary/0 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
