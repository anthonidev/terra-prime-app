export interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  document: string;
  photo: string | null;
  role: {
    id: number;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileUser;
}

export interface UpdateProfileInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: ProfileUser;
}

export interface UpdatePhotoResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    photo: string;
  };
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
