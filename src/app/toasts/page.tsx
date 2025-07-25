'use client';

import { useState } from 'react';
import { Check, X, AlertTriangle, Info, Copy, Archive, Trash2, Download, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Notion-inspired toast styles matching the floating controls
const TOAST_STYLES = {
  base: "relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md",
  notion: {
    success: "bg-white/95 border-green-200/60 shadow-green-900/[0.08]",
    error: "bg-white/95 border-red-200/60 shadow-red-900/[0.08]",
    warning: "bg-white/95 border-yellow-200/60 shadow-yellow-900/[0.08]",
    info: "bg-white/95 border-blue-200/60 shadow-blue-900/[0.08]"
  },
  modern: {
    success: "bg-green-50/95 border-green-200/80 shadow-green-900/10",
    error: "bg-red-50/95 border-red-200/80 shadow-red-900/10",
    warning: "bg-yellow-50/95 border-yellow-200/80 shadow-yellow-900/10",
    info: "bg-blue-50/95 border-blue-200/80 shadow-blue-900/10"
  },
  animation: "animate-in slide-in-from-top-2 fade-in-0 duration-300"
};

interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  style: 'notion' | 'modern';
  icon?: React.ReactNode;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastExample {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  style: 'notion' | 'modern';
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast = ({ title, message, type, style, icon, onClose, action }: ToastProps) => {
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

  const textColors = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800"
  };

  return (
    <div className={`${TOAST_STYLES.base} ${TOAST_STYLES[style][type]} ${TOAST_STYLES.animation}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${iconColors[type]}`}>
            {icon || icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm ${style === 'notion' ? 'text-gray-800' : textColors[type]}`}>
              {title}
            </div>
            <div className={`text-sm mt-1 ${style === 'notion' ? 'text-gray-600' : 'text-gray-700'}`}>
              {message}
            </div>
            {action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={action.onClick}
                  className={`h-8 px-3 text-xs font-medium ${
                    style === 'notion' 
                      ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700' 
                      : type === 'success' 
                        ? 'bg-green-600 hover:bg-green-700 text-white border border-green-600'
                        : type === 'error'
                          ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
                          : type === 'warning'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white border border-yellow-600'
                            : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
                  }`}
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                style === 'notion'
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ToastShowcase = () => {
  const [visibleToasts, setVisibleToasts] = useState<Set<string>>(new Set());

  const showToast = (id: string) => {
    setVisibleToasts(prev => new Set(prev).add(id));
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setVisibleToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 5000);
  };

  const hideToast = (id: string) => {
    setVisibleToasts(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toastExamples: ToastExample[] = [
    // Notion-Inspired Toasts (matching floating controls)
    {
      id: 'notion-success',
      title: 'Suppliers exported successfully',
      message: 'Downloaded 24 suppliers to your device',
      type: 'success',
      style: 'notion',
      icon: <Download className="h-5 w-5" />,
      action: { label: 'Open File', onClick: () => console.log('Open file') }
    },
    {
      id: 'notion-archive',
      title: '3 suppliers archived',
      message: 'Items moved to archived section',
      type: 'info',
      style: 'notion',
      icon: <Archive className="h-5 w-5" />,
      action: { label: 'Undo', onClick: () => console.log('Undo action') }
    },
    {
      id: 'notion-delete',
      title: 'Deletion failed',
      message: 'Cannot delete suppliers with active orders',
      type: 'error',
      style: 'notion',
      icon: <Trash2 className="h-5 w-5" />
    },
    {
      id: 'notion-changes',
      title: 'Changes saved',
      message: 'All spreadsheet modifications applied successfully',
      type: 'success',
      style: 'notion',
      icon: <Check className="h-5 w-5" />
    },

    // Modern SaaS Style Toasts
    {
      id: 'modern-copy',
      title: 'Data copied to clipboard',
      message: 'Supplier information ready to paste',
      type: 'success',
      style: 'modern',
      icon: <Copy className="h-5 w-5" />
    },
    {
      id: 'modern-warning',
      title: 'Connection unstable',
      message: 'Some features may be limited',
      type: 'warning',
      style: 'modern',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: { label: 'Retry', onClick: () => console.log('Retry connection') }
    },
    {
      id: 'modern-notification',
      title: 'New supplier request',
      message: 'Review pending approval from John Smith',
      type: 'info',
      style: 'modern',
      icon: <Bell className="h-5 w-5" />,
      action: { label: 'Review', onClick: () => console.log('Review request') }
    },
    {
      id: 'modern-sync',
      title: 'Data synchronized',
      message: 'Latest changes synced across all devices',
      type: 'success',
      style: 'modern',
      icon: <RefreshCw className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Toast Notifications</h1>
          <p className="text-gray-600">
            Elegant toast notification examples for modern SaaS applications. 
            Two cohesive styles matching the Notion-inspired floating controls.
          </p>
        </div>

        {/* Toast Display Area */}
        <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
          {toastExamples.map(toast => 
            visibleToasts.has(toast.id) && (
              <Toast
                key={toast.id}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                style={toast.style}
                icon={toast.icon}
                {...(toast.action && { action: toast.action })}
                onClose={() => hideToast(toast.id)}
              />
            )
          )}
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notion-Inspired Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Notion-Inspired Style
              </h2>
              <p className="text-gray-600 mb-6">
                Clean, minimal toasts matching the floating control bar aesthetic. 
                Perfect for professional workflow applications.
              </p>
              
              <div className="space-y-3">
                {toastExamples.filter(t => t.style === 'notion').map(toast => (
                  <Button
                    key={toast.id}
                    onClick={() => showToast(toast.id)}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${toast.type === 'success' ? 'text-green-600' : ''}
                        ${toast.type === 'error' ? 'text-red-600' : ''}
                        ${toast.type === 'warning' ? 'text-yellow-600' : ''}
                        ${toast.type === 'info' ? 'text-blue-600' : ''}
                      `}>
                        {toast.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{toast.title}</div>
                        <div className="text-sm text-gray-500">{toast.message}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Modern SaaS Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Modern SaaS Style
              </h2>
              <p className="text-gray-600 mb-6">
                Vibrant, contextual toasts with subtle color backgrounds. 
                Ideal for dynamic user interactions and feedback.
              </p>
              
              <div className="space-y-3">
                {toastExamples.filter(t => t.style === 'modern').map(toast => (
                  <Button
                    key={toast.id}
                    onClick={() => showToast(toast.id)}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        ${toast.type === 'success' ? 'text-green-600' : ''}
                        ${toast.type === 'error' ? 'text-red-600' : ''}
                        ${toast.type === 'warning' ? 'text-yellow-600' : ''}
                        ${toast.type === 'info' ? 'text-blue-600' : ''}
                      `}>
                        {toast.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{toast.title}</div>
                        <div className="text-sm text-gray-500">{toast.message}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900">Design Cohesion</div>
              Notion-style toasts match floating controls for consistent UX
            </div>
            <div>
              <div className="font-medium text-gray-900">Micro-interactions</div>
              Smooth slide-in animations and hover states
            </div>
            <div>
              <div className="font-medium text-gray-900">Accessibility</div>
              Proper contrast ratios and screen reader support
            </div>
            <div>
              <div className="font-medium text-gray-900">Auto-dismiss</div>
              5-second auto-hide with manual close option
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastShowcase;
