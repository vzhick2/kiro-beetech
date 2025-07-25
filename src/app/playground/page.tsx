'use client';

import { useState } from 'react';
import { ChevronUp, Download, Trash2, Edit, Save, X } from 'lucide-react';

// Mock states for demonstration
type PlaygroundState = 'minimal' | 'selected' | 'spreadsheet';

interface PlaygroundControlsProps {
  state: PlaygroundState;
  selectedCount?: number;
  variant:
    | 'glassmorphism'
    | 'notion-inspired'
    | 'clean-minimal'
    | 'elegant-shadow'
    | 'spatial-glass';
}

function PlaygroundControls({
  state,
  selectedCount = 2,
  variant,
}: PlaygroundControlsProps) {
  // Base classes for all variants (includes mobile context menu prevention)
  const baseClasses =
    'absolute bottom-6 right-6 flex items-center gap-2 transition-all duration-200 shadow-lg select-none touch-manipulation';

  // Variant-specific styling
  const variantStyles = {
    glassmorphism: {
      container:
        'bg-black/30 backdrop-blur-md border border-white/30 text-white rounded-2xl shadow-lg',
      button:
        'hover:bg-white/20 active:bg-white/30 active:scale-95 rounded-xl px-3 py-2 backdrop-blur-sm text-white font-medium transition-all duration-150 select-none',
      deleteButton:
        'bg-red-500/90 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150 select-none',
      minimal: 'px-3 py-3',
      expanded: 'px-5 py-3',
    },
    'notion-inspired': {
      container:
        'bg-white text-gray-700 rounded-lg shadow-sm border border-gray-300',
      button:
        'hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-md px-3 py-2 font-medium transition-all duration-150 select-none',
      deleteButton:
        'bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150 select-none',
      minimal: 'px-3 py-2',
      expanded: 'px-4 py-2',
    },
    'clean-minimal': {
      container:
        'bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-sm border border-gray-200/50',
      button:
        'hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-lg px-3 py-2 font-medium transition-all duration-150 select-none',
      deleteButton:
        'bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150 select-none',
      minimal: 'px-3 py-2',
      expanded: 'px-4 py-2',
    },
    'elegant-shadow': {
      container:
        'bg-white text-gray-700 rounded-2xl shadow-xl border border-gray-100',
      button:
        'hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-xl px-4 py-2 font-medium transition-all duration-150 select-none',
      deleteButton:
        'bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150 select-none',
      minimal: 'px-4 py-3',
      expanded: 'px-6 py-3',
    },
    'spatial-glass': {
      container:
        'bg-gradient-to-r from-slate-500/20 to-gray-500/20 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 transform perspective-1000 rotateX-2',
      button:
        'hover:bg-white/20 active:bg-white/30 active:scale-95 rounded-xl px-3 py-2 backdrop-blur-sm text-white font-medium transition-all duration-150 select-none transform hover:translateZ-4',
      deleteButton:
        'bg-red-500/90 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white transition-all duration-150 select-none',
      minimal: 'px-4 py-3',
      expanded: 'px-6 py-3',
    },
  };

  // Helper function to get appropriate icons based on variant
  const getIcons = (variant: string) => {
    // Always use Lucide React icons for consistency
    return {
      edit: Edit,
      collapse: ChevronUp,
      close: X,
      save: Save,
      download: Download,
      trash: Trash2,
    };
  };

  const icons = getIcons(variant);
  const styles = variantStyles[variant];
  const isMinimal = state === 'minimal';
  const padding = isMinimal ? styles.minimal : styles.expanded;

  if (state === 'minimal') {
    return (
      <div className={`${baseClasses} ${styles.container} ${padding}`}>
        <button className={`${styles.button} flex items-center gap-2 group`}>
          <icons.edit className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
          Edit All Rows
        </button>
        <button
          className={`${styles.button} flex items-center justify-center h-[2.5rem] w-10 group`}
        >
          <icons.collapse
            className="h-6 w-6 transition-all duration-200 group-hover:scale-110 group-active:scale-95"
            strokeWidth={2.5}
          />
        </button>
      </div>
    );
  }

  if (state === 'spreadsheet') {
    return (
      <div
        className={`${baseClasses} ${styles.container} ${padding} w-full max-w-4xl left-1/2 transform -translate-x-1/2`}
      >
        <div className="flex items-center gap-4 w-full">
          <span className="font-semibold">Spreadsheet Mode</span>
          <span className="text-sm opacity-75">
            Tab: Next field • ↑↓: Navigate rows • Esc: Exit
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              className={`${styles.button} ${
                variant === 'notion-inspired'
                  ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 text-white'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95'
              } flex items-center gap-2 group transition-all duration-150`}
            >
              <icons.save className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
              Apply Changes
            </button>
            <button className={`${styles.button} p-2 group`}>
              <icons.close
                className="h-6 w-6 transition-all duration-200 group-hover:scale-110 group-active:scale-95"
                strokeWidth={2.5}
              />
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
          <icons.download className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
        <button className={`${styles.button} p-2 group`}>
          <icons.edit className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
        </button>
        <button className={`${styles.button} ${styles.deleteButton} p-2 group`}>
          <icons.trash className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-active:scale-95" />
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
    {
      key: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Modern glass effect with blur',
    },
    {
      key: 'notion-inspired',
      name: 'Notion Inspired',
      description: '2025 SaaS: Clean minimal with subtle borders',
    },
    {
      key: 'clean-minimal',
      name: 'Clean Minimal',
      description: 'Pure minimal design with subtle backdrop blur',
    },
    {
      key: 'elegant-shadow',
      name: 'Elegant Shadow',
      description: 'Sophisticated white design with dynamic shadows',
    },
    {
      key: 'spatial-glass',
      name: 'Spatial Glass',
      description:
        '2025 Future: 3D spatial design with neutral depth transforms',
    },
  ] as const;

  const states = [
    {
      key: 'minimal',
      name: 'Minimal (Edit All Rows)',
      description: 'When no items are selected',
    },
    {
      key: 'selected',
      name: 'Batch Actions',
      description: 'When items are selected for batch operations',
    },
    {
      key: 'spreadsheet',
      name: 'Spreadsheet Mode',
      description: 'When in spreadsheet editing mode',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Floating Controls Playground
          </h1>
          <p className="text-gray-600">
            Explore different design variations of the floating action bar in
            various states. All designs are optimized for desktop views.
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
        </div>

        {/* Design Variants Grid */}
        <div className="grid gap-8">
          {variants.map(({ key, name, description }) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              <div className="relative p-6 bg-gray-100 min-h-[400px]">
                {/* Sample Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-700">
                    <div>Supplier Name</div>
                    <div>Contact</div>
                    <div>Location</div>
                    <div>Items</div>
                    <div>Status</div>
                  </div>
                  {[
                    'Acme Corp',
                    'Fresh Supplies',
                    'Global Foods',
                    'Local Farm',
                    'Premium Goods',
                    'Quick Supply',
                    'Bulk Mart',
                    'Specialty Co',
                  ].map(supplier => (
                    <div
                      key={supplier}
                      className="grid grid-cols-5 gap-4 p-4 border-b hover:bg-gray-50"
                    >
                      <div className="font-medium">{supplier}</div>
                      <div className="text-gray-600">
                        contact@{supplier.toLowerCase().replace(' ', '')}.com
                      </div>
                      <div className="text-gray-600">Location</div>
                      <div className="text-gray-600">12</div>
                      <div>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </div>
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
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Implementation Notes</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              • All variants use the same positioning logic (absolute bottom-6
              right-6)
            </li>
            <li>• Responsive width adjustments based on content state</li>
            <li>
              • <strong>Consistent Icons:</strong> All variants now use clean
              Lucide React icons
            </li>
            <li>
              • <strong>Fixed Icon Sizing:</strong> Collapse icons now h-6 w-6
              (24px) for better visibility and touch targets
            </li>
            <li>
              • Enhanced stroke-width (2.5) for collapse/close icons for better
              visual weight
            </li>
            <li>• Touch-friendly button sizing (minimum 44px targets)</li>
            <li>
              • <strong>Mobile Optimized:</strong> Context menu prevention with
              select-none and touch-manipulation
            </li>
            <li>
              • Smooth transitions between states with expanding hover
              animations
            </li>
            <li>
              • Click feedback with scale-down effect (active:scale-95) for
              modern SaaS feel
            </li>
            <li>
              • All animations use duration-150-400 for responsive, contextual
              interactions
            </li>
            <li>
              • <strong>5 Total Variants:</strong> Clean, consistent designs
              with unified iconography
            </li>
          </ul>
        </div>

        {/* Modern Click Interaction Standards */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Modern Click Interaction Standards
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>Modern SaaS Practice:</strong> Subtle click feedback is
              standard - scale-down (95%) on active state provides immediate
              tactile response without being distracting.
            </p>
            <p>
              <strong>Why Click States Matter:</strong> They bridge the gap
              between hover intent and action completion, providing crucial user
              confidence in touch interfaces.
            </p>
            <p>
              <strong>Implementation:</strong>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                active:scale-95 active:bg-[color] transition-all duration-150
              </code>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Scale-down creates &quot;button press&quot; feeling</li>
              <li>• Slightly darker background confirms interaction</li>
              <li>• Fast 150ms transition feels responsive, not laggy</li>
              <li>• Works across mouse clicks and touch taps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
