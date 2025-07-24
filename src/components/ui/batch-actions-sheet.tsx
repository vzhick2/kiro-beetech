"use client"

import { useState, useEffect } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Check,
  X,
  Loader2,
  Users
} from "lucide-react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface BatchActionsSheetProps {
  selectedCount: number
  hasInactiveSelected: boolean
  onBulkExport: () => void
  onBulkArchive: () => void
  onBulkUnarchive: () => void
  onBulkDelete: () => void
  onClearSelection?: () => void
  loading?: boolean
  triggerClassName?: string
}

export const BatchActionsSheet = ({
  selectedCount,
  hasInactiveSelected,
  onBulkExport,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onClearSelection,
  loading = false,
  triggerClassName = ""
}: BatchActionsSheetProps) => {
  const { isMobile } = useMobileDetection()
  const [isOpen, setIsOpen] = useState(false)

  // Auto-close when selection is cleared
  useEffect(() => {
    if (selectedCount === 0 && isOpen) {
      setIsOpen(false)
    }
  }, [selectedCount, isOpen])

  if (selectedCount === 0 || !isMobile) {
    return null
  }

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 ${triggerClassName}`}
        >
          <Users className="h-4 w-4 mr-2" />
          {selectedCount} Selected
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
            Actions
          </Badge>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-auto max-h-[80vh] rounded-t-xl border-t-0"
      >
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Batch Actions
          </SheetTitle>
          <SheetDescription>
            {selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Export Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export & Backup
            </h4>
            <Button
              variant="outline"
              className="w-full justify-start h-12 transition-all duration-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => handleAction(onBulkExport)}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Export Selected</div>
                <div className="text-xs text-gray-500">Download as CSV file</div>
              </div>
            </Button>
          </div>

          <Separator />

          {/* Status Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Status Management
            </h4>
            
            <Button
              variant="outline"
              className="w-full justify-start h-12 transition-all duration-200 hover:bg-orange-50 hover:border-orange-300"
              onClick={() => handleAction(onBulkArchive)}
              disabled={loading}
            >
              <Archive className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Archive Suppliers</div>
                <div className="text-xs text-gray-500">Hide from active lists</div>
              </div>
            </Button>

            {hasInactiveSelected && (
              <Button
                variant="outline"
                className="w-full justify-start h-12 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleAction(onBulkUnarchive)}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Restore Suppliers</div>
                  <div className="text-xs text-gray-500">Make active again</div>
                </div>
              </Button>
            )}
          </div>

          <Separator />

          {/* Destructive Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-red-700 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </h4>
            
            <Button
              variant="outline"
              className="w-full justify-start h-12 border-red-200 text-red-700 transition-all duration-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleAction(onBulkDelete)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Delete Permanently</div>
                <div className="text-xs text-red-500">This cannot be undone</div>
              </div>
            </Button>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {onClearSelection && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 transition-all duration-200"
                onClick={() => {
                  onClearSelection()
                  setIsOpen(false)
                }}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 transition-all duration-200"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Done
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
