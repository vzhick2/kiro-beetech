"use client"

import { useState, useMemo } from "react"
import type { Supplier, EditingRow, NewSupplier, ValidationError } from "@/types/data-table"
import { formatPhoneNumber, cleanEmail, formatWebsite, detectDuplicates } from "@/utils/formatting"

// Deterministic pseudo-random function to avoid hydration mismatches
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Mock data for suppliers
const generateMockData = (): Supplier[] => {
  const statuses: ("active" | "inactive")[] = ["active", "inactive"]
  const companies = [
    "Acme Corp",
    "Global Tech",
    "Supply Co",
    "Materials Inc",
    "Parts Plus",
    "Industrial Solutions",
    "Quality Goods",
    "Premier Supply",
    "Elite Materials",
    "Pro Components",
  ]

  const streets = ["Main St", "Oak Ave", "Pine Rd", "Elm Dr"]
  const cities = ["New York", "Los Angeles", "Chicago", "Houston"]
  const states = ["NY", "CA", "IL", "TX"]
  const notes = ["Good quality products.", "Fast shipping.", "Competitive pricing.", "Excellent customer service."]

  return Array.from({ length: 150 }, (_, i) => {
    const seed = i + 1
    const phoneNum1 = Math.floor(seededRandom(seed * 1000) * 900) + 100
    const phoneNum2 = Math.floor(seededRandom(seed * 2000) * 9000) + 1000
    const addressNum = Math.floor(seededRandom(seed * 3000) * 9999) + 1
    const streetIndex = Math.floor(seededRandom(seed * 4000) * streets.length)
    const cityIndex = Math.floor(seededRandom(seed * 5000) * cities.length)
    const stateIndex = Math.floor(seededRandom(seed * 6000) * states.length)
    const zipCode = Math.floor(seededRandom(seed * 7000) * 90000) + 10000
    const statusIndex = Math.floor(seededRandom(seed * 8000) * statuses.length)
    const noteIndex = Math.floor(seededRandom(seed * 9000) * notes.length)
    const yearOffset = Math.floor(seededRandom(seed * 10000) * 8)
    const hasNotes = seededRandom(seed * 11000) > 0.7
    const daysAgo = Math.floor(seededRandom(seed * 12000) * 365)

    return {
      id: `supplier-${seed}`,
      name: `${companies[i % companies.length]} ${Math.floor(i / companies.length) + 1}`,
      website: `https://${companies[i % companies.length].toLowerCase().replace(/\s+/g, "")}.com`,
      email: `contact${seed}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, "")}.com`,
      phone: `+1 (555) ${String(phoneNum1).padStart(3, '0')}-${String(phoneNum2).padStart(4, '0')}`,
      address: `${addressNum} ${streets[streetIndex]}, ${cities[cityIndex]}, ${states[stateIndex]} ${zipCode}`,
      notes: hasNotes ? `Reliable supplier since ${2015 + yearOffset}. ${notes[noteIndex]}` : "",
      status: statuses[statusIndex],
      createdAt: new Date(new Date('2024-01-01').getTime() + (daysAgo * 24 * 60 * 60 * 1000)),
    }
  })
}

// Mock purchase history data
const generatePurchaseHistory = (supplierId: string) => {
  const items = [
    "Office Supplies",
    "Raw Materials",
    "Equipment",
    "Software License",
    "Maintenance Service",
    "Consulting",
    "Hardware Components",
    "Packaging Materials",
    "Tools",
    "Safety Equipment",
  ]

  // Use supplier ID to create a deterministic seed
  const seed = supplierId.split('-')[1] ? parseInt(supplierId.split('-')[1]) : 1
  const historyLength = Math.floor(seededRandom(seed * 100) * 20) + 5

  return Array.from({ length: historyLength }, (_, i) => {
    const itemIndex = Math.floor(seededRandom((seed + i) * 200) * items.length)
    const cost = Math.floor(seededRandom((seed + i) * 300) * 10000) + 100
    const daysAgo = Math.floor(seededRandom((seed + i) * 400) * 365)

    return {
      id: `purchase-${supplierId}-${i + 1}`,
      item: items[itemIndex],
      cost,
      date: new Date(new Date('2024-01-01').getTime() + (daysAgo * 24 * 60 * 60 * 1000)),
    }
  })
}

