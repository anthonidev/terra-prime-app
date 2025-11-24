import ThemeSwitch from '@/components/ui/ThemeSwich';
import React from 'react';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <main className="animate-fade flex min-h-screen flex-col">
      <div className="bg-alternative flex flex-1 flex-col">
        <div className="flex flex-1">
          <aside className="from-primary to-primary/80 relative z-10 hidden flex-1 shrink basis-1/4 flex-col items-center justify-center overflow-hidden bg-linear-to-br xl:flex">
            <div className="absolute inset-0 opacity-20"></div>

            <div className="relative z-10 px-8 text-center">
              <div className="mb-8">
                <h1 className="mb-4 text-7xl font-black tracking-tight text-white drop-shadow-lg lg:text-8xl">
                  SMART
                </h1>

                <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-white/30"></div>
              </div>

              <div className="space-y-3 text-white/90">
                <div className="flex items-center justify-start text-left">
                  <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    S
                  </span>
                  <span className="text-lg font-medium">
                    <strong className="font-bold">S</strong>istema de
                  </span>
                </div>

                <div className="flex items-center justify-start text-left">
                  <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    M
                  </span>
                  <span className="text-lg font-medium">
                    <strong className="font-bold">M</strong>anejo y
                  </span>
                </div>

                <div className="flex items-center justify-start text-left">
                  <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    A
                  </span>
                  <span className="text-lg font-medium">
                    <strong className="font-bold">A</strong>dministración de
                  </span>
                </div>

                <div className="flex items-center justify-start text-left">
                  <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    R
                  </span>
                  <span className="text-lg font-medium">
                    <strong className="font-bold">R</strong>ecursos y
                  </span>
                </div>

                <div className="flex items-center justify-start text-left">
                  <span className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                    T
                  </span>
                  <span className="text-lg font-medium">
                    <strong className="font-bold">T</strong>ransacciones
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-10 h-20 w-20 rounded-full bg-white/5 blur-xl"></div>
            <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
          </aside>

          <div className="flex flex-1 flex-shrink-0 flex-col items-center pt-4">
            <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
              {children}
            </div>
            <div className="z-10 mx-auto my-8">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
