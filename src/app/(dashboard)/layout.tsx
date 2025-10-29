"use client";

import Navbar from "@/features/layout/components/NavbarDashboard";
import Sidebar, {
  SidebarRef,
} from "@/features/layout/components/sidebar/Sidebar";
import React, { useRef } from "react";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarRef = useRef<SidebarRef>(null);

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar ref={sidebarRef} />
      <div className="flex-1 flex flex-col min-h-dvh">
        <div className="sticky top-0 z-50">
          <Navbar onMenuToggle={() => sidebarRef.current?.toggleMobile()} />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
