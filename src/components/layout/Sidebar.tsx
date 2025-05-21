'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet';
import SidebarContent from './SidebarContent';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sticky top-2.5 left-4 z-40 p-2 lg:hidden"
            >
              <Menu size={20} />
            </motion.button>
          </SheetTrigger>
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
          setIsCollapsed={setIsCollapsed}
          isMobile={false}
        />
      </div>
    </>
  );
};
export default Sidebar;
