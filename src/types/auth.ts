// src/types/auth.ts

export type RoleType = 'super_admin' | 'admin' | 'faculty' | 'student' | 'parent' | 'staff';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RoleType | string;
  avatar?: string;
  tenantId?: string;
  institutionId?: string;
  permissions?: string[];
  authProvider?: 'email' | 'google' | 'sso';
  token?: string;
  platformRole?: string;
  productRoles?: Record<string, string>;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  token: string;
  provider: string;
  expiresAt: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  loading: boolean;
}
