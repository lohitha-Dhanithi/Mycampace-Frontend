// src/types/users.ts

export type UserStatus = 'Active' | 'Inactive' | 'Invited' | 'Suspended';

export interface UserRoleItem {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  isSystem?: boolean;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
}
