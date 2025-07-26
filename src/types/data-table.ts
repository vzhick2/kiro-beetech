import { Supplier as BaseSupplier } from './index';

// Use the unified Supplier type from index.ts
export type Supplier = BaseSupplier;

// Display helper type for table components that need transformed data
export interface DisplaySupplier {
  id: string; // transformed from supplierid
  name: string;
  website?: string;
  email?: string;
  phone?: string; // transformed from contactphone
  address?: string;
  notes?: string;
  status: 'active' | 'archived'; // transformed from isarchived
  createdAt: Date; // transformed from created_at
}

export interface EditingRow {
  rowId: string;
  data: Partial<DisplaySupplier>;
}

export interface NewSupplier {
  name: string;
  website: string;
  email: string;
  contactphone: string; // matches Supabase schema
  isarchived: boolean; // matches Supabase schema
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface EditingCell {
  rowId: string;
  columnId: string;
  value: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
