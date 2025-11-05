"use client";

import { Separator } from "@/components/ui/separator";
import ThemeSwitch from "@/components/ui/ThemeSwich";
import { UserMenu } from "@/features/users/components/menus/user-menu";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-border bg-layout-topbar text-layout-topbar-foreground shadow-sm backdrop-blur-sm bg-opacity-95"
    >
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onMenuToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          <UserMenu />

          <ThemeSwitch />

          <Separator orientation="vertical" className="h-6 bg-border" />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
