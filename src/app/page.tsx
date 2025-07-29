import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { CycleCountAlerts } from '@/components/dashboard/cycle-count-alerts';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ActionCenter } from '@/components/dashboard/action-center';
import { paginationSettings } from '@/config/app-config';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your inventory management system
        </p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Main Content Grid - Improved responsive layout */}
      <div className="grid gap-8 xl:grid-cols-3 lg:grid-cols-2">
        {/* Cycle Count Alerts - Takes full width on smaller screens, 2/3 on xl */}
        <div className="xl:col-span-2">
          <CycleCountAlerts limit={paginationSettings.pageSizes.dashboard.cycleCountAlerts} />
        </div>

        {/* Recent Activity - Takes 1/3 on xl, full width on smaller */}
        <div className="xl:col-span-1">
          <RecentActivity limit={paginationSettings.pageSizes.dashboard.recentActivityHomepage} />
        </div>

        {/* Action Center - Takes full width on smaller screens, spans 2 columns on lg+ */}
        <div className="lg:col-span-2 xl:col-span-3">
          <ActionCenter />
        </div>
      </div>
    </div>
  );
}
