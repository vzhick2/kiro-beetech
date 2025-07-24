export interface Supplier {
  id: string
  name: string
  website?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  status: "active" | "inactive"
  createdAt: Date
}

export interface NewSupplier {
  name: string
  website: string
  email: string
  phone: string
  status: "active" | "inactive"
}

export interface EditingRow {
  rowId: string
  data: Partial<Supplier>
}

export interface ValidationError {
  field: string
  message: string
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface EditingCell {
  rowId: string
  columnId: string
  value: string
}