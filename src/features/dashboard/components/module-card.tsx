"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ICON_MAPPING } from "@/features/layout/constants/menu.constants";
import type { MenuItem } from "@/features/layout/types/menu.types";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";

interface ModuleCardProps {
  module: MenuItem;
  parentName?: string;
  colorIndex: number;
  index: number;
}

// Colores para diferenciar secciones (adaptados a la paleta marrón)
const sectionColors = [
  { border: "border-primary/20", bg: "bg-primary/5", icon: "bg-primary/10", hover: "group-hover:border-primary/40 group-hover:bg-primary/10" },
  { border: "border-accent/20", bg: "bg-accent/5", icon: "bg-accent/10", hover: "group-hover:border-accent/40 group-hover:bg-accent/10" },
  { border: "border-chart-4/20", bg: "bg-chart-4/5", icon: "bg-chart-4/10", hover: "group-hover:border-chart-4/40 group-hover:bg-chart-4/10" },
  { border: "border-chart-2/20", bg: "bg-chart-2/5", icon: "bg-chart-2/10", hover: "group-hover:border-chart-2/40 group-hover:bg-chart-2/10" },
  { border: "border-chart-5/20", bg: "bg-chart-5/5", icon: "bg-chart-5/10", hover: "group-hover:border-chart-5/40 group-hover:bg-chart-5/10" },
  { border: "border-chart-3/20", bg: "bg-chart-3/5", icon: "bg-chart-3/10", hover: "group-hover:border-chart-3/40 group-hover:bg-chart-3/10" },
];

export function ModuleCard({ module, parentName, colorIndex, index }: ModuleCardProps) {
  const Icon = ICON_MAPPING[module.icon as keyof typeof ICON_MAPPING] || Home;
  const targetUrl = module.url;

  // Si no hay URL, no renderizar
  if (!targetUrl) {
    return null;
  }

  const colorScheme = sectionColors[colorIndex % sectionColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={targetUrl} className="block h-full">
        <Card
          className={`h-full ${colorScheme.border} ${colorScheme.bg} ${colorScheme.hover} transition-all duration-300 hover:shadow-lg group cursor-pointer overflow-hidden`}
        >
          <CardContent className="p-6 h-full flex flex-col">
            {/* Etiqueta del padre */}
            <div className="mb-4">
              <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                {parentName || "Principal"}
              </span>
            </div>

            {/* Icono y contenido */}
            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <motion.div
                  className={`inline-flex p-3 rounded-xl ${colorScheme.icon} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 text-primary" />
                </motion.div>
              </div>

              {/* Nombre del módulo */}
              <h3 className="text-base font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {module.name}
              </h3>

              {/* Indicador de acción */}
              <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <span className="font-medium">Acceder</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
