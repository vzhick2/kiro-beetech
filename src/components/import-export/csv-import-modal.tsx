'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { previewQBOImport, processQBOImport } from '@/app/actions/csv-import'

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete?: (result: unknown) => void
}

interface PreviewData {
  totalRows: number
  validRows: number
  items: Array<{
    itemName: string
    totalQuantity: number
    totalRevenue: number
    saleCount: number
    dateRange: { start: Date; end: Date }
  }>
  dateRange: { start: number; end: number }
}

interface ImportResult {
  itemsCreated: number
  itemsUpdated: number
  salesLogged: number
  totalProcessed: number
  successRate: string
  errors: string[]
}

export function CSVImportModal({ isOpen, onClose, onImportComplete }: CSVImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload')
  const [csvContent, setCsvContent] = useState('')
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [createMissingItems, setCreateMissingItems] = useState(true)
  const [effectiveDate, setEffectiveDate] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrors(['Please select a CSV file'])
      return
    }

    setIsLoading(true)
    setErrors([])

    try {
      const content = await file.text()
      setCsvContent(content)
      
      // Auto-preview the file
      const formData = new FormData()
      formData.append('csvContent', content)
      const previewResult = await previewQBOImport(formData)
      
      if (previewResult.success && previewResult.data) {
        setPreviewData(previewResult.data.summary)
        setStep('preview')
      } else {
        setErrors([(previewResult as any).error || 'Failed to preview CSV file'])
      }
    } catch {
      setErrors(['Failed to read file'])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = async () => {
    if (!csvContent) return

    setIsLoading(true)
    setErrors([])

    try {
      const formData = new FormData()
      formData.append('csvContent', csvContent)
      
      const result = await previewQBOImport(formData)
      
      if (result.success && result.data) {
        setPreviewData(result.data.summary)
        setStep('preview')
      } else {
        setErrors([(result as any).error || 'Failed to preview CSV data'])
      }
    } catch {
      setErrors(['Failed to preview CSV data'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!csvContent) return

    setIsLoading(true)
    setStep('importing')
    setErrors([])

    try {
      const formData = new FormData()
      formData.append('csvContent', csvContent)
      formData.append('createMissingItems', createMissingItems.toString())
      if (effectiveDate) {
        formData.append('effectiveDate', effectiveDate)
      }
      
      const result = await processQBOImport(formData)
      
      if (result.success && result.data) {
        setImportResult(result.data.results)
        setStep('complete')
        onImportComplete?.(result.data)
      } else {
        setErrors([(result as any).error || 'Failed to import CSV data'])
        setStep('preview')
      }
    } catch {
      setErrors(['Failed to import CSV data'])
      setStep('preview')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setCsvContent('')
    setPreviewData(null)
    setImportResult(null)
    setErrors([])
    setCreateMissingItems(true)
    setEffectiveDate('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import QuickBooks Online Sales Data
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: File Upload */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Upload a CSV file exported from QuickBooks Online containing sales data.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="mb-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Select CSV File
                </Button>
                
                <p className="text-sm text-gray-500">
                  Supported format: QBO Sales Export CSV
                </p>
              </div>
            </div>

            {csvContent && (
              <div className="space-y-4">
                <h3 className="font-semibold">CSV Content Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {csvContent.slice(0, 500)}...
                  </pre>
                </div>
                
                <Button onClick={handlePreview} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Preview Data
                </Button>
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Errors Found</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Data Preview */}
        {step === 'preview' && previewData && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Import Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Total Rows:</span>
                  <div className="font-semibold">{previewData.totalRows}</div>
                </div>
                <div>
                  <span className="text-blue-600">Valid Rows:</span>
                  <div className="font-semibold">{previewData.validRows}</div>
                </div>
                <div>
                  <span className="text-blue-600">Items:</span>
                  <div className="font-semibold">{previewData.items.length}</div>
                </div>
                <div>
                  <span className="text-blue-600">Date Range:</span>
                  <div className="font-semibold">
                    {formatDate(previewData.dateRange.start)} - {formatDate(previewData.dateRange.end)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Items to Process</h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-3">Item Name</th>
                      <th className="text-right p-3">Quantity</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-right p-3">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 font-medium">{item.itemName}</td>
                        <td className="p-3 text-right">{item.totalQuantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.totalRevenue)}</td>
                        <td className="p-3 text-right">{item.saleCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="createMissingItems"
                  checked={createMissingItems}
                  onChange={(e) => setCreateMissingItems(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="createMissingItems" className="text-sm">
                  Create missing items automatically
                </label>
              </div>

              <div>
                <label htmlFor="effectiveDate" className="block text-sm font-medium mb-1">
                  Effective Date (Optional)
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use dates from CSV file
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Start Over
              </Button>
              <Button onClick={handleImport} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Import Data
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === 'importing' && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Importing Sales Data...</h3>
            <p className="text-gray-600">Please wait while we process your data.</p>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && importResult && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Import Completed Successfully!</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Items Created:</span>
                  <div className="font-semibold">{importResult.itemsCreated}</div>
                </div>
                <div>
                  <span className="text-green-600">Items Updated:</span>
                  <div className="font-semibold">{importResult.itemsUpdated}</div>
                </div>
                <div>
                  <span className="text-green-600">Sales Logged:</span>
                  <div className="font-semibold">{importResult.salesLogged}</div>
                </div>
                <div>
                  <span className="text-green-600">Success Rate:</span>
                  <div className="font-semibold">{importResult.successRate}</div>
                </div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Some Errors Occurred</span>
                </div>
                <div className="text-sm text-yellow-700 max-h-32 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="mb-1">• {error}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Import Another File
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 