// Simple date matching function
const matchesDateQuery = (date: Date, query: string): boolean => {
  const searchTerm = query.toLowerCase().trim()

  // Check if query looks like a date search (contains numbers)
  if (!/\d/.test(searchTerm)) return false

  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")

  // Simple date format checks
  const dateStrings = [
    year, // 2024
    `${month}/${year}`, // 01/2024
    `${Number(month)}/${year}`, // 1/2024
    `${month}/${day}/${year}`, // 01/15/2024
    `${Number(month)}/${Number(day)}/${year}`, // 1/15/2024
    date.toLocaleDateString(), // Browser default format
  ]

  return dateStrings.some((dateStr) => dateStr.includes(searchTerm))
}

// Enhanced search functionality
const matchesSearchQuery = (item: Supplier, query: string): boolean => {
  if (!query.trim()) return true

  const searchTerm = query.toLowerCase().trim()

  // Check date match first
  if (matchesDateQuery(item.createdAt, searchTerm)) {
    return true
  }

  // Create searchable text for regular fields
  const searchableText = [
    item.name,
    item.website || "",
    item.email || "",
    item.phone || "",
    item.address || "",
    item.notes || "",
    item.status,
    // Add phone number without formatting for easier searching
    item.phone?.replace(/\D/g, "") || "",
  ]
    .join(" ")
    .toLowerCase()

  return searchableText.includes(searchTerm)
}

