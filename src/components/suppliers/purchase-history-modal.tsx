'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Supplier } from '@/types/data-table';

interface PurchaseHistoryItem {
  id: string;
  item: string;
  cost: number;
  date: Date;
}

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  purchaseHistory: PurchaseHistoryItem[];
}

export const PurchaseHistoryModal = ({
  isOpen,
  onClose,
  supplier,
  purchaseHistory,
}: PurchaseHistoryModalProps) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortField, setSortField] = useState<'item' | 'cost' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = purchaseHistory;

    // Apply search filter
    if (searchFilter) {
      filtered = filtered.filter(item =>
        item.item.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (sortField === 'cost') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [purchaseHistory, searchFilter, sortField, sortDirection]);

  const handleSort = (field: 'item' | 'cost' | 'date') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const totalCost = filteredAndSortedData.reduce(
    (sum, item) => sum + item.cost,
    0
  );

  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Purchase History - {supplier.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search and Summary */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <Input
                placeholder="Search items..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredAndSortedData.length} items • Total: $
              {totalCost.toLocaleString()}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead
                    className="cursor-pointer select-none hover:bg-gray-50 text-xs font-medium"
                    onClick={() => handleSort('item')}
                  >
                    <div className="flex items-center gap-2">
                      Item
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-2 w-2 ${
                            sortField === 'item' && sortDirection === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDown
                          className={`h-2 w-2 -mt-0.5 ${
                            sortField === 'item' && sortDirection === 'desc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-gray-50 text-xs font-medium"
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center gap-2">
                      Cost
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-2 w-2 ${
                            sortField === 'cost' && sortDirection === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDown
                          className={`h-2 w-2 -mt-0.5 ${
                            sortField === 'cost' && sortDirection === 'desc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none hover:bg-gray-50 text-xs font-medium"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-2 w-2 ${
                            sortField === 'date' && sortDirection === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDown
                          className={`h-2 w-2 -mt-0.5 ${
                            sortField === 'date' && sortDirection === 'desc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map(item => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="text-xs">{item.item}</TableCell>
                      <TableCell className="text-xs font-medium">
                        ${item.cost.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        title={item.date.toLocaleString()}
                      >
                        {item.date.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-16 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-6 w-6" />
                        <p className="text-xs">No purchase history found</p>
                        {searchFilter && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchFilter('')}
                          >
                            <span className="text-xs">Clear search</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
