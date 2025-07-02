import { Button } from '@components/ui/button';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmptyProjectsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card flex flex-col items-center rounded-lg border px-4 py-16 text-center"
    >
      <div className="bg-primary/10 mb-4 rounded-full p-4">
        <MapPin className="text-primary/80 h-12 w-12" />
      </div>
      <h3 className="mb-2 text-xl font-medium">No hay proyectos disponibles</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Parece que aún no hay proyectos creados. Puedes crear uno nuevo haciendo clic en el botón
        inferior.
      </p>
      <Link href="/proyectos/nuevo">
        <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          Crear un proyecto
        </Button>
      </Link>
    </motion.div>
  );
}
