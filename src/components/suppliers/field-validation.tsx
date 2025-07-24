"use client"

import type React from "react"

import { AlertTriangle } from "lucide-react"

interface FieldValidationProps {
  error?: string
  children: React.ReactNode
}

export const FieldValidation = ({ error, children }: FieldValidationProps) => {
  if (!error) return <>{children}</>

  return (
    <div className="relative">
      {children}
      <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-red-600 text-xs whitespace-nowrap">
        <AlertTriangle className="h-3 w-3" />
        {error}
      </div>
    </div>
  )
}
