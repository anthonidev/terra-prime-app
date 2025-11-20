import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { MenuItem } from '../../types/menu.types';
import SidebarLink from './SidebarLink';

type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile?: boolean;
  menuItems: MenuItem[];
};

export const SidebarContent = ({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  menuItems = [],
}: Props) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className="bg-layout-sidebar text-layout-sidebar-foreground sticky top-0 flex h-dvh flex-col border-r"
      style={{
        borderRightColor: 'var(--sidebar-border)',
      }}
    >
      <div
        className="flex items-center justify-between border-b p-3"
        style={{
          borderBottomColor: 'var(--sidebar-border)',
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap"
        >
          <Image src="/imgs/logo.png" alt="Logo" width={150} height={40} className="h-10 w-auto" />
        </motion.div>

        {!isMobile && (
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: 'var(--nav-item-hover)',
              rotate: isCollapsed ? 5 : -5,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-xl p-2 shadow-sm transition-colors"
            style={{
              color: 'var(--nav-item-active)',
              border: '1px solid var(--sidebar-border)',
            }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3, type: 'spring', damping: 15 }}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </motion.div>
          </motion.button>
        )}
      </div>

      <div
        className="via-primary/5 border-b bg-gradient-to-r from-transparent to-transparent p-4"
        style={{
          borderBottomColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="flex aspect-square w-12 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, var(--nav-item-active), var(--chart-3))`,
                    }}
                  >
                    {user.photo ? (
                      <Image
                        src={user.photo}
                        alt="Foto de perfil"
                        width={64}
                        height={64}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={22} className="text-white" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-layout-sidebar border-sidebar-border shadow-lg"
                >
                  <div className="space-y-2">
                    <p className="text-layout-sidebar-foreground font-medium">{user.email}</p>
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: 'var(--sidebar-border)' }}
                    />
                    <p className="text-layout-sidebar-foreground text-xs opacity-70">
                      {user.role.name}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex aspect-square w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br shadow-lg"
              style={{
                background: `linear-gradient(135deg, var(--nav-item-active), var(--chart-3))`,
              }}
            >
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={22} className="text-white" />
              )}
            </motion.div>
          )}

          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col overflow-hidden"
          >
            <motion.span
              className="text-layout-sidebar-foreground truncate text-sm font-semibold"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {user.email}
            </motion.span>
            <motion.span
              className="bg-primary/10 mt-1 truncate rounded-full px-2 py-1 text-center text-xs"
              style={{ color: 'var(--nav-item-active)' }}
              whileHover={{ scale: 1.05 }}
            >
              {user.role.name}
            </motion.span>
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>

      <motion.div
        className="border-t p-4"
        style={{
          borderTopColor: 'var(--sidebar-border)',
        }}
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    rotate: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="hover:border-destructive/20 mx-2 flex w-full items-center justify-center gap-3 rounded-xl border border-transparent p-3 transition-colors"
                  style={{
                    color: 'var(--destructive)',
                  }}
                >
                  <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                    <LogOut size={20} />
                  </motion.div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-layout-sidebar border-sidebar-border shadow-lg"
              >
                <p className="text-layout-sidebar-foreground font-medium">Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            whileHover={{
              scale: 1.02,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              x: 2,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="group hover:border-destructive/20 mx-2 flex w-full items-center gap-3 rounded-xl border border-transparent p-3 transition-colors"
            style={{
              color: 'var(--destructive)',
            }}
          >
            <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
              <LogOut size={20} />
            </motion.div>
            <span className="font-medium">Cerrar Sesión</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
