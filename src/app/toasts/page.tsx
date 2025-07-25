'use client';

import { useState } from 'react';
import { Check, X, AlertTriangle, Info, Copy, Archive, Trash2, Download, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Toast styles for 2025 SaaS applications
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
  // New 2025 styles
  glass: {
    success: "bg-green-500/10 border-green-400/30 shadow-2xl shadow-green-500/20 backdrop-blur-xl",
    error: "bg-red-500/10 border-red-400/30 shadow-2xl shadow-red-500/20 backdrop-blur-xl",
    warning: "bg-amber-500/10 border-amber-400/30 shadow-2xl shadow-amber-500/20 backdrop-blur-xl",
    info: "bg-blue-500/10 border-blue-400/30 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
  },
  minimal: {
    success: "bg-gray-900/95 border-green-500/50 shadow-2xl shadow-black/20",
    error: "bg-gray-900/95 border-red-500/50 shadow-2xl shadow-black/20",
    warning: "bg-gray-900/95 border-amber-500/50 shadow-2xl shadow-black/20",
    info: "bg-gray-900/95 border-blue-500/50 shadow-2xl shadow-black/20"
  },
  animations: {
    top: "animate-in slide-in-from-top-2 fade-in-0 duration-300",
    bottom: "animate-in slide-in-from-bottom-2 fade-in-0 duration-300",
    right: "animate-in slide-in-from-right-2 fade-in-0 duration-300"
  }
};

interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  style: 'notion' | 'modern' | 'glass' | 'minimal';
  shape?: 'rounded' | 'pill' | 'sharp' | 'card';
  position?: 'top' | 'bottom' | 'right';
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
  style: 'notion' | 'modern' | 'glass' | 'minimal';
  shape?: 'rounded' | 'pill' | 'sharp' | 'card';
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast = ({ title, message, type, style, shape = 'rounded', position = 'top', icon, onClose, action }: ToastProps) => {
  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };

  const iconColors = {
    success: style === 'minimal' ? "text-green-400" : "text-green-600",
    error: style === 'minimal' ? "text-red-400" : "text-red-600", 
    warning: style === 'minimal' ? "text-amber-400" : "text-yellow-600",
    info: style === 'minimal' ? "text-blue-400" : "text-blue-600"
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
    glass: {
      title: "text-gray-900",
      message: "text-gray-700"
    },
    minimal: {
      title: "text-white",
      message: "text-gray-300"
    }
  };

  const getTextColor = (element: 'title' | 'message') => {
    if (style === 'notion') return textColors.notion[element];
    if (style === 'modern') return element === 'title' ? textColors.modern.title[type] : textColors.modern.message;
    if (style === 'glass') return textColors.glass[element];
    if (style === 'minimal') return textColors.minimal[element];
    return 'text-gray-800';
  };

  return (
    <div className={`${TOAST_STYLES.shapes[shape]} ${TOAST_STYLES[style][type]} ${TOAST_STYLES.animations[position]}`}>
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
                      : style === 'minimal'
                        ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                        : style === 'glass'
                          ? 'bg-white/20 hover:bg-white/30 border border-white/30 text-gray-800'
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
                  : style === 'minimal'
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : style === 'glass'
                      ? 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
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
  const [currentPosition, setCurrentPosition] = useState<'top-right' | 'bottom-right' | 'top-center'>('top-right');

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

  const getPositionClasses = () => {
    switch (currentPosition) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50 space-y-3 max-w-md';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50 space-y-3 max-w-md';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 max-w-md';
      default:
        return 'fixed top-4 right-4 z-50 space-y-3 max-w-md';
    }
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

    // 2025 Glass Morphism Style
    {
      id: 'glass-success',
      title: 'Purchase order created',
      message: 'Order #PO-2025-001 ready for processing',
      type: 'success',
      style: 'glass',
      shape: 'card',
      icon: <Check className="h-5 w-5" />,
      action: { label: 'View Order', onClick: () => console.log('View order') }
    },
    {
      id: 'glass-info',
      title: 'AI suggestion available',
      message: 'Smart reorder recommendations based on your patterns',
      type: 'info',
      style: 'glass',
      shape: 'rounded',
      icon: <Info className="h-5 w-5" />
    },
    {
      id: 'glass-pill',
      title: 'Quick action completed',
      message: '',
      type: 'success',
      style: 'glass',
      shape: 'pill',
      icon: <Check className="h-4 w-4" />
    },

    // 2025 Minimal Dark Style
    {
      id: 'minimal-error',
      title: 'System maintenance required',
      message: 'Critical updates available for installation',
      type: 'error',
      style: 'minimal',
      shape: 'sharp',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: { label: 'Update Now', onClick: () => console.log('Update system') }
    },
    {
      id: 'minimal-success',
      title: 'Deployment successful',
      message: 'New inventory features are now live',
      type: 'success',
      style: 'minimal',
      shape: 'rounded',
      icon: <Check className="h-5 w-5" />
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

        {/* Position Controls */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Toast Position</h3>
          <div className="flex gap-2">
            {[
              { key: 'top-right', label: 'Top Right (Recommended)' },
              { key: 'bottom-right', label: 'Bottom Right' },
              { key: 'top-center', label: 'Top Center' }
            ].map(position => (
              <Button
                key={position.key}
                onClick={() => setCurrentPosition(position.key as any)}
                variant={currentPosition === position.key ? 'default' : 'outline'}
                size="sm"
              >
                {position.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Toast Display Area */}
        <div className={getPositionClasses()}>
          {toastExamples.map(toast => 
            visibleToasts.has(toast.id) && (
              <Toast
                key={toast.id}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                style={toast.style}
                shape={toast.shape || 'rounded'}
                position={currentPosition === 'bottom-right' ? 'bottom' : 'top'}
                icon={toast.icon}
                {...(toast.action && { action: toast.action })}
                onClose={() => hideToast(toast.id)}
              />
            )
          )}
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
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

          {/* 2025 Glass Morphism Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2025 Glass Morphism
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Ultra-modern glass effects with various shapes and premium blur.
              </p>
              
              <div className="space-y-3">
                {toastExamples.filter(t => t.style === 'glass').map(toast => (
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
                        <div className="text-sm text-gray-500">
                          {toast.shape && <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{toast.shape}</span>}
                          {toast.message || 'Compact design'}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 2025 Minimal Dark Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2025 Minimal Dark
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Sophisticated dark theme with sharp edges and elegant contrast.
              </p>
              
              <div className="space-y-3">
                {toastExamples.filter(t => t.style === 'minimal').map(toast => (
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
                        <div className="text-sm text-gray-500">
                          {toast.shape && <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{toast.shape}</span>}
                          {toast.message}
                        </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2025 Toast Innovation Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900 mb-2">🎨 Four Design Styles</div>
              <ul className="space-y-1">
                <li>• Notion-inspired (matches floating controls)</li>
                <li>• Modern SaaS (contextual colors)</li>
                <li>• Glass Morphism (ultra-modern blur)</li>
                <li>• Minimal Dark (sophisticated contrast)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">📐 Shape Variations</div>
              <ul className="space-y-1">
                <li>• Rounded rectangles (standard)</li>
                <li>• Pills (compact, for quick actions)</li>
                <li>• Sharp rectangles (brutalist aesthetic)</li>
                <li>• Cards (premium with more elevation)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">📍 Smart Positioning</div>
              <ul className="space-y-1">
                <li>• Top-right (recommended standard)</li>
                <li>• Bottom-right (less intrusive)</li>
                <li>• Top-center (mobile-optimized)</li>
                <li>• Responsive to layout constraints</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">⚡ Modern Interactions</div>
              <ul className="space-y-1">
                <li>• Backdrop blur effects</li>
                <li>• Smooth slide animations</li>
                <li>• Auto-dismiss with manual override</li>
                <li>• Contextual action buttons</li>
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
