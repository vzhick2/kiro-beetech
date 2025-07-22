'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TrackingMode } from '@/types';
import { changeTrackingMode } from '@/app/actions/items';
import { Settings, Package, Calculator } from 'lucide-react';

interface TrackingModeIndicatorProps {
  mode: TrackingMode;
  itemId: string;
  itemName: string;
  currentQuantity?: number;
  onModeChanged?: () => void;
}

export function TrackingModeIndicator({
  mode,
  itemId,
  itemName,
  currentQuantity = 0,
  onModeChanged,
}: TrackingModeIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMode, setNewMode] = useState<TrackingMode>(mode);
  const [inventorySnapshot, setInventorySnapshot] = useState(currentQuantity.toString());
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleModeChange = async () => {
    if (newMode === mode) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const changeData = {
        itemId,
        newMode,
        inventorySnapshot: newMode === 'fully_tracked' ? parseFloat(inventorySnapshot) : undefined,
        reason: reason.trim() || undefined,
      };

      const result = await changeTrackingMode(changeData);

      if (result.success) {
        toast({
          title: 'Tracking mode changed',
          description: `${itemName} is now ${newMode === 'fully_tracked' ? 'fully tracked' : 'cost added'}`,
        });
        setIsOpen(false);
        onModeChanged?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to change tracking mode',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setNewMode(mode);
    setInventorySnapshot(currentQuantity.toString());
    setReason('');
  };

  const getModeInfo = (trackingMode: TrackingMode) => {
    switch (trackingMode) {
      case 'fully_tracked':
        return {
          label: 'Fully Tracked',
          description: 'Complete quantity tracking with real-time inventory updates',
          icon: Package,
          variant: 'default' as const,
        };
      case 'cost_added':
        return {
          label: 'Cost Added',
          description: 'Track costs only - no quantity management',
          icon: Calculator,
          variant: 'secondary' as const,
        };
    }
  };

  const currentModeInfo = getModeInfo(mode);
  const CurrentIcon = currentModeInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-1">
          <Badge variant={currentModeInfo.variant} className="flex items-center gap-1">
            <CurrentIcon className="h-3 w-3" />
            {currentModeInfo.label}
            <Settings className="h-3 w-3 ml-1" />
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Tracking Mode</DialogTitle>
          <DialogDescription>
            Choose how {itemName} should be tracked in your inventory system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
              <input
                type="radio"
                id="fully_tracked"
                name="trackingMode"
                value="fully_tracked"
                checked={newMode === 'fully_tracked'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMode(e.target.value as TrackingMode)}
                className="h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-1"
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="fully_tracked" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Fully Tracked
                </Label>
                <p className="text-sm text-muted-foreground">
                  Complete inventory management with quantity tracking, reorder points, and low stock alerts.
                  Best for items where you need precise inventory control.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
              <input
                type="radio"
                id="cost_added"
                name="trackingMode"
                value="cost_added"
                checked={newMode === 'cost_added'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMode(e.target.value as TrackingMode)}
                className="h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-1"
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="cost_added" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Cost Added
                </Label>
                <p className="text-sm text-muted-foreground">
                  Track only costs and pricing without managing quantities.
                  Ideal for small items, seasonings, or ingredients where exact counts aren&apos;t critical.
                </p>
              </div>
            </div>
          </div>

          {newMode === 'fully_tracked' && mode !== 'fully_tracked' && (
            <div className="space-y-2">
              <Label htmlFor="snapshot">Current Inventory Count</Label>
              <Input
                id="snapshot"
                type="number"
                step="0.01"
                value={inventorySnapshot}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInventorySnapshot(e.target.value)}
                placeholder="Enter current quantity on hand"
              />
              <p className="text-sm text-muted-foreground">
                Enter the actual quantity you have in stock right now. This will be your starting point for tracking.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why are you changing the tracking mode for this item?"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleModeChange} 
            disabled={isLoading || (newMode === 'fully_tracked' && mode !== 'fully_tracked' && !inventorySnapshot)}
          >
            {isLoading ? 'Changing...' : 'Change Mode'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
