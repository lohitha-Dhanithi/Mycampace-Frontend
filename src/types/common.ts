// src/types/common.ts

export type StatusVariant = 'active' | 'inactive' | 'pending' | 'suspended' | 'archived' | 'draft';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index?: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}
