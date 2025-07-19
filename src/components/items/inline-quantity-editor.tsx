'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Check, X } from 'lucide-react';
import { updateItem } from '@/app/actions/items';

interface InlineQuantityEditorProps {
  itemId: string;
  currentQuantity: number;
  unit: string;
  onQuantityUpdated?: (newQuantity: number) => void;
}

export function InlineQuantityEditor({
  itemId,
  currentQuantity,
  unit,
  onQuantityUpdated,
}: InlineQuantityEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(currentQuantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (quantity === currentQuantity) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateItem(itemId, { currentquantity: quantity });

      if (result.success) {
        setIsEditing(false);
        onQuantityUpdated?.(quantity);
      } else {
        setError(result.error || 'Failed to update quantity');
        // Reset to original quantity on error
        setQuantity(currentQuantity);
      }
    } catch {
      setError('An unexpected error occurred');
      setQuantity(currentQuantity);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setQuantity(currentQuantity);
    setError(null);
    setIsEditing(false);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(0, prev - 1));
  };

  const getQuantityColor = (qty: number) => {
    if (qty < 0) {
      return 'text-red-600';
    }
    if (qty < 20) {
      return 'text-amber-600';
    }
    return 'text-green-600';
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={loading}
          className="h-6 w-6 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
          className={`w-16 text-center text-sm border rounded px-1 py-1 ${getQuantityColor(quantity)}`}
          disabled={loading}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={loading}
          className="h-6 w-6 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>

        <span className="text-xs text-gray-500 ml-1">{unit}</span>

        <div className="flex space-x-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="h-6 w-6 p-0 bg-green-50 hover:bg-green-100"
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
            className="h-6 w-6 p-0 bg-red-50 hover:bg-red-100"
          >
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>

        {error && (
          <div className="absolute top-full left-0 mt-1 p-1 bg-red-50 border border-red-200 rounded text-xs text-red-600 whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <span className={`font-medium ${getQuantityColor(currentQuantity)}`}>
        {currentQuantity} {unit}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
