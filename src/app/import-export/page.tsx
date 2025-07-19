'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileText } from 'lucide-react'
import { CSVImportModal } from '@/components/import-export/csv-import-modal'

export default function ImportExportPage() {
  const [showQBOImport, setShowQBOImport] = useState(false)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Import / Export</h1>
        <p className="text-gray-600">
          Import and export your data, and download templates.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Import Data Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="h-5 w-5 text-slate-900" />
            <h3 className="text-lg font-semibold">Import Data</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Import Items (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Import Purchases (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Import Sales (CSV)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-green-50 border-green-200 hover:bg-green-100"
              onClick={() => setShowQBOImport(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import QBO Sales Data
            </Button>
          </div>
        </div>

        {/* Export Data Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="h-5 w-5 text-slate-900" />
            <h3 className="text-lg font-semibold">Export Data</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export All Items (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Purchase History (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Sales Report (CSV)
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-slate-900" />
          <h3 className="text-lg font-semibold">Download Templates</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Items Template
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Purchases Template
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Sales Template
          </Button>
        </div>
      </div>

      {/* QBO Import Modal */}
      <CSVImportModal
        isOpen={showQBOImport}
        onClose={() => setShowQBOImport(false)}
        onImportComplete={(result) => {
          console.log('QBO Import completed:', result)
          // Could refresh data or show success message
        }}
      />
    </div>
  )
}