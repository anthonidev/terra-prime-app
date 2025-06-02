'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateUserModal from '../modal/CreateUserModal';
import { Role } from '@/types/user';

interface Props {
  roles: Role[];
}

export default function CreateUserButton({ roles }: Props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex w-full items-center gap-2 px-4">
        <Plus className="h-4 w-4" />
        <span className="text-sm">Nuevo Usuario</span>
      </Button>

      <CreateUserModal roles={roles} isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}
