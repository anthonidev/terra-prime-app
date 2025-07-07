'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronRight, Folder, Settings } from 'lucide-react';
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
      <span
        className={`${className} flex items-center justify-center text-lg text-slate-600 dark:text-slate-400`}
      >
        {iconName}
      </span>
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-md bg-slate-100 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300`}
    >
      {iconName.charAt(0).toUpperCase()}
    </div>
  );
};

// Colores para diferenciar secciones
const sectionColors = [
  'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
  'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
  'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
  'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30',
  'border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-950/30',
  'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30'
];

// Componente para submódulos con colores por sección
const ChildViewCard = ({ view, colorClass }: { view: View; colorClass: string }) => {
  const hasUrl = view.url !== null;

  const cardContent = (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="mb-3">
        <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
          <DynamicIcon iconName={view.icon} className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{view.name}</h3>
      </div>

      {hasUrl && (
        <div className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ChevronRight className="mx-auto h-3 w-3 text-slate-400" />
        </div>
      )}
    </div>
  );

  return hasUrl ? (
    <Link href={view.url!} className="block">
      <div
        className={`group cursor-pointer rounded-lg border ${colorClass} h-full transition-all hover:shadow-sm`}
      >
        {cardContent}
      </div>
    </Link>
  ) : (
    <div className={`rounded-lg border ${colorClass} h-full`}>{cardContent}</div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Acceso requerido
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Debes iniciar sesión para ver tus vistas disponibles
          </p>
        </div>
      </div>
    );
  }

  const mainViews = user.views
    .filter((view: View) => view.url !== null || view.children.length > 0)
    .sort((a: View, b: View) => a.order - b.order);

  // Obtener TODAS las vistas navegables (principales sin hijos + todos los submódulos)
  const allNavigableViews: Array<{ view: View; parentName?: string; colorIndex: number }> = [];

  mainViews.forEach((parent, index) => {
    // Si la vista padre tiene URL y NO tiene hijos, la incluimos
    if (parent.url && (!parent.children || parent.children.length === 0)) {
      allNavigableViews.push({
        view: parent,
        parentName: undefined, // No tiene padre
        colorIndex: index % sectionColors.length
      });
    }

    // Incluir todos los submódulos
    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        allNavigableViews.push({
          view: child,
          parentName: parent.name,
          colorIndex: index % sectionColors.length
        });
      });
    }
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950" style={{ minHeight: 'calc(100vh - 110px)' }}>
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header minimalista */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Bienvenido, {user.name || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Sección principal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
              Vistas disponibles
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {allNavigableViews.length} vista{allNavigableViews.length !== 1 ? 's' : ''}
            </span>
          </div>

          {allNavigableViews.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {allNavigableViews.map(({ view, parentName, colorIndex }) => (
                <div key={view.id} className="relative">
                  <div className="mb-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {parentName ? parentName : 'Vista principal'}
                  </div>

                  <ChildViewCard view={view} colorClass={sectionColors[colorIndex]} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Folder className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-slate-100">
                No hay vistas disponibles
              </h3>
              <p className="mb-1 text-slate-600 dark:text-slate-400">
                No tienes vistas asignadas en este momento.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Contacta con tu administrador para obtener acceso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
