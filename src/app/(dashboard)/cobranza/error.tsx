'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface ErrorProps {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <motion.div
      className="container py-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            staggerChildren: 0.1
          }
        }
      }}
    >
      <div className="mx-auto mb-6 flex w-full flex-col items-center justify-center rounded-md text-center">
        <div className="relative mx-auto max-w-2xl">
          <div className="relative z-10 flex items-center justify-center gap-8">
            <div className="-rotate-12 transform transition-transform duration-300 hover:rotate-0">
              <div className="relative rounded-lg border-2 border-blue-200 bg-blue-100 p-8 shadow-lg">
                <div className="absolute top-3 left-3 flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                </div>
                <div className="absolute top-0 right-0 h-6 w-6 border-b-2 border-l-2 border-blue-300 bg-blue-200"></div>
                <div className="mt-4 text-8xl font-bold text-gray-800">4</div>
              </div>
            </div>
            <div className="text-9xl font-bold text-black dark:text-slate-100">0</div>
            <div className="rotate-12 transform transition-transform duration-300 hover:rotate-0">
              <div className="relative rounded-lg border-2 border-yellow-300 bg-yellow-200 p-8 shadow-lg">
                <div className="absolute top-3 right-3 left-3 h-0.5 bg-yellow-400"></div>
                <div className="absolute top-0 right-0 h-6 w-6 border-b-2 border-l-2 border-yellow-400 bg-yellow-300"></div>
                <div className="mt-4 text-8xl font-bold text-gray-800">4</div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Ups!</h1>
            <p className="mx-auto max-w-md text-base text-gray-600 dark:text-slate-400">
              Parece que el recurso no se puede mostrar, por favor refrezca la pagina o intenta
              nuevamente.
            </p>
            <Button variant="outline" onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