export const useDataTable = () => {
  const [data, setData] = useState<Supplier[]>(generateMockData())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active")
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null)
  const [savingRows, setSavingRows] = useState<Set<string>>(new Set())
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [duplicateWarning, setDuplicateWarning] = useState<{
    show: boolean
    matches: Array<{ type: "name" | "email"; value: string }>
    onProceed: () => void
  } | null>(null)

  const filteredData = useMemo(() => {
    let filtered = data

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply search with date support
    if (globalFilter) {
      filtered = filtered.filter((item) => matchesSearchQuery(item, globalFilter))
    }

    return filtered
  }, [data, globalFilter, statusFilter])

  const statusCounts = useMemo(() => {
    const active = data.filter((item) => item.status === "active").length
    const inactive = data.filter((item) => item.status === "inactive").length
    return { total: data.length, active, inactive }
  }, [data])

  const validateSupplier = (supplierData: Partial<NewSupplier>): ValidationError[] => {
    const errors: ValidationError[] = []

    if (supplierData.name) {
      const exactNameMatch = data.find((supplier) => supplier.name.toLowerCase() === supplierData.name!.toLowerCase())
      if (exactNameMatch) {
        errors.push({ field: "name", message: "Already exists" })
      }
    }

    return errors
  }

  const updateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    setSavingRows((prev) => new Set(prev).add(id))

    try {
      const formattedData = { ...supplierData }
      if (formattedData.phone) {
        formattedData.phone = formatPhoneNumber(formattedData.phone)
      }
      if (formattedData.email) {
        formattedData.email = cleanEmail(formattedData.email)
      }
      if (formattedData.website) {
        formattedData.website = formatWebsite(formattedData.website)
      }

      await new Promise((resolve) => setTimeout(resolve, 300))

      setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...formattedData } : item)))
      setEditingRow(null)
    } catch (err) {
      setError("Failed to update supplier")
    } finally {
      setSavingRows((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Optimized bulk update function
  const updateMultipleSuppliers = async (updates: Array<{ id: string; data: Partial<Supplier> }>) => {
    setLoading(true)
    try {
      const updatePromises = updates.map(async ({ id, data: supplierData }) => {
        const formattedData = { ...supplierData }
        if (formattedData.phone) {
          formattedData.phone = formatPhoneNumber(formattedData.phone)
        }
        if (formattedData.email) {
          formattedData.email = cleanEmail(formattedData.email)
        }
        if (formattedData.website) {
          formattedData.website = formatWebsite(formattedData.website)
        }
        return { id, formattedData }
      })

      await new Promise((resolve) => setTimeout(resolve, 500))
      const results = await Promise.all(updatePromises)

      setData((prev) =>
        prev.map((item) => {
          const update = results.find((r) => r.id === item.id)
          return update ? { ...item, ...update.formattedData } : item
        }),
      )
    } catch (err) {
      setError("Failed to update suppliers")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addSupplier = async (supplierData: NewSupplier) => {
    const formattedData = {
      ...supplierData,
      phone: supplierData.phone ? formatPhoneNumber(supplierData.phone) : "",
      email: cleanEmail(supplierData.email),
      website: formatWebsite(supplierData.website),
    }

    const errors = validateSupplier(formattedData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      throw new Error("Validation failed")
    }

    const duplicateCheck = detectDuplicates(formattedData, data)
    if (duplicateCheck.hasSimilarMatch && !duplicateCheck.hasExactMatch) {
      return new Promise<void>((resolve, reject) => {
        setDuplicateWarning({
          show: true,
          matches: duplicateCheck.similarMatches,
          onProceed: async () => {
            setDuplicateWarning(null)
            try {
              await performAddSupplier(formattedData)
              resolve()
            } catch (error) {
              reject(error)
            }
          },
        })
      })
    }

    return performAddSupplier(formattedData)
  }

  const performAddSupplier = async (supplierData: NewSupplier) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Use a deterministic ID based on data to avoid hydration issues
      const idSeed = supplierData.name.length + supplierData.email.length
      const newSupplier: Supplier = {
        id: `supplier-new-${idSeed}-${data.length + 1}`,
        ...supplierData,
        address: "",
        notes: "",
        createdAt: new Date(),
      }

      setData((prev) => [newSupplier, ...prev])
      setValidationErrors([])
    } catch (err) {
      setError("Failed to add supplier")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSuppliers = async (ids: string[]) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData((prev) => prev.filter((item) => !ids.includes(item.id)))
    } catch (err) {
      setError("Failed to delete suppliers")
    } finally {
      setLoading(false)
    }
  }

  const archiveSuppliers = async (ids: string[]) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, status: "inactive" as const } : item)))
    } catch (err) {
      setError("Failed to archive suppliers")
    } finally {
      setLoading(false)
    }
  }

  const unarchiveSuppliers = async (ids: string[]) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, status: "active" as const } : item)))
    } catch (err) {
      setError("Failed to unarchive suppliers")
    } finally {
      setLoading(false)
    }
  }

  const exportSuppliers = async (ids: string[], format: "csv" | "excel") => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const suppliersToExport = data.filter((item) => ids.includes(item.id))
      console.log(`Exporting ${suppliersToExport.length} suppliers as ${format}`)
    } catch (err) {
      setError("Failed to export suppliers")
    } finally {
      setLoading(false)
    }
  }

  const getPurchaseHistory = (supplierId: string) => {
    return generatePurchaseHistory(supplierId)
  }

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  const refetch = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setData(generateMockData())
      setLoading(false)
    }, 500)
  }

  return {
    data: filteredData,
    allData: data,
    loading,
    error,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    statusCounts,
    editingRow,
    setEditingRow,
    savingRows,
    validationErrors,
    setValidationErrors,
    expandedRows,
    toggleRowExpansion,
    duplicateWarning,
    setDuplicateWarning,
    updateSupplier,
    updateMultipleSuppliers,
    addSupplier,
    deleteSuppliers,
    archiveSuppliers,
    unarchiveSuppliers,
    exportSuppliers,
    getPurchaseHistory,
    refetch,
  }
}
