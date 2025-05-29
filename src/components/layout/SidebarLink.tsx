import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/ui/collapsible';
import { cn } from '@/lib/utils';
import { View } from '@/types/user';
import {
  ChevronDown,
  FileText,
  Home,
  Map,
  Podcast,
  ShoppingCart,
  SquareUserRound,
  TableProperties,
  User,
  UserPlus,
  UserRoundCheck,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';

const ICON_MAPPING = {
  profile: User,
  project: FileText,
  lote: Map,
  user: Users,
  lead: Home,
  'g-lead': SquareUserRound,
  'lead-source': Podcast,
  'new-lead': UserPlus,
  sale: ShoppingCart,
  leads: TableProperties,
  liner: UserRoundCheck
};
type Props = {
  item: View;
  isCollapsed: boolean;
  isNested?: boolean;
};
const SidebarLink = ({ item, isCollapsed, isNested = false }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Icon = ICON_MAPPING[item.icon as keyof typeof ICON_MAPPING] || Home;
  const LinkContent = () => (
    <motion.div
      className={cn('flex items-center gap-3', isCollapsed && 'w-full justify-center')}
      initial={false}
      animate={{ x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={20} color="#bfc1c4" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden font-medium whitespace-nowrap"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.children?.length > 0) {
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
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>
    );
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <div className="w-full">
                <CollapsibleTrigger asChild>
                  <div className="w-full rounded p-2 transition-colors hover:bg-[#37383b]">
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <TriggerContent />
                      </div>
                    </TooltipTrigger>
                  </div>
                </CollapsibleTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={28}
                  className="flex flex-col gap-1 bg-[#cecfd2] text-[#1f1f21]"
                >
                  <p className="font-medium">{item.name}</p>
                  <div className="bg-border h-px w-full" />
                  <div className="text-foreground text-xs">Submenú disponible</div>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <CollapsibleTrigger className="flex w-full rounded p-2 transition-colors hover:bg-[#37383b]">
            <TriggerContent />
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'w-full',
                  !isCollapsed && 'pl-4',
                  isCollapsed && 'border-border border-l-2'
                )}
              >
                {item.children.map((child) => (
                  <SidebarLink
                    key={child.id}
                    item={child}
                    isCollapsed={isCollapsed}
                    isNested={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  const linkClassName = cn(
    'flex w-full p-2 rounded hover:bg-[#37383b] transition-colors',
    isCollapsed ? 'justify-center' : 'items-center gap-3',
    isNested && {
      'ml-4': !isCollapsed,
      '': isCollapsed
    }
  );
  const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div transition={{ duration: 0.2 }} className="w-full">
      {children}
    </motion.div>
  );
  const MainContent = () => (
    <LinkWrapper>
      {item.url ? (
        <Link href={item.url} className={linkClassName}>
          <LinkContent />
        </Link>
      ) : (
        <div className={linkClassName}>
          <LinkContent />
        </div>
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
          className="rounded-sm bg-[#cecfd2] px-3 text-[#1f1f21] shadow-md"
        >
          <p>{item.name}</p>
          {isNested && <p className="text-muted-foreground text-xs">Elemento del submenú</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <MainContent />
  );
};
export default SidebarLink;
