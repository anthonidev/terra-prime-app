'use client';

import { motion } from 'framer-motion';
import ThemeSwitch from '@components/common/ThemeSwich';
import { Separator } from '@/components/ui/separator';
import { Menu } from 'lucide-react';
import useSidebar from '@/hooks/sidebar/useSidebar';

const Navbar = () => {
  const formatDate = () => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date());
  };

  const { toggleSidebar } = useSidebar();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border bg-layout-topbar text-layout-topbar-foreground flex w-full items-center justify-between border-b p-3 px-6 shadow-sm lg:relative"
    >
      <motion.button
        onClick={toggleSidebar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="sticky top-2.5 left-4 z-40 p-2 lg:hidden"
      >
        <Menu size={20} />
      </motion.button>
      <div className="invisible items-center space-x-4 lg:visible">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground flex items-center gap-2 py-1 text-sm font-medium capitalize"
        >
          <span>
            <svg width="1.5em" height="1.5em" viewBox="0 0 48 48">
              <path fill="#CFD8DC" d="M5 38V14h38v24c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4" />
              <path fill="#F44336" d="M43 10v6H5v-6c0-2.2 1.8-4 4-4h30c2.2 0 4 1.8 4 4" />
              <g fill="#B71C1C">
                <circle cx="33" cy="10" r="3" />
                <circle cx="15" cy="10" r="3" />
              </g>
              <path
                fill="#B0BEC5"
                d="M33 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2M15 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2"
              />
              <path
                fill="#90A4AE"
                d="M13 20h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4z"
              />
            </svg>
          </span>
          {formatDate()}
        </motion.div>
      </div>
      <div className="flex items-center gap-4">
        {/* <NotificationIcon /> */}
        <Separator orientation="vertical" className="bg-border h-6" />
        <ThemeSwitch />
      </div>
    </motion.nav>
  );
};
export default Navbar;
