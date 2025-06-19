export interface CreateUserDTO {
  email: string;
  password: string;
  document: string;
  firstName: string;
  lastName: string;
  photo?: string;
  roleId: number;
  isActive?: string;
}

export interface UpdateUserDTO extends Omit<Partial<CreateUserDTO>, 'document'> {
  password?: string;
}
