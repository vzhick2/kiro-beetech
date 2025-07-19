import { Button } from '@/components/ui/button'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'

export default function ItemsPage() {
  // Honeybee cosmetics business sample data
  const items = [
    { id: 'ITEM-001', name: 'Raw Honey (Wildflower)', type: 'Ingredient', sku: 'HONEY-WF-001', stock: 150, unit: 'lbs', cost: 8.50, supplier: 'Golden Hive Apiaries' },
    { id: 'ITEM-002', name: 'Beeswax (Pure White)', type: 'Ingredient', sku: 'BEESWAX-WH-001', stock: 80, unit: 'lbs', cost: 12.99, supplier: 'Golden Hive Apiaries' },
    { id: 'ITEM-003', name: 'Propolis Extract (Liquid)', type: 'Ingredient', sku: 'PROP-LIQ-001', stock: 25, unit: 'fl oz', cost: 45.00, supplier: 'Bee Wellness Co.' },
    { id: 'ITEM-004', name: 'Bee Pollen (Granules)', type: 'Ingredient', sku: 'POLLEN-GR-001', stock: 40, unit: 'lbs', cost: 28.50, supplier: 'Mountain Meadow Bees' },
    { id: 'ITEM-005', name: 'Royal Jelly (Fresh)', type: 'Ingredient', sku: 'RJ-FRESH-001', stock: 12, unit: 'oz', cost: 125.00, supplier: 'Premium Bee Products' },
    { id: 'ITEM-006', name: 'Coconut Oil (Organic)', type: 'Ingredient', sku: 'COCO-ORG-001', stock: 200, unit: 'lbs', cost: 6.75, supplier: 'Tropical Oils Ltd' },
    { id: 'ITEM-007', name: 'Shea Butter (Raw)', type: 'Ingredient', sku: 'SHEA-RAW-001', stock: 75, unit: 'lbs', cost: 9.25, supplier: 'African Naturals' },
    { id: 'ITEM-008', name: 'Jojoba Oil (Golden)', type: 'Ingredient', sku: 'JOJOBA-GD-001', stock: 35, unit: 'liters', cost: 85.00, supplier: 'Desert Botanicals' },
    { id: 'ITEM-009', name: 'Lavender Essential Oil', type: 'Ingredient', sku: 'EO-LAV-001', stock: 18, unit: 'fl oz', cost: 32.50, supplier: 'Mountain Essentials' },
    { id: 'ITEM-010', name: 'Chamomile Extract', type: 'Ingredient', sku: 'CHAM-EXT-001', stock: 22, unit: 'fl oz', cost: 28.75, supplier: 'Herbal Harmony' },
    { id: 'ITEM-011', name: 'Vitamin E Oil (Natural)', type: 'Ingredient', sku: 'VIT-E-NAT-001', stock: 30, unit: 'fl oz', cost: 18.99, supplier: 'Pure Vitamins Co.' },
    { id: 'ITEM-012', name: 'Rosehip Seed Oil', type: 'Ingredient', sku: 'ROSE-SEED-001', stock: 28, unit: 'fl oz', cost: 42.50, supplier: 'Botanical Blends' },
    { id: 'ITEM-013', name: 'Calendula Petals (Dried)', type: 'Ingredient', sku: 'CAL-PET-001', stock: 15, unit: 'lbs', cost: 24.00, supplier: 'Garden Herbs Co.' },
    { id: 'ITEM-014', name: 'Manuka Honey (UMF 15+)', type: 'Ingredient', sku: 'MANUKA-15-001', stock: 8, unit: 'lbs', cost: 195.00, supplier: 'New Zealand Naturals' },
    { id: 'ITEM-015', name: 'Aloe Vera Gel (99% Pure)', type: 'Ingredient', sku: 'ALOE-99-001', stock: 45, unit: 'liters', cost: 15.50, supplier: 'Desert Botanicals' },
    { id: 'ITEM-016', name: 'Glass Jars (2oz, Amber)', type: 'Packaging', sku: 'JAR-2OZ-AMB-001', stock: 2500, unit: 'pcs', cost: 0.85, supplier: 'Artisan Containers' },
    { id: 'ITEM-017', name: 'Lip Balm Tubes (Kraft)', type: 'Packaging', sku: 'LIP-TUBE-KR-001', stock: 1500, unit: 'pcs', cost: 0.32, supplier: 'Eco Packaging Pro' },
    { id: 'ITEM-018', name: 'Pump Bottles (4oz, Frosted)', type: 'Packaging', sku: 'PUMP-4OZ-FR-001', stock: 800, unit: 'pcs', cost: 1.75, supplier: 'Luxury Containers' },
    { id: 'ITEM-019', name: 'Honeycomb Labels (Kraft)', type: 'Packaging', sku: 'LABEL-HC-KR-001', stock: 5000, unit: 'pcs', cost: 0.12, supplier: 'Bee Design Studio' },
    { id: 'ITEM-020', name: 'Gift Boxes (Hexagon, Small)', type: 'Packaging', sku: 'BOX-HEX-SM-001', stock: 300, unit: 'pcs', cost: 2.25, supplier: 'Artisan Containers' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Items</h1>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
          
        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredients, packaging, or bee products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
            <option>All Types</option>
            <option>Ingredient</option>
            <option>Packaging</option>
            <option>Bee Product</option>
          </select>
          <Button variant="outline" className="flex items-center border-amber-200 hover:bg-amber-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Responsive Table Container - Modern 2025 Pattern */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 text-sm text-gray-900">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.type === 'Ingredient' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      item.stock < 20 ? 'text-red-600' : 
                      item.stock < 50 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 text-sm text-gray-500">
                    <div className="truncate max-w-32 lg:max-w-none">{item.supplier}</div>
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Modern 2025 Pattern */}
        <div className="md:hidden divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{item.sku}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.type === 'Ingredient' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className={`ml-2 font-medium ${
                    item.stock < 20 ? 'text-red-600' : 
                    item.stock < 50 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {item.stock} {item.unit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Cost:</span>
                  <span className="ml-2 font-medium text-gray-900">${item.cost.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Supplier:</span>
                  <span className="ml-2 text-gray-900 text-xs">{item.supplier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}