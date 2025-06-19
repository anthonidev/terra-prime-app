import { User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateUserForm from '../forms/CreateUserForm';
import { Role } from '@domain/entities/user';

interface Props {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserButton({ roles, isOpen, onClose }: Props) {
  const roleOptions = roles.map((role: Role) => ({
    value: role.id.toString(),
    label: role.name
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-w-2xl min-w-xs flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5" />
            Nuevo Usuario
          </DialogTitle>
        </DialogHeader>
        <CreateUserForm roleOptions={roleOptions} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
