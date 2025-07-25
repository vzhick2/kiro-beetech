"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StatusFiltersProps {
  activeFilter: "all" | "active" | "inactive"
  onFilterChange: (filter: "all" | "active" | "inactive") => void
  counts: {
    total: number
    active: number
    inactive: number
  }
}

export const StatusFilters = ({ activeFilter, onFilterChange, counts }: StatusFiltersProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto min-w-0 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200/60 shadow-sm">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        All
        <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
          {counts.total}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        Active
        <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
          {counts.active}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === "inactive" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("inactive")}
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        Inactive
        <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
          {counts.inactive}
        </Badge>
      </Button>
    </div>
  )
}
