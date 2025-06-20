import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import SidebarLink from './SidebarLink';
import { cn } from '@/lib/utils';
type Props = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile?: boolean;
};
const SidebarContent = ({ isCollapsed, setIsCollapsed, isMobile = false }: Props) => {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user) return null;
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 256
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
      className="sticky top-0 flex h-screen flex-col border-r border-none bg-[#2b2c2f] text-[#a5abaf] shadow-none"
    >
      <div
        className={cn(
          'flex items-center border-b border-[#3c3c40] p-3',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto'
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-clip-text text-xl font-bold whitespace-nowrap"
        >
          SMART
        </motion.span>
        {!isMobile && (
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-sm p-2 transition-colors hover:bg-[#37383b]"
          >
            <span className="rotate-45 text-[#bfc1c4]">
              <svg
                className={cn(isCollapsed ? 'rotate-180' : 'rotate-0')}
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2" />
                  <path d="M7.25 10L5.5 12l1.75 2m2.25 7V3" />
                </g>
              </svg>
            </span>
          </motion.button>
        )}
      </div>
      <div className={cn('border-b border-[#3c3c40]', isCollapsed ? 'py-4' : 'p-4')}>
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div className="flex aspect-square w-10 items-center justify-center rounded-full bg-green-500">
                    {user.photo ? (
                      <Image
                        width={40}
                        height={40}
                        src={user.photo}
                        alt={user.fullName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-primary-foreground" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={28}
                  className="bg-popover text-popover-foreground flex flex-col gap-1"
                >
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-muted-foreground text-xs">{user.role.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <motion.div className="flex aspect-square w-10 items-center justify-center rounded-full bg-green-500">
              {user.photo ? (
                <Image
                  width={40}
                  height={40}
                  src={user.photo}
                  alt={user.fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-primary-foreground" />
              )}
            </motion.div>
          )}
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden"
          >
            <span className="truncate text-sm font-medium">{user.fullName}</span>
            <span className="text-muted-foreground truncate text-xs">{user.role.name}</span>
          </motion.div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 text-sm">
        <motion.div className="space-y-2" transition={{ staggerChildren: 0.05 }}>
          {user.views.map((item) => (
            <SidebarLink key={item.id} item={item} isCollapsed={isCollapsed} />
          ))}
        </motion.div>
      </nav>
      <motion.div className="space-y-2 border-t border-[#3c3c40] p-4">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-3 rounded-sm p-2 transition-colors hover:bg-[#37383b]"
                >
                  <LogOut size={20} color="#bfc1c4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground">
                <p>Cerrar Sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-sm p-2 text-sm transition-colors hover:bg-[#37383b]"
          >
            <LogOut size={20} color="#bfc1c4" />
            <span>Cerrar Sesión</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
export default SidebarContent;
