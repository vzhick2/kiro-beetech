'use client';

import { useState } from 'react';
import { Check, X, AlertTriangle, Info, Copy, Archive, Trash2, Download, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Toast styles for modern SaaS applications
const TOAST_STYLES = {
  // Base styles for different shapes
  shapes: {
    rounded: "relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md",
    pill: "relative overflow-hidden rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md",
    sharp: "relative overflow-hidden border shadow-lg backdrop-blur-md transition-all duration-200 max-w-md",
    card: "relative overflow-hidden rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 max-w-sm"
  },
  // Design variants
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
  flat: {
    success: "bg-white border border-green-300 shadow-sm",
    error: "bg-white border border-red-300 shadow-sm",
    warning: "bg-white border border-yellow-300 shadow-sm",
    info: "bg-white border border-blue-300 shadow-sm"
  },
  animation: "animate-in slide-in-from-top-2 fade-in-0 duration-300"
};

interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  style: 'notion' | 'modern' | 'flat';
  shape?: 'rounded' | 'pill' | 'sharp' | 'card';
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
  style: 'notion' | 'modern' | 'flat';
  shape?: 'rounded' | 'pill' | 'sharp' | 'card';
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast = ({ title, message, type, style, shape = 'rounded', icon, onClose, action }: ToastProps) => {
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
    notion: {
      title: "text-gray-800",
      message: "text-gray-600"
    },
    modern: {
      title: {
        success: "text-green-800",
        error: "text-red-800", 
        warning: "text-yellow-800",
        info: "text-blue-800"
      },
      message: "text-gray-700"
    },
    flat: {
      title: {
        success: "text-green-700",
        error: "text-red-700",
        warning: "text-yellow-700",
        info: "text-blue-700"
      },
      message: "text-gray-600"
    }
  };

  const getTextColor = (element: 'title' | 'message') => {
    if (style === 'notion') return textColors.notion[element];
    if (style === 'modern') return element === 'title' ? textColors.modern.title[type] : textColors.modern.message;
    if (style === 'flat') return element === 'title' ? textColors.flat.title[type] : textColors.flat.message;
    return 'text-gray-800';
  };

  return (
    <div className={`${TOAST_STYLES.shapes[shape]} ${TOAST_STYLES[style][type]} ${TOAST_STYLES.animation}`}>
      <div className={`${shape === 'pill' ? 'px-6 py-3' : shape === 'card' ? 'p-6' : 'p-4'}`}>
        <div className={`flex items-start ${shape === 'pill' ? 'gap-2' : 'gap-3'}`}>
          <div className={`flex-shrink-0 ${iconColors[type]}`}>
            {icon || icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm ${getTextColor('title')}`}>
              {title}
            </div>
            {shape !== 'pill' && (
              <div className={`text-sm mt-1 ${getTextColor('message')}`}>
                {message}
              </div>
            )}
            {action && shape !== 'pill' && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={action.onClick}
                  className={`h-8 px-3 text-xs font-medium ${
                    style === 'notion' 
                      ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700' 
                      : style === 'flat'
                        ? 'bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700'
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
                  : style === 'flat'
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
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
    },

    // Simple Flat Style Toasts
    {
      id: 'flat-success',
      title: 'Purchase order created',
      message: 'Order #PO-2025-001 ready for processing',
      type: 'success',
      style: 'flat',
      icon: <Check className="h-5 w-5" />,
      action: { label: 'View Order', onClick: () => console.log('View order') }
    },
    {
      id: 'flat-info',
      title: 'System update available',
      message: 'New features and improvements are ready',
      type: 'info',
      style: 'flat',
      icon: <Info className="h-5 w-5" />
    },
    {
      id: 'flat-warning',
      title: 'Low inventory alert',
      message: 'Several items are running low on stock',
      type: 'warning',
      style: 'flat',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: { label: 'Review', onClick: () => console.log('Review inventory') }
    },
    {
      id: 'flat-error',
      title: 'Upload failed',
      message: 'Unable to process the selected file',
      type: 'error',
      style: 'flat',
      icon: <X className="h-5 w-5" />
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

        {/* Toast Display Area - Fixed Top Right */}
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
          {toastExamples.map(toast => 
            visibleToasts.has(toast.id) && (
              <Toast
                key={toast.id}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                style={toast.style}
                shape={toast.shape || 'rounded'}
                icon={toast.icon}
                {...(toast.action && { action: toast.action })}
                onClose={() => hideToast(toast.id)}
              />
            )
          )}
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notion-Inspired Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Notion-Inspired
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Clean, minimal toasts matching the floating control bar aesthetic.
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
                Modern SaaS
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Vibrant, contextual toasts with subtle color backgrounds.
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

          {/* Simple Flat Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Simple Flat
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Clean, minimal flat design with subtle borders and no effects.
              </p>
              
              <div className="space-y-3">
                {toastExamples.filter(t => t.style === 'flat').map(toast => (
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
        <div className="mt-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Toast System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900 mb-2">🎨 Three Design Styles</div>
              <ul className="space-y-1">
                <li>• Notion-inspired (matches floating controls)</li>
                <li>• Modern SaaS (contextual colors)</li>
                <li>• Simple Flat (minimal, clean borders)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">📐 Shape Variations</div>
              <ul className="space-y-1">
                <li>• Rounded rectangles (standard)</li>
                <li>• Pills (compact, for quick actions)</li>
                <li>• Sharp rectangles (minimal aesthetic)</li>
                <li>• Cards (premium with more elevation)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">📍 Fixed Top-Right Position</div>
              <ul className="space-y-1">
                <li>• Consistent placement</li>
                <li>• Doesn&apos;t interfere with sidebar</li>
                <li>• Mobile-friendly</li>
                <li>• Stack vertically when multiple</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">⚡ Modern Interactions</div>
              <ul className="space-y-1">
                <li>• Smooth slide-in animations</li>
                <li>• Auto-dismiss with manual override</li>
                <li>• Contextual action buttons</li>
                <li>• Hover state feedback</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">♿ Accessibility</div>
              <ul className="space-y-1">
                <li>• WCAG contrast compliance</li>
                <li>• Screen reader announcements</li>
                <li>• Keyboard navigation support</li>
                <li>• Touch-friendly controls</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">🎯 Business Context</div>
              <ul className="space-y-1">
                <li>• Inventory operation feedback</li>
                <li>• Error prevention messaging</li>
                <li>• Workflow completion signals</li>
                <li>• Progressive enhancement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastShowcase;
