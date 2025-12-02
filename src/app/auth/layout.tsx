import ThemeSwitch from '@/components/ui/ThemeSwich';
import Image from 'next/image';
import React from 'react';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <main className="animate-fade flex min-h-screen flex-col">
      <div className="bg-muted flex flex-1 flex-col dark:bg-black">
        <div className="flex flex-1">
          <div className="flex flex-1 flex-col items-center pt-4">
            <div className="mt-5 mb-5">
              <Image
                src="/imgs/logo.png"
                alt="Logo"
                width={150}
                height={50}
                className="h-auto w-auto"
                priority
              />
            </div>
            <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
              {children}
            </div>
            <div className="z-10 mx-auto my-8">
              <ThemeSwitch />
            </div>
          </div>

          <aside className="hidden flex-1 shrink basis-1/4 flex-col items-center justify-center bg-white p-6 xl:flex dark:bg-zinc-900">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl">
              <Image
                src="/imgs/banner_login.webp"
                alt="Login Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="from-primary/90 to-primary/50 absolute inset-0 bg-linear-to-br backdrop-blur-[2px]" />

              <div className="relative z-10 px-8 text-center">
                <div className="mb-8">
                  <h1 className="mb-4 text-7xl font-black tracking-tight text-white drop-shadow-2xl lg:text-8xl">
                    SMART
                  </h1>

                  <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-white/40 shadow-lg"></div>
                </div>

                <div className="space-y-4 text-white">
                  <div className="flex items-center justify-start text-left drop-shadow-md">
                    <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl font-bold text-white shadow-inner backdrop-blur-sm">
                      S
                    </span>
                    <span className="text-xl font-medium tracking-wide">
                      <strong className="font-bold">S</strong>istema de
                    </span>
                  </div>

                  <div className="flex items-center justify-start text-left drop-shadow-md">
                    <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl font-bold text-white shadow-inner backdrop-blur-sm">
                      M
                    </span>
                    <span className="text-xl font-medium tracking-wide">
                      <strong className="font-bold">M</strong>anejo y
                    </span>
                  </div>

                  <div className="flex items-center justify-start text-left drop-shadow-md">
                    <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl font-bold text-white shadow-inner backdrop-blur-sm">
                      A
                    </span>
                    <span className="text-xl font-medium tracking-wide">
                      <strong className="font-bold">A</strong>dministración de
                    </span>
                  </div>

                  <div className="flex items-center justify-start text-left drop-shadow-md">
                    <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl font-bold text-white shadow-inner backdrop-blur-sm">
                      R
                    </span>
                    <span className="text-xl font-medium tracking-wide">
                      <strong className="font-bold">R</strong>ecursos y
                    </span>
                  </div>

                  <div className="flex items-center justify-start text-left drop-shadow-md">
                    <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl font-bold text-white shadow-inner backdrop-blur-sm">
                      T
                    </span>
                    <span className="text-xl font-medium tracking-wide">
                      <strong className="font-bold">T</strong>ransacciones
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
