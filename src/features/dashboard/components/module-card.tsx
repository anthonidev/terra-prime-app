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
  index: number;
}

export function ModuleCard({ module, parentName, index }: ModuleCardProps) {
  const Icon = ICON_MAPPING[module.icon as keyof typeof ICON_MAPPING] || Home;
  const targetUrl = module.url;

  if (!targetUrl) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="h-full"
    >
      <Link href={targetUrl} className="group block h-full">
        <Card className="bg-card hover:bg-card hover:border-primary/20 group relative h-full overflow-hidden border transition-all duration-300 hover:shadow-xl">
          <CardContent className="flex h-full flex-col p-4">
            {/* Header with Icon */}
            <div className="mb-4 flex items-start justify-between">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-2 transition-colors duration-300">
                <Icon className="h-8 w-8" />
              </div>
              <div className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col">
              <h3 className="text-foreground group-hover:text-primary mb-1 text-base font-bold tracking-tight transition-colors">
                {module.name}
              </h3>

              {/* Optional: Add description if available in the future */}
              {/* <p className="text-muted-foreground text-sm line-clamp-2">
                Description placeholder...
              </p> */}

              <div className="mt-auto pt-2">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary/50 text-muted-foreground group-hover:bg-secondary group-hover:text-foreground inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-colors">
                    {parentName || 'Principal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Gradient */}
            <div className="from-primary/5 via-primary/0 to-primary/0 absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
