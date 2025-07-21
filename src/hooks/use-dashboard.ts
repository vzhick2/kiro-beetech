import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Types for dashboard data
export interface CycleCountAlert {
  itemid: string;
  sku: string;
  name: string;
  currentquantity: number;
  reorderpoint: number | null;
  priorityscore: number;
  alerttype: 'NEGATIVE_INVENTORY' | 'LOW_STOCK' | 'OVERDUE_COUNT';
  shortageamount: number;
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  draftPurchases: number;
  recentTransactions: number;
}

export interface RecentActivity {
  id: string;
  type: 'purchase' | 'transaction' | 'batch' | 'sale';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  iconColor: string;
}

// Query keys for consistent caching
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  alerts: (limit: number) => [...dashboardKeys.all, 'alerts', limit] as const,
  activity: (limit: number) =>
    [...dashboardKeys.all, 'activity', limit] as const,
};

// Hook for fetching cycle count alerts
export function useCycleCountAlerts(limit: number = 5) {
  return useQuery({
    queryKey: dashboardKeys.alerts(limit),
    queryFn: async () => {
      // Use the standardized consolidated function (TODO: Update types after migration)
      const { data, error } = await supabase.rpc('get_cycle_count_alerts', {
        limit_count: limit,
      });

      if (error) {
        console.error('Error fetching cycle count alerts:', error);
        throw new Error(error.message);
      }

      return (data || []) as CycleCountAlert[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Hook for fetching dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      // Fetch multiple stats in parallel
      const [itemsResult, alertsResult, purchasesResult, transactionsResult] =
        await Promise.all([
          // Total active items
          supabase
            .from('items')
            .select('itemid', { count: 'exact' })
            .eq('isarchived', false),

          // Low stock items (alerts)
          supabase.rpc('get_cycle_count_alerts', { limit_count: 100 }),

          // Draft purchases count
          supabase
            .from('purchases')
            .select('purchaseid', { count: 'exact' })
            .eq('isdraft', true),

          // Recent transactions (last 7 days)
          supabase
            .from('transactions')
            .select('transactionid', { count: 'exact' })
            .gte(
              'created_at',
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            ),
        ]);

      if (itemsResult.error) {
        throw new Error(itemsResult.error.message);
      }
      if (purchasesResult.error) {
        throw new Error(purchasesResult.error.message);
      }
      if (transactionsResult.error) {
        throw new Error(transactionsResult.error.message);
      }

      const stats: DashboardStats = {
        totalItems: itemsResult.count || 0,
        lowStockItems: Array.isArray(alertsResult.data) ? alertsResult.data.length : 0,
        draftPurchases: purchasesResult.count || 0,
        recentTransactions: transactionsResult.count || 0,
      };

      return stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

// Hook for fetching recent activity
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.activity(limit),
    queryFn: async () => {
      // Fetch recent activities from multiple sources
      const [purchasesResult, transactionsResult] = await Promise.all([
        // Recent purchases (last 30 days)
        supabase
          .from('purchases')
          .select(
            `
            purchaseid,
            displayid,
            isdraft,
            purchasedate,
            total,
            created_at,
            suppliers(name)
          `
          )
          .gte(
            'created_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          )
          .order('created_at', { ascending: false })
          .limit(5),

        // Recent inventory transactions (last 7 days)
        supabase
          .from('transactions')
          .select(
            `
            transactionid,
            transactiontype,
            quantity,
            effectivedate,
            created_at,
            items(name, sku)
          `
          )
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          )
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (purchasesResult.error) {
        throw new Error(purchasesResult.error.message);
      }
      if (transactionsResult.error) {
        throw new Error(transactionsResult.error.message);
      }

      const activities: RecentActivity[] = [];

      // Process purchases
      (purchasesResult.data || []).forEach((purchase: any) => {
        activities.push({
          id: purchase.purchaseid,
          type: 'purchase',
          title: purchase.isdraft
            ? 'Draft purchase created'
            : 'Purchase completed',
          description: `${purchase.displayid}${purchase.suppliers?.name ? ` from ${purchase.suppliers.name}` : ''}${purchase.total ? ` - $${purchase.total.toFixed(2)}` : ''}`,
          timestamp: new Date(purchase.created_at),
          icon: purchase.isdraft ? 'D' : 'P',
          iconColor: purchase.isdraft ? 'yellow' : 'blue',
        });
      });

      // Process transactions
      (transactionsResult.data || []).forEach((transaction: any) => {
        let title = 'Inventory updated';
        let icon = 'I';
        let iconColor = 'green';

        if (transaction.transactiontype === 'purchase') {
          title = 'Inventory increased';
          icon = '+';
          iconColor = 'green';
        } else if (transaction.transactiontype === 'sale') {
          title = 'Inventory decreased';
          icon = '-';
          iconColor = 'red';
        } else if (transaction.transactiontype === 'adjustment') {
          title = 'Inventory adjusted';
          icon = '±';
          iconColor = 'amber';
        }

        activities.push({
          id: transaction.transactionid,
          type: 'transaction',
          title,
          description: `${transaction.items?.name || 'Unknown item'}: ${transaction.quantity > 0 ? '+' : ''}${transaction.quantity}`,
          timestamp: new Date(transaction.created_at),
          icon,
          iconColor,
        });
      });

      // Sort by timestamp and limit
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
