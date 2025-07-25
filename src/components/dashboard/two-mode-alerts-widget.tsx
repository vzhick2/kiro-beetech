'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Clock, Package, Calculator } from 'lucide-react';
import { getTwoModeAlerts } from '@/app/actions/items';
import { TwoModeAlert } from '@/types';

export function TwoModeAlertsWidget() {
  const [alerts, setAlerts] = useState<TwoModeAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const result = await getTwoModeAlerts();
      if (result.success && Array.isArray(result.data)) {
        setAlerts(result.data as TwoModeAlert[]);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Loading alerts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>No alerts at this time</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'LOW_STOCK':
        return <Package className="h-4 w-4" />;
      case 'COST_REVIEW':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (priority: number) => {
    if (priority >= 3) return 'destructive' as const;
    if (priority >= 2) return 'default' as const;
    return 'secondary' as const;
  };

  const getModeIcon = (mode: string) => {
    return mode === 'fully_tracked' ? (
      <Package className="h-3 w-3" />
    ) : (
      <Calculator className="h-3 w-3" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Inventory Alerts ({alerts.length})
        </CardTitle>
        <CardDescription>
          Low stock alerts for fully tracked items and cost review reminders for
          cost-added items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.itemid}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.alert_type)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{alert.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.sku}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      {getModeIcon(alert.tracking_mode)}
                      {alert.tracking_mode === 'fully_tracked'
                        ? 'Tracked'
                        : 'Cost Only'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.alert_message}
                  </p>
                </div>
              </div>
              <Badge variant={getAlertVariant(alert.priority)}>
                {alert.alert_type === 'LOW_STOCK' ? 'Low Stock' : 'Review Cost'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
