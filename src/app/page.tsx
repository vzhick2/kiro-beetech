import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { CycleCountAlerts } from '@/components/dashboard/cycle-count-alerts';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ActionCenter } from '@/components/dashboard/action-center';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          🍯 KIRO Inventory Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your inventory management system
        </p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <CycleCountAlerts limit={5} />
          <ActionCenter />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecentActivity limit={8} />
        </div>
      </div>
    </div>
  );
}
