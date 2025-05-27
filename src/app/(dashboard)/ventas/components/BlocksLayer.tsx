'use client';

import { Button } from '@/components/ui/button';
import { ProyectBlocksItems } from '@/types/sales';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import { useProyectBlocks } from '../hooks/useProyectBlocks';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';
import * as React from 'react';
import { Input } from '@/components/ui/input';

interface Props {
  stageId: string;
  onPushClick: (stage: ProyectBlocksItems) => void;
  onBack: () => void;
}

export default function BlocksLayer({ stageId, onPushClick, onBack }: Props) {
  const [searchData, setSearchData] = React.useState<string>('');
  const { blocks, isLoading } = useProyectBlocks(stageId);

  const filteredData = React.useMemo(() => {
    return blocks.filter((block) => block.name.toLowerCase().includes(searchData.toLowerCase()));
  }, [blocks, searchData]);

  return (
    <div>
      <div className="inline-flex h-auto w-full items-center justify-between pb-4">
        <Button variant="outline" onClick={onBack} className="bg-white dark:bg-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-white pl-10 text-sm dark:bg-gray-900"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {isLoading ? (
          <ProjectsSkeleton header={false} padding={false} />
        ) : (
          <div className="grid grid-cols-1 gap-6 rounded-lg sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((block) => (
              <Card
                key={block.id}
                onClick={() => onPushClick(block)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden py-0 transition-colors duration-200 hover:border-green-200 hover:shadow-md hover:shadow-green-200 hover:transition-colors hover:duration-700 dark:hover:border-green-800 dark:hover:duration-200"
              >
                <CardHeader className="bg-gradient-to-r from-[#025864]/10 to-[#00CA7C]/10 bg-[length:200%_100%] bg-left py-4 transition-all duration-200 ease-in-out group-hover:bg-right">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary line-clamp-1 text-lg transition-colors">
                      Manzana - <span className="">{block.name}</span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <div className="flex items-center gap-3">
                    {
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        Lorem ipsum dolor amet sit undescribe lorem amet pir pa
                      </p>
                    }
                  </div>
                </CardContent>
                <CardFooter className="mt-auto border-t py-4">
                  <div className="text-muted-foreground flex items-center text-xs">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    <span>{new Date(block.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
