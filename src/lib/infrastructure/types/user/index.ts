import { UserList } from '@domain/entities/user';
import { Meta } from '@infrastructure/types/pagination.types';

export interface UsersResponse {
  items: UserList[];
  meta: Meta;
}
