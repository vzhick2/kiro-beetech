'use client';

import { useState } from 'react';
import { ChevronUp, Download, Trash2, Edit, Save, X } from 'lucide-react';

// Mock states for demonstration
type PlaygroundState = 'minimal' | 'selected' | 'spreadsheet';

interface PlaygroundControlsProps {
  state: PlaygroundState;
  selectedCount?: number;
  variant: 'original' | 'glassmorphism' | 'neon' | 'minimal' | 'corporate';
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
      container: "bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl",
      button: "hover:bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm",
      deleteButton: "bg-red-500/80 hover:bg-red-500",
      minimal: "px-3 py-3",
      expanded: "px-5 py-3"
    },
    neon: {
      container: "bg-black border-2 border-cyan-400 text-cyan-400 rounded-lg shadow-cyan-400/50 shadow-lg",
      button: "hover:bg-cyan-400/20 rounded border border-cyan-400/50 px-3 py-2",
      deleteButton: "bg-red-500 border-red-400 text-red-100 hover:bg-red-600",
      minimal: "px-3 py-2",
      expanded: "px-4 py-2"
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
    }
  };

  const styles = variantStyles[variant];
  const isMinimal = state === 'minimal';
  const padding = isMinimal ? styles.minimal : styles.expanded;

  if (state === 'minimal') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding}`}>
        <button className={`${styles.button} flex items-center gap-2`}>
          <Edit className="h-4 w-4" />
          Edit All Rows
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
    { key: 'neon', name: 'Neon Cyber', description: 'Cyberpunk-inspired neon borders' },
    { key: 'minimal', name: 'Minimal Gray', description: 'Clean, understated design' },
    { key: 'corporate', name: 'Corporate Dark', description: 'Professional dark theme' }
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
                {/* Background pattern to simulate page content */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-12 gap-4 p-6">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="h-6 bg-gray-400 rounded"></div>
                    ))}
                  </div>
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
