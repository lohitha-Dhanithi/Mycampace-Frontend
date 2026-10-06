// src/types/platform.ts

export interface ProductItem {
  id: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
  category: string;
  status: 'active' | 'beta' | 'coming_soon' | 'inactive';
  isInstalled?: boolean;
  version?: string;
}

export interface WorkspacePlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
}

export interface PlatformNavItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  badge?: string;
  roles?: string[];
  children?: PlatformNavItem[];
}
