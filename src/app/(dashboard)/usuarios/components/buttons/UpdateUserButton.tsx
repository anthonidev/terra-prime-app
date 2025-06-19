'use client';

import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import UpdateUserModal from '../modal/UpdateUserModal';
import { Role, UserList } from '@domain/entities/user';

interface Props {
  user: UserList;
  roles: Role[];
}

export default function UpdateUserButton({ roles, user }: Props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </Button>

      <UpdateUserModal roles={roles} user={user} isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}
