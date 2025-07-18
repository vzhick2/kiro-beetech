import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileText } from 'lucide-react'

export default function DataPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">
            Import and export data, download templates
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Import Data Section */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="h-5 w-5 text-primary" />
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
            </div>
          </div>

          {/* Export Data Section */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Export Data</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export All Items
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Purchase History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Recent Changes
              </Button>
            </div>
          </div>

          {/* Templates Section */}
          <div className="rounded-lg border bg-card p-6 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Download Templates</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download properly formatted CSV templates to ensure correct import format
            </p>
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
        </div>
      </div>
    </AppLayout>
  )
}