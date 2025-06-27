'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Folder, FolderOpen } from 'lucide-react';
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
          <DynamicIcon iconName={view.icon} className="h-8 w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">{view.name}</h3>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{view.code}</p>
        </div>

        <div className="flex items-center gap-2">
          {hasUrl && <ExternalLink className="h-4 w-4 text-gray-400" />}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-gray-400" />
              ) : (
                <Folder className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
          {hasUrl && <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </div>
    </>
  );

  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      {hasUrl ? (
        <Link href={view.url!} className="block">
          <div className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600">
            {cardContent}
          </div>
        </Link>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          {cardContent}
        </div>
      )}

      {/* Renderizar hijos si están expandidos */}
      {hasChildren && isExpanded && (
        <div className="mt-3 space-y-3">
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

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Acceso requerido
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Debes iniciar sesión para ver tus vistas disponibles
          </p>
        </div>
      </div>
    );
  }

  const mainViews = user.views
    .filter((view: View) => view.url !== null || view.children.length > 0)
    .sort((a: View, b: View) => a.order - b.order);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Bienvenido, {user.name || user.email}. Aquí tienes acceso a tus vistas disponibles.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {mainViews.length} vista{mainViews.length !== 1 ? 's' : ''} disponible
          {mainViews.length !== 1 ? 's' : ''}
        </div>
      </div>

      {mainViews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainViews.map((view: View) => (
            <ViewCard key={view.id} view={view} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No hay vistas disponibles
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No tienes vistas asignadas en este momento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
