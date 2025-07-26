// Simplified types for clean implementation
export interface CleanSupplier {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  isArchived: boolean;
  createdAt: Date;
}

export interface SupplierFilters {
  search: string;
  status: 'all' | 'active' | 'archived';
}

export interface SupplierSelection {
  selectedIds: Set<string>;
  lastSelectedIndex: number;
}

export enum ViewMode {
  VIEW = 'view',
  EDIT = 'edit',
  BULK = 'bulk'
}

export interface EditingState {
  mode: ViewMode;
  editingId: string | null;
  editingData: Partial<CleanSupplier>;
}
