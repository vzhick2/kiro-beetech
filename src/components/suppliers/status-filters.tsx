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
    <div className="flex gap-2">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-7 text-xs"
      >
        All
        <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
          {counts.total}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
        className="h-7 text-xs"
      >
        Active
        <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
          {counts.active}
        </Badge>
      </Button>
      <Button
        variant={activeFilter === "inactive" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("inactive")}
        className="h-7 text-xs"
      >
        Inactive
        <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
          {counts.inactive}
        </Badge>
      </Button>
    </div>
  )
}
