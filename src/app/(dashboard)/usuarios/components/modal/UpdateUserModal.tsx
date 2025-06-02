import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Role, UserList } from '@/types/user';
import { User } from 'lucide-react';
import UpdateUserForm from '../forms/UpdateUserForm';

interface Props {
  roles: Role[];
  user: UserList;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateUserModal({ roles, user, isOpen, onClose }: Props) {
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
            Editar Usuario
          </DialogTitle>
        </DialogHeader>
        <UpdateUserForm user={user} roleOptions={roleOptions} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
