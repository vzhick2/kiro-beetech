// Supabase suppliers API for TESTSUPPLIERS page
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type Supplier = Database['public']['Tables']['suppliers']['Row'];

/**
 * Fetch suppliers from Supabase, optionally including archived (inactive) ones.
 * @param opts.includeArchived - if true, include archived suppliers
 */
export async function getSuppliers(opts: { includeArchived: boolean }): Promise<Supplier[]> {
  const query = supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });
  if (!opts.includeArchived) {
    query.eq('isarchived', false);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
