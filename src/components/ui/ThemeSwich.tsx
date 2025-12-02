'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-border bg-background flex h-10 w-[140px] items-center gap-2 rounded-lg border px-3 py-2" />
    );
  }

  const getThemeIcon = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'system':
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case 'dark':
        return 'Oscuro';
      case 'light':
        return 'Claro';
      case 'system':
      default:
        return 'Sistema';
    }
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Modo Claro',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: 'Modo Oscuro',
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: 'system',
      label: 'Modo Sistema',
      icon: <Monitor className="h-4 w-4" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-border bg-background hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200"
        >
          <motion.div
            initial={false}
            animate={{
              rotate: theme === 'dark' ? 360 : 0,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 0.3 },
              scale: { duration: 0.2 },
            }}
            className="text-foreground"
          >
            {getThemeIcon(theme)}
          </motion.div>
          <span className="text-foreground hidden sm:inline">{getThemeLabel(theme)}</span>
          <ChevronDown className="text-muted-foreground h-3 w-3" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <AnimatePresence>
          {themeOptions.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DropdownMenuItem
                onClick={() => setTheme(option.value)}
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="flex flex-1 items-center gap-2">
                  <motion.div
                    animate={{
                      scale: theme === option.value ? [1, 1.2, 1] : 1,
                      rotate: theme === option.value && option.value === 'dark' ? 360 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {option.icon}
                  </motion.div>
                  <span>{option.label}</span>
                </div>
                {theme === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Check className="text-primary h-4 w-4" />
                  </motion.div>
                )}
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
