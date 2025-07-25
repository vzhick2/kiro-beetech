'use client';

import { useEffect, useRef } from 'react';

interface ColumnResizerProps {
  columnId: string;
  onResize: (columnId: string, width: number) => void;
  onStartResize: (columnId: string, startWidth: number) => void;
  onStopResize: () => void;
}

export const ColumnResizer = ({
  columnId,
  onResize,
  onStartResize,
  onStopResize,
}: ColumnResizerProps) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startXRef.current = e.clientX;
      const th = resizer.parentElement;
      if (th) {
        startWidthRef.current = th.offsetWidth;
      }
      onStartResize(columnId, startWidthRef.current);

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startXRef.current;
        const newWidth = startWidthRef.current + diff;
        onResize(columnId, Math.max(60, newWidth)); // Ensure minimum 60px
      };

      const handleMouseUp = () => {
        onStopResize();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    resizer.addEventListener('mousedown', handleMouseDown);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
    };
  }, [columnId, onResize, onStartResize, onStopResize]);

  return (
    <div
      ref={resizerRef}
      className="absolute right-0 top-0 w-2 h-full cursor-col-resize group flex items-center justify-center"
      style={{ zIndex: 10 }}
    >
      <div className="w-0.5 h-4 bg-gray-300 group-hover:bg-blue-400 transition-colors" />
    </div>
  );
};
