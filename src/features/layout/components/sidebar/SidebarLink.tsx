import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Circle, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MenuItem } from '../../types/menu.types';
import { ICON_MAPPING } from '../../constants/menu.constants';

type Props = {
  item: MenuItem;
  isCollapsed: boolean;
  isNested?: boolean;
};

const SidebarLink = ({ item, isCollapsed, isNested = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const Icon = ICON_MAPPING[item.icon as keyof typeof ICON_MAPPING] || Home;

  const isActive = item.url && pathname === item.url;
  const isChildActive = item.children?.some((child) => child.url && pathname === child.url);

  const getActiveStyles = () => {
    if (isActive) {
      return {
        backgroundColor: 'var(--nav-item-selected)',
        color: 'var(--nav-item-selected-foreground)',
        borderLeft: '3px solid var(--nav-item-active)',
      };
    }
    if (isChildActive && !isNested) {
      return {
        backgroundColor: 'var(--nav-item-hover)',
        color: 'var(--nav-item-active)',
      };
    }
    return {};
  };

  const LinkContent = () => (
    <div className={cn('flex items-center gap-3', isCollapsed && 'w-full justify-center')}>
      {isNested ? (
        <Circle
          size={6}
          className="fill-current transition-colors duration-200"
          style={{
            color: isActive ? 'var(--nav-item-selected-foreground)' : 'var(--nav-item-foreground)',
          }}
        />
      ) : (
        <Icon
          size={20}
          className="transition-colors duration-200"
          style={{
            color:
              isActive || isChildActive
                ? 'var(--nav-item-selected-foreground)'
                : 'var(--nav-item-foreground)',
          }}
        />
      )}
      {!isCollapsed && (
        <span
          className={cn(
            'font-medium whitespace-nowrap transition-colors duration-200',
            isNested ? 'text-sm' : 'text-base'
          )}
          style={{
            color: isActive
              ? 'var(--nav-item-selected-foreground)'
              : isChildActive && !isNested
                ? 'var(--nav-item-active)'
                : 'var(--nav-item-foreground)',
          }}
        >
          {item.name}
        </span>
      )}
    </div>
  );

  const TriggerContent = () => (
    <div
      className={cn(
        'flex w-full items-center',
        !isCollapsed && 'justify-between',
        isCollapsed && 'justify-center'
      )}
    >
      <LinkContent />
      {!isCollapsed && (
        <motion.div
          animate={{ rotate: isOpen || isChildActive ? 180 : 0 }}
          transition={{ duration: 0.3, type: 'spring', damping: 20 }}
          className="ml-2 flex-shrink-0"
          style={{
            color:
              isActive || isChildActive || isOpen
                ? 'var(--nav-item-active)'
                : 'var(--nav-item-foreground)',
          }}
        >
          <ChevronDown size={16} />
        </motion.div>
      )}
    </div>
  );

  if (item.children?.length > 0) {
    return (
      <Collapsible open={isOpen || isChildActive} onOpenChange={setIsOpen} className="w-full">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <div className="w-full">
                <CollapsibleTrigger asChild>
                  <motion.div
                    className="relative w-full cursor-pointer p-3 transition-all"
                    style={{
                      ...getActiveStyles(),
                    }}
                    whileHover={{
                      backgroundColor: 'var(--nav-item-hover)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <TriggerContent />
                      </div>
                    </TooltipTrigger>
                  </motion.div>
                </CollapsibleTrigger>
                <TooltipContent
                  side="right"
                  className="bg-layout-sidebar border-sidebar-border shadow-lg"
                >
                  <div className="space-y-2">
                    <p className="text-layout-sidebar-foreground font-medium">{item.name}</p>
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: 'var(--sidebar-border)' }}
                    />
                    <div className="text-layout-sidebar-foreground text-xs opacity-70">
                      {item.children?.length} elemento
                      {item.children?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <CollapsibleTrigger asChild>
            <motion.button
              className="group relative flex w-full p-3 transition-all"
              style={getActiveStyles()}
              whileHover={{
                backgroundColor: 'var(--nav-item-hover)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <TriggerContent />
            </motion.button>
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <AnimatePresence>
            {(isOpen || isChildActive) && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.3 },
                  height: { duration: 0.4 },
                  y: { duration: 0.3 },
                }}
                className={cn(
                  'relative overflow-hidden',
                  !isCollapsed && 'ml-6',
                  isCollapsed && 'border-l'
                )}
                style={isCollapsed ? { borderLeftColor: 'var(--sidebar-separator)' } : {}}
              >
                <div className="space-y-1 py-2">
                  {item.children.map((child, index) => {
                    const isLastChild = index === item.children.length - 1;
                    return (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.25,
                          ease: 'easeOut',
                        }}
                        className="relative"
                      >
                        {/* Conexión horizontal desde la línea vertical */}
                        {!isCollapsed && (
                          <>
                            {/* Línea vertical por hijo (no último) para evitar línea extra bajo el último */}
                            {!isLastChild && (
                              <div
                                className="absolute top-0 bottom-0 left-0 w-0.5 bg-current"
                                style={{
                                  color: isChildActive
                                    ? 'var(--nav-item-active)'
                                    : 'var(--sidebar-border)',
                                }}
                              />
                            )}
                            {/* Línea horizontal normal o esquina para el último */}
                            <div
                              className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-current"
                              style={{
                                width: isLastChild ? '20px' : '12px',
                                color:
                                  child.url && pathname === child.url
                                    ? 'var(--nav-item-active)'
                                    : 'var(--sidebar-border)',
                              }}
                            />

                            {/* Esquina para el último hijo */}
                            {isLastChild && (
                              <div
                                className="absolute top-0 left-0 w-0.5 bg-current"
                                style={{
                                  height: '50%',
                                  color: item.children.some((c) => c.url && pathname === c.url)
                                    ? 'var(--nav-item-active)'
                                    : 'var(--sidebar-border)',
                                }}
                              />
                            )}
                          </>
                        )}

                        <div className="ml-3">
                          <SidebarLink item={child} isCollapsed={isCollapsed} isNested={true} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const linkClassName = cn(
    'flex w-full relative transition-all group',
    isCollapsed ? 'justify-center p-3' : 'items-center gap-3 p-3',
    isNested && isCollapsed && 'p-2'
  );

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-full">{children}</div>
  );

  const MainContent = () => (
    <LinkWrapper>
      {item.url ? (
        <Link
          href={item.url}
          className={cn(linkClassName, 'hover:bg-[var(--nav-item-hover)]')}
          style={{
            ...getActiveStyles(),
          }}
        >
          <LinkContent />
        </Link>
      ) : (
        <motion.div
          className={linkClassName}
          style={getActiveStyles()}
          whileHover={{
            backgroundColor: 'var(--nav-item-hover)',
          }}
        >
          <LinkContent />
        </motion.div>
      )}
    </LinkWrapper>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <MainContent />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-layout-sidebar border-sidebar-border text-layout-sidebar-foreground shadow-lg"
        >
          <div className="space-y-1">
            <p className="font-medium">{item.name}</p>
            {isNested && <p className="text-xs opacity-70">• Elemento del submenú</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <MainContent />
  );
};

export default SidebarLink;
