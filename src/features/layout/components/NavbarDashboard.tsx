'use client';

import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/ui/ThemeSwich';
import { UserMenu } from '@/features/users/components/menus/user-menu';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border bg-layout-topbar text-layout-topbar-foreground w-full border-b shadow-sm"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onMenuToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-primary/10 rounded-lg p-2 transition-colors lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          <UserMenu />

          <ThemeSwitch />

          <Separator orientation="vertical" className="bg-border h-6" />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
