'use client';
import { AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet';
import SidebarContent from './SidebarContent';
import useSidebar from '@hooks/sidebar/useSidebar';

const Sidebar = () => {
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapse } = useSidebar();

  return (
    <>
      <AnimatePresence>
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetContent side="left" className="w-64 border-r-0 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <SidebarContent isCollapsed={false} setIsCollapsed={() => {}} isMobile={true} />
          </SheetContent>
        </Sheet>
      </AnimatePresence>
      <div className="hidden lg:block">
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapse}
          isMobile={false}
        />
      </div>
    </>
  );
};
export default Sidebar;
