'use client';

import { useState, useEffect } from 'react';
import type { PaginationState } from '@/types/data-table';

export const usePagination = (totalItems: number) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Calculate optimal page size based on screen height
  useEffect(() => {
    const calculatePageSize = () => {
      const screenHeight = window.innerHeight;
      const headerHeight = 200; // Approximate header + search + controls height
      const footerHeight = 100; // Pagination controls height
      const rowHeight = 60; // Approximate row height including padding

      const availableHeight = screenHeight - headerHeight - footerHeight;
      const optimalRows = Math.floor(availableHeight / rowHeight);

      // Ensure minimum 10 rows and maximum 100 rows, default to 20
      const pageSize = Math.max(10, Math.min(100, optimalRows || 20));

      setPagination(prev => ({ ...prev, pageSize: Math.max(20, pageSize) }));
    };

    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);

    return () => window.removeEventListener('resize', calculatePageSize);
  }, []);

  const pageCount = Math.ceil(totalItems / pagination.pageSize);
  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  const goToPage = (pageIndex: number) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, Math.min(pageCount - 1, pageIndex)),
    }));
  };

  const nextPage = () => {
    if (canNextPage) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, pageIndex: 0 }));
  };

  return {
    pagination,
    setPagination,
    pageCount,
    canPreviousPage,
    canNextPage,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
  };
};
