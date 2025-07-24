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
    <div className="flex gap-3 overflow-x-auto min-w-0">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
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
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
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
        className="h-8 text-sm px-4 whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Inactive
        <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
          {counts.inactive}
        </Badge>
      </Button>
    </div>
  )
}
