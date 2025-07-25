'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

// Toast configuration
export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Toast component with Notion-inspired styling
const ToastComponent = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600"
  };

  return (
    <div className="relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md bg-white/95 border-gray-200/60 shadow-gray-900/[0.08] animate-in slide-in-from-right-2 fade-in-0">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
            {toast.icon || icons[toast.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-800">
              {toast.title}
            </div>
            <div className="text-sm mt-1 text-gray-600">
              {toast.message}
            </div>
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="h-8 px-3 text-xs font-medium bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      ...toastData,
      id,
      duration: toastData.duration ?? 5000, // Default 5 seconds
    };

    setToasts(prev => [...prev, toast]);

    // Auto-hide after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container - Fixed top-right, below navbar */}
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent
              toast={toast}
              onClose={() => hideToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
