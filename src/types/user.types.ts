export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}
