import ThemeSwitch from '@/components/common/ThemeSwich';
import Image from 'next/image';
import React from 'react';
export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <main className="animate-fade flex min-h-screen flex-col">
      <div className="bg-alternative flex flex-1 flex-col">
        <div className="flex flex-1">
          <aside className="z-10 hidden flex-1 flex-shrink basis-1/4 flex-col items-center justify-center bg-cover bg-no-repeat xl:flex">
            <Image
              src="/nature_bg.jpeg"
              alt="Background image"
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
              loading="lazy"
            />
          </aside>
          <div className="flex flex-1 flex-shrink-0 flex-col items-center pt-4">
            <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
              {' '}
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
