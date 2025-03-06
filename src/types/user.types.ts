export interface Profile {
  user: User;
  accessToken: string;
  refreshToken: string;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  document: string;
  photo: null;
  role: Role;
  views: View[];
}
export interface Role {
  id: number;
  code: string;
  name: string;
}
export interface View {
  id: number;
  code: string;
  name: string;
  icon: string;
  url: null | string;
  order: number;
  metadata: null;
  children: View[];
}
export interface UserList {
  id: string;
  email: string;
  document: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
}
export interface GetUsersParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
}
export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface PaginatedUsers {
  items: UserList[];
  meta: PaginatedMeta;
}
export interface CreateUserDto {
  email: string;
  password: string;
  document: string;
  firstName: string;
  lastName: string;
  photo?: string;
  roleId: number;
  isActive?: boolean;
}
export interface UpdateUserDto
  extends Omit<Partial<CreateUserDto>, "document"> {
  password?: string;
}
