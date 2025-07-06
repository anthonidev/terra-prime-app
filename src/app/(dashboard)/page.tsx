'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ChevronRight,
  ExternalLink,
  Folder,
  FolderOpen,
  Calendar,
  BarChart3,
  Settings,
  LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface View {
  id: number;
  code: string;
  name: string;
  icon: string;
  url: string | null;
  order: number;
  children: View[];
}

const DynamicIcon = ({
  iconName,
  className = 'w-6 h-6'
}: {
  iconName: string;
  className?: string;
}) => {
  if (iconName.startsWith('http') || iconName.startsWith('/')) {
    return (
      <Image
        src={iconName}
        alt="Vista"
        className={`${className} object-contain`}
        width={32}
        height={32}
        unoptimized
      />
    );
  }

  if (iconName.length <= 4) {
    return (
      <span className={`${className} flex items-center justify-center text-lg`}>{iconName}</span>
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white`}
    >
      {iconName.charAt(0).toUpperCase()}
    </div>
  );
};

// Componente para una vista individual
const ViewCard = ({ view, level = 0 }: { view: View; level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = view.children && view.children.length > 0;
  const hasUrl = view.url !== null;

  const cardContent = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 dark:from-blue-900/20 dark:to-indigo-900/20">
            <DynamicIcon iconName={view.icon} className="h-8 w-8" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
            {view.name}
          </h3>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{view.code}</p>
          <div className="mt-2 flex items-center gap-2">
            {hasChildren && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {view.children.length} submódulo{view.children.length !== 1 ? 's' : ''}
              </span>
            )}
            {hasUrl && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Acceso directo
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <FolderOpen className="h-5 w-5 text-gray-400" />
              ) : (
                <Folder className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}
          {hasUrl && (
            <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`${level > 0 ? 'ml-8' : ''}`}>
      {hasUrl ? (
        <Link href={view.url!} className="block">
          <div className="group cursor-pointer rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 dark:border-gray-700/60 dark:bg-gray-800/80 dark:hover:border-blue-600 dark:hover:bg-gray-800 dark:hover:shadow-blue-500/5">
            {cardContent}
          </div>
        </Link>
      ) : (
        <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/80">
          {cardContent}
        </div>
      )}

      {/* Renderizar hijos si están expandidos */}
      {hasChildren && isExpanded && (
        <div className="mt-4 space-y-3 rounded-xl bg-gray-50/50 p-4 dark:bg-gray-900/30">
          {view.children
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <ViewCard key={child.id} view={child} level={level + 1} />
            ))}
        </div>
      )}
    </div>
  );
};

// Componente para estadísticas rápidas
const StatsCard = ({
  icon: Icon,
  label,
  value,
  color = 'blue'
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) => {
  const colorClasses: Record<'blue' | 'green' | 'purple' | 'orange', string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/80">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl bg-gradient-to-br ${colorClasses[color]} p-3 text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center p-6">
        <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Settings className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Acceso requerido</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Debes iniciar sesión para ver tus vistas disponibles
          </p>
        </div>
      </div>
    );
  }

  const mainViews = user.views
    .filter((view: View) => view.url !== null || view.children.length > 0)
    .sort((a: View, b: View) => a.order - b.order);

  const totalSubviews = mainViews.reduce((acc, view) => acc + view.children.length, 0);
  const viewsWithUrl = mainViews.filter((view) => view.url !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
        {/* Header mejorado */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <span className="text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                Bienvenido, {user.name || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={BarChart3}
            label="Vistas totales"
            value={mainViews.length}
            color="blue"
          />
          <StatsCard
            icon={ExternalLink}
            label="Accesos directos"
            value={viewsWithUrl}
            color="green"
          />
          <StatsCard icon={Folder} label="Submódulos" value={totalSubviews} color="purple" />
          <StatsCard icon={Calendar} label="Última actualización" value="Hoy" color="orange" />
        </div>

        {/* Sección principal */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Tus vistas disponibles
            </h2>
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {mainViews.length} vista{mainViews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {mainViews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {mainViews.map((view: View) => (
                <ViewCard key={view.id} view={view} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-12 text-center shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500">
                  <Folder className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  No hay vistas disponibles
                </h3>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                  No tienes vistas asignadas en este momento.
                </p>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  Contacta con tu administrador para obtener acceso.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con información adicional */}
        <div className="mt-8 rounded-2xl border border-gray-200/60 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/50">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sistema de gestión de vistas
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Versión 2.0 - Actualizado recientemente
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
