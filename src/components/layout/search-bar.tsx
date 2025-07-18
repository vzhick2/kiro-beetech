'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const pathname = usePathname()

  // Context-aware placeholder text
  const getPlaceholder = () => {
    switch (pathname) {
      case '/items':
        return 'Search items by name or SKU...'
      case '/purchases':
        return 'Search by supplier, PO number...'
      case '/recipes':
        return 'Search recipes or ingredients...'
      case '/batches':
        return 'Search batches by recipe or date...'
      case '/sales':
        return 'Search sales by item or period...'
      default:
        return 'Search anything or type a command...'
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search:', searchValue)
  }

  const handleClear = () => {
    setSearchValue('')
    setIsExpanded(false)
  }

  return (
    <>
      {/* Desktop: Always visible search bar */}
      <div className={cn('hidden md:flex flex-1 max-w-md mx-4', className)}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-600 rounded-md bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </form>
      </div>

      {/* Mobile: Search icon that expands */}
      <div className="md:hidden">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="h-10 w-10 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
          >
            <Search className="h-5 w-5" strokeWidth={2.5} />
            <span className="sr-only">Search</span>
          </Button>
        ) : (
          <div className="fixed inset-x-0 top-16 z-50 bg-slate-800 border-b border-slate-700 p-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={getPlaceholder()}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-12 py-2 text-sm border border-slate-600 rounded-md bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile overlay when search is expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={handleClear}
        />
      )}
    </>
  )
}