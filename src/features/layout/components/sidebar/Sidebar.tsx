"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AnimatePresence } from "framer-motion";
import { forwardRef, useImperativeHandle, useState } from "react";
import { SidebarContent } from "./SidebarContent";
import { useMenu } from "../../hooks/use-menu";

export interface SidebarRef {
  toggleMobile: () => void;
}

const Sidebar = forwardRef<SidebarRef>((props, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data, isLoading, isError } = useMenu();

  useImperativeHandle(ref, () => ({
    toggleMobile: () => setIsMobileOpen(!isMobileOpen),
  }));

  if (isLoading) {
    return (
      <div className="hidden lg:block w-64 h-dvh bg-gray-900 border-r border-gray-800">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-800 rounded"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="hidden lg:block w-64 h-dvh bg-gray-900 border-r border-gray-800">
        <div className="p-4 text-red-500">
          Error al cargar el menú
        </div>
      </div>
    );
  }

  const menuItems = data?.views || [];

  return (
    <>
      <AnimatePresence>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <SidebarContent
              isCollapsed={false}
              setIsCollapsed={() => { }}
              isMobile={true}
              menuItems={menuItems}
            />
          </SheetContent>
        </Sheet>
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={false}
          menuItems={menuItems}
        />
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
