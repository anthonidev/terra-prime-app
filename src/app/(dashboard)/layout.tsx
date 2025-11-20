'use client';

import Navbar from '@/features/layout/components/NavbarDashboard';
import Sidebar, { SidebarRef } from '@/features/layout/components/sidebar/Sidebar';
import React, { useRef } from 'react';

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<SidebarRef>(null);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar ref={sidebarRef} />
      <div className="flex min-h-dvh flex-1 flex-col">
        <div className="sticky top-0 z-50">
          <Navbar onMenuToggle={() => sidebarRef.current?.toggleMobile()} />
        </div>
        <main className="bg-background flex-1 overflow-y-auto px-5 py-3">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
