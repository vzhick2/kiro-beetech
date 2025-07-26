import { CleanSupplier } from './types';
import { Database } from '@/types/database.generated';

type SupplierRow = Database['public']['Tables']['suppliers']['Row'];

// Transform database row to clean supplier interface
export const transformSupplier = (supplier: SupplierRow): CleanSupplier => {
  const clean: CleanSupplier = {
    id: supplier.supplierid,
    name: supplier.name,
    isArchived: supplier.isarchived || false,
    createdAt: new Date(supplier.created_at || Date.now())
  };
  
  if (supplier.website) clean.website = supplier.website;
  if (supplier.contactphone) clean.phone = supplier.contactphone;
  if (supplier.notes) clean.notes = supplier.notes;
  
  return clean;
};
