'use client';

import { useState } from 'react';
import { ChevronUp, Download, Trash2, Edit, Save, X, Zap, Shapes, TreePine, Rocket } from 'lucide-react';

// Mock states for demonstration
type PlaygroundState = 'minimal' | 'selected' | 'spreadsheet';

interface PlaygroundControlsProps {
  state: PlaygroundState;
  selectedCount?: number;
  variant: 'original' | 'glassmorphism' | 'glassmorphism-enhanced' | 'minimal' | 'corporate' | 'soft-rounded' | 'micro-interactions' | 'brutalist-bold' | 'organic-curves' | 'electric-neon' | 'warm-earth' | 'retro-future';
}

function PlaygroundControls({ state, selectedCount = 2, variant }: PlaygroundControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Base classes for all variants
  const baseClasses = "absolute bottom-6 right-6 flex items-center gap-2 transition-all duration-200 shadow-lg";
  
  // Variant-specific styling
  const variantStyles = {
    original: {
      container: "bg-blue-600 text-white rounded-full",
      button: "hover:bg-blue-700 rounded-lg px-3 py-2",
      deleteButton: "bg-red-600 hover:bg-red-700",
      minimal: "px-2 py-2",
      expanded: "px-4 py-2"
    },
    glassmorphism: {
      container: "bg-black/30 backdrop-blur-md border border-white/30 text-white rounded-2xl shadow-lg",
      button: "hover:bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm text-white font-medium",
      deleteButton: "bg-red-500/90 hover:bg-red-600 text-white",
      minimal: "px-3 py-3",
      expanded: "px-5 py-3"
    },
    'glassmorphism-enhanced': {
      container: "bg-black/35 backdrop-blur-lg border border-blue-400/50 text-white rounded-2xl shadow-xl",
      button: "hover:bg-blue-400/30 rounded-xl px-3 py-2 backdrop-blur-sm border border-blue-300/30 transition-all text-white font-medium",
      deleteButton: "bg-red-500/90 hover:bg-red-600 border border-red-400/30 text-white",
      minimal: "px-3 py-3",
      expanded: "px-5 py-3"
    },
    minimal: {
      container: "bg-gray-800 text-gray-100 rounded-md border border-gray-600",
      button: "hover:bg-gray-700 px-3 py-1.5 text-sm",
      deleteButton: "bg-red-600 hover:bg-red-700",
      minimal: "px-2 py-1.5",
      expanded: "px-3 py-1.5"
    },
    corporate: {
      container: "bg-slate-900 text-slate-100 rounded border border-slate-600 shadow-xl",
      button: "hover:bg-slate-700 rounded px-4 py-2.5 font-medium",
      deleteButton: "bg-red-600 hover:bg-red-700",
      minimal: "px-3 py-2.5",
      expanded: "px-4 py-2.5"
    },
    'soft-rounded': {
      container: "bg-white text-gray-700 rounded-2xl shadow-md border border-gray-200",
      button: "hover:bg-gray-50 rounded-xl px-4 py-2 font-medium transition-colors",
      deleteButton: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'micro-interactions': {
      container: "bg-white text-gray-900 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300",
      button: "hover:bg-blue-50 hover:text-blue-600 rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:scale-105",
      deleteButton: "bg-red-50 hover:bg-red-100 text-red-600 hover:scale-105 transition-transform",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'brutalist-bold': {
      container: "bg-black text-yellow-400 rounded-none border-4 border-yellow-400 shadow-[8px_8px_0px_#000000] font-bold transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform",
      button: "hover:bg-yellow-400 hover:text-black rounded-none px-6 py-3 font-black border-2 border-yellow-400 uppercase tracking-wider",
      deleteButton: "bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 font-black",
      minimal: "px-4 py-3",
      expanded: "px-6 py-3"
    },
    'organic-curves': {
      container: "bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-900 rounded-[2rem_1rem_2rem_1rem] shadow-lg border border-emerald-200/50",
      button: "hover:bg-emerald-200/60 rounded-[1.5rem_0.75rem_1.5rem_0.75rem] px-5 py-3 font-medium transition-all duration-300 border border-emerald-300/30",
      deleteButton: "bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 rounded-[1rem_2rem_1rem_2rem]",
      minimal: "px-5 py-3",
      expanded: "px-6 py-3"
    },
    'electric-neon': {
      container: "bg-black text-cyan-400 rounded-lg border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400/30",
      button: "hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] rounded-lg px-4 py-2 font-bold border border-cyan-400/50 transition-all duration-200",
      deleteButton: "bg-pink-500 hover:bg-pink-400 text-black border border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    },
    'warm-earth': {
      container: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 rounded-2xl shadow-lg border border-amber-200",
      button: "hover:bg-amber-100 rounded-xl px-5 py-3 font-medium transition-colors border border-amber-300/50 text-amber-800",
      deleteButton: "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300",
      minimal: "px-5 py-3",
      expanded: "px-6 py-3"
    },
    'retro-future': {
      container: "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-cyan-300 rounded-lg border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]",
      button: "hover:bg-cyan-500/20 hover:border-cyan-400 rounded-lg px-4 py-2 font-mono border border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]",
      deleteButton: "bg-pink-600 hover:bg-pink-500 text-white border border-pink-400",
      minimal: "px-4 py-3",
      expanded: "px-5 py-3"
    }
  };

  const styles = variantStyles[variant];
  const isMinimal = state === 'minimal';
  const padding = isMinimal ? styles.minimal : styles.expanded;

  // Get variant-specific icons and content
  const getVariantContent = () => {
    switch (variant) {
      case 'micro-interactions':
        return { icon: Edit, text: 'Edit All Rows' };
      case 'brutalist-bold':
        return { icon: Zap, text: 'EDIT ALL' };
      case 'organic-curves':
        return { icon: Shapes, text: 'Edit All Items' };
      case 'electric-neon':
        return { icon: Zap, text: 'EDIT ALL' };
      case 'warm-earth':
        return { icon: TreePine, text: 'Edit All' };
      case 'retro-future':
        return { icon: Rocket, text: 'EDIT_ALL_ROWS' };
      default:
        return { icon: Edit, text: 'Edit All Rows' };
    }
  };

  const { icon: VariantIcon, text: variantText } = getVariantContent();

  if (state === 'minimal') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding}`}>
        <button className={`${styles.button} flex items-center gap-2`}>
          <VariantIcon className="h-4 w-4" />
          {variantText}
        </button>
        <button className={`${styles.button} p-2`}>
          <ChevronUp className="h-4 w-4" />
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
            <button className={`${styles.button} bg-green-600 hover:bg-green-700 flex items-center gap-2`}>
              <Save className="h-4 w-4" />
              Apply Changes
            </button>
            <button className={`${styles.button} p-2`}>
              <X className="h-4 w-4" />
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
        <button className={`${styles.button} p-2`}>
          <Download className="h-4 w-4" />
        </button>
        <button className={`${styles.button} p-2`}>
          <Edit className="h-4 w-4" />
        </button>
        <button className={`${styles.button} ${styles.deleteButton} p-2`}>
          <Trash2 className="h-4 w-4" />
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
    { key: 'original', name: 'Original Blue', description: 'Current design with blue theme' },
    { key: 'glassmorphism', name: 'Glassmorphism', description: 'Modern glass effect with blur' },
    { key: 'glassmorphism-enhanced', name: 'Glassmorphism Enhanced', description: 'Enhanced contrast with blue accents' },
    { key: 'minimal', name: 'Minimal Gray', description: 'Clean, understated design' },
    { key: 'corporate', name: 'Corporate Dark', description: 'Professional dark theme' },
    { key: 'soft-rounded', name: 'Soft Rounded', description: 'Clean white design with rounded corners' },
    { key: 'micro-interactions', name: 'Micro Interactions', description: '2025 trend: Engaging hover animations and feedback' },
    { key: 'brutalist-bold', name: 'Brutalist Bold', description: '2025 trend: Bold, raw design with stark contrasts' },
    { key: 'organic-curves', name: 'Organic Curves', description: '2025 trend: Natural, flowing shapes and soft gradients' },
    { key: 'electric-neon', name: 'Electric Neon', description: '2025 trend: Vibrant cyber-inspired glow effects' },
    { key: 'warm-earth', name: 'Warm Earth', description: '2025 trend: Natural, sustainable color palette' },
    { key: 'retro-future', name: 'Retro Future', description: '2025 trend: 80s-inspired sci-fi aesthetic' }
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
            <li>• Consistent icon usage across all designs</li>
            <li>• Touch-friendly button sizing (minimum 44px targets)</li>
            <li>• Smooth transitions between states</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
