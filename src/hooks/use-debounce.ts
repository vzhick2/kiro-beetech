"use client"

import { useState, useEffect, useCallback } from "react"

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const useDebouncedSearch = (initialValue: string = "", delay: number = 200) => {
  const [searchValue, setSearchValue] = useState(initialValue)
  const debouncedSearchValue = useDebounce(searchValue, delay)

  const updateSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchValue("")
  }, [])

  return {
    searchValue,
    debouncedSearchValue,
    updateSearch,
    clearSearch
  }
}
