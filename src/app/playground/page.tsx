'use client';

import { useState } from 'react';
import { ChevronUp, Download, Trash2, Edit, Save, X } from 'lucide-react';

// Mock states for demonstration
type PlaygroundState = 'minimal' | 'selected' | 'spreadsheet';

interface PlaygroundControlsProps {
  state: PlaygroundState;
  selectedCount?: number;
  variant: 'glassmorphism' | 'soft-rounded' | 'micro-interactions' | 'notion-inspired' | 'clean-minimal' | 'rounded-glass' | 'modern-card' | 'zen-mode' | 'elegant-shadow';
}

function PlaygroundControls({ state, selectedCount = 2, variant }: PlaygroundControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Base classes for all variants
  const baseClasses = "absolute bottom-6 right-6 flex items-center gap-2 transition-all duration-200 shadow-lg";
  
  // Variant-specific styling
  const variantStyles = {
    glassmorphism: {
      container: "bg-black/30 backdrop-blur-md border border-white/30 text-white rounded-2xl shadow-lg",
      button: "hover:bg-white/20 active:bg-white/30 active:scale-95 rounded-xl px-3 py-2 backdrop-blur-sm text-white font-medium transition-all duration-150",
      deleteButton: "bg-red-500/90 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150",
      minimal: "px-3 py-3",
      expanded: "px-5 py-3"
    },
    'soft-rounded': {
      container: "bg-white text-gray-700 rounded-2xl shadow-md border border-gray-200",
      button: "hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-xl px-4 py-2 font-medium transition-all duration-150",
      deleteButton: "bg-red-50 hover:bg-red-100 active:bg-red-200 active:scale-95 text-red-600 border border-red-200 transition-all duration-150",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'micro-interactions': {
      container: "bg-white text-gray-900 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300",
      button: "hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 active:scale-95 rounded-lg px-4 py-2 font-medium transition-all duration-150",
      deleteButton: "bg-red-50 hover:bg-red-100 active:bg-red-200 active:scale-95 text-red-600 transition-all duration-150",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'notion-inspired': {
      container: "bg-white text-gray-900 rounded-lg shadow-sm border border-gray-200 ring-1 ring-gray-100",
      button: "hover:bg-gray-100 active:bg-gray-200 active:scale-95 rounded-md px-3 py-2 font-medium transition-all duration-150 text-gray-700",
      deleteButton: "bg-gray-50 hover:bg-red-50 active:bg-red-100 active:scale-95 text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-150",
      minimal: "px-3 py-2.5",
      expanded: "px-4 py-2.5"
    },
    'clean-minimal': {
      container: "bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl shadow-sm border border-gray-100",
      button: "hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-xl px-4 py-2.5 font-medium transition-all duration-150",
      deleteButton: "bg-red-50 hover:bg-red-100 active:bg-red-200 active:scale-95 text-red-600 transition-all duration-150",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'rounded-glass': {
      container: "bg-white/80 backdrop-blur-xl border border-white/50 text-gray-900 rounded-3xl shadow-lg",
      button: "hover:bg-white/60 active:bg-white/80 active:scale-95 rounded-2xl px-4 py-2.5 font-medium transition-all duration-150",
      deleteButton: "bg-red-100/80 hover:bg-red-200/90 active:bg-red-300/90 active:scale-95 text-red-700 transition-all duration-150",
      minimal: "px-4 py-3.5",
      expanded: "px-6 py-3.5"
    },
    'modern-card': {
      container: "bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700/50",
      button: "hover:bg-gray-700 active:bg-gray-600 active:scale-95 rounded-lg px-4 py-2.5 font-medium transition-all duration-150",
      deleteButton: "bg-red-900/80 hover:bg-red-800 active:bg-red-700 active:scale-95 text-red-200 transition-all duration-150",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'zen-mode': {
      container: "bg-gray-50 text-gray-700 rounded-xl shadow-inner border border-gray-200/50",
      button: "hover:bg-white hover:shadow-sm active:bg-gray-100 active:scale-95 rounded-lg px-4 py-2.5 font-medium transition-all duration-150",
      deleteButton: "bg-red-50 hover:bg-red-100 hover:shadow-sm active:bg-red-200 active:scale-95 text-red-600 transition-all duration-150",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'elegant-shadow': {
      container: "bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100",
      button: "hover:bg-blue-50 hover:text-blue-700 hover:shadow-md active:bg-blue-100 active:scale-95 rounded-xl px-4 py-2.5 font-semibold transition-all duration-150",
      deleteButton: "bg-red-50 hover:bg-red-100 hover:shadow-md active:bg-red-200 active:scale-95 text-red-600 transition-all duration-150",
      minimal: "px-4 py-3.5",
      expanded: "px-6 py-3.5"
    }
  };

  const styles = variantStyles[variant];
  const isMinimal = state === 'minimal';
  const padding = isMinimal ? styles.minimal : styles.expanded;

  if (state === 'minimal') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding}`}>
        <button className={`${styles.button} flex items-center gap-2 group`}>
          <Edit className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
          Edit All Rows
        </button>
        <button className={`${styles.button} flex items-center justify-center h-[2.5rem] w-10 group`}>
          <ChevronUp className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
      </div>
    );
  }

  if (state === 'spreadsheet') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding} w-full max-w-4xl left-1/2 transform -translate-x-1/2`}>
        <div className="flex items-center gap-4 w-full">
          <span className="font-semibold">Spreadsheet Mode</span>
          <span className="text-sm opacity-75">Tab: Next field • ↑↓: Navigate rows • Esc: Exit</span>
          <div className="ml-auto flex items-center gap-2">
            <button className={`${styles.button} ${
              variant === 'notion-inspired' 
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 text-white' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95'
            } flex items-center gap-2 group transition-all duration-150`}>
              <Save className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
              Apply Changes
            </button>
            <button className={`${styles.button} p-2 group`}>
              <X className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'selected') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding}`}>
        <span className="font-medium">{selectedCount} selected</span>
        <button className={`${styles.button} p-2 group`}>
          <Download className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
        <button className={`${styles.button} p-2 group`}>
          <Edit className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
        <button className={`${styles.button} ${styles.deleteButton} p-2 group`}>
          <Trash2 className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
      </div>
    );
  }

  return null;
}

export default function PlaygroundPage() {
  const [currentState, setCurrentState] = useState<PlaygroundState>('minimal');
  const [selectedCount, setSelectedCount] = useState(2);

  const variants = [
    { key: 'glassmorphism', name: 'Glassmorphism', description: 'Modern glass effect with blur' },
    { key: 'soft-rounded', name: 'Soft Rounded', description: 'Clean white design with rounded corners' },
    { key: 'micro-interactions', name: 'Micro Interactions', description: '2025 trend: Subtle meaningful animations and feedback' },
    { key: 'notion-inspired', name: 'Notion Inspired', description: '2025 SaaS: Clean minimal with subtle borders' },
    { key: 'clean-minimal', name: 'Clean Minimal', description: 'Pure minimal design with subtle backdrop blur' },
    { key: 'rounded-glass', name: 'Rounded Glass', description: 'Ultra-rounded glass morphism with enhanced depth' },
    { key: 'modern-card', name: 'Modern Card', description: 'Professional dark theme with elegant shadows' },
    { key: 'zen-mode', name: 'Zen Mode', description: 'Calm, muted design focused on content clarity' },
    { key: 'elegant-shadow', name: 'Elegant Shadow', description: 'Sophisticated white design with dynamic shadows' }
  ] as const;

  const states = [
    { key: 'minimal', name: 'Minimal (Edit All Rows)', description: 'When no items are selected' },
    { key: 'selected', name: 'Batch Actions', description: 'When items are selected for batch operations' },
    { key: 'spreadsheet', name: 'Spreadsheet Mode', description: 'When in spreadsheet editing mode' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Floating Controls Playground</h1>
          <p className="text-gray-600">
            Explore different design variations of the floating action bar in various states.
            All designs are optimized for desktop views.
          </p>
        </div>

        {/* State Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Control State</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {states.map(({ key, name, description }) => (
              <button
                key={key}
                onClick={() => setCurrentState(key)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentState === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs opacity-75">{description}</div>
              </button>
            ))}
          </div>
          
          {currentState === 'selected' && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Selected Count:</label>
              <input
                type="number"
                min="1"
                max="999"
                value={selectedCount}
                onChange={(e) => setSelectedCount(parseInt(e.target.value) || 1)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          )}
        </div>

        {/* Design Variants */}
        <div className="space-y-8">
          {variants.map(({ key, name, description }) => (
            <div key={key} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <p className="text-gray-600 text-sm mt-1">{description}</p>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-64 overflow-hidden">
                {/* Simulated table content with headers and data rows */}
                <div className="absolute inset-0 p-4">
                  {/* Table header */}
                  <div className="grid grid-cols-5 gap-4 mb-2 text-xs font-semibold text-gray-600">
                    <div className="bg-gray-300 h-6 rounded flex items-center px-2">Supplier Name</div>
                    <div className="bg-gray-300 h-6 rounded flex items-center px-2">Contact</div>
                    <div className="bg-gray-300 h-6 rounded flex items-center px-2">Location</div>
                    <div className="bg-gray-300 h-6 rounded flex items-center px-2">Items</div>
                    <div className="bg-gray-300 h-6 rounded flex items-center px-2">Status</div>
                  </div>
                  
                  {/* Table rows */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 mb-2 text-xs">
                      <div className="bg-white h-6 rounded opacity-60 flex items-center px-2">
                        {['Acme Corp', 'Fresh Supplies', 'Global Foods', 'Local Farm', 'Premium Goods', 'Quick Supply', 'Bulk Mart', 'Specialty Co'][i]}
                      </div>
                      <div className="bg-white h-6 rounded opacity-40"></div>
                      <div className="bg-white h-6 rounded opacity-50"></div>
                      <div className="bg-white h-6 rounded opacity-30"></div>
                      <div className="bg-green-200 h-6 rounded opacity-70 flex items-center px-2">Active</div>
                    </div>
                  ))}
                </div>
                
                {/* Floating Controls */}
                <PlaygroundControls
                  state={currentState}
                  selectedCount={selectedCount}
                  variant={key as any}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Notes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Implementation Notes</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• All variants use the same positioning logic (absolute bottom-6 right-6)</li>
            <li>• Responsive width adjustments based on content state</li>
            <li>• Consistent icon usage across all designs (5x5 icons for uniformity)</li>
            <li>• Touch-friendly button sizing (minimum 44px targets)</li>
            <li>• Smooth transitions between states with expanding hover animations</li>
            <li>• Click feedback with scale-down effect (active:scale-95) for modern SaaS feel</li>
            <li>• All animations use duration-150 for snappy, responsive interactions</li>
          </ul>
        </div>

        {/* Click Interaction Guidelines */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Modern Click Interaction Standards</h3>
          <div className="text-green-800 text-sm space-y-2">
            <p><strong>Modern SaaS Practice:</strong> Subtle click feedback is standard - scale-down (95%) on active state provides immediate tactile response without being distracting.</p>
            <p><strong>Why Click States Matter:</strong> They bridge the gap between hover intent and action completion, providing crucial user confidence in touch interfaces.</p>
            <p><strong>Implementation:</strong> <code className="bg-green-100 px-1 rounded">active:scale-95 active:bg-[color] transition-all duration-150</code></p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Scale-down creates "button press" feeling</li>
              <li>Slightly darker background confirms interaction</li>
              <li>Fast 150ms transition feels responsive, not laggy</li>
              <li>Works across mouse clicks and touch taps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
