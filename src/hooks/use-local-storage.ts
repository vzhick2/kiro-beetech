import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with user-specific keys
 * Provides automatic serialization/deserialization and SSR safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  userPrefix: string = 'user'
): [T, (value: T | ((val: T) => T)) => void] {
  // Create user-specific key
  const storageKey = `${userPrefix}_${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${storageKey}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Save to localStorage if we're in the browser
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${storageKey}":`, error);
    }
  };

  // Update state if localStorage changes (from another tab/window)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${storageKey}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  return [storedValue, setValue];
}

/**
 * Hook specifically for user column preferences
 */
export function useColumnPreferences<T>(
  tableId: string,
  defaultColumns: T
): [T, (columns: T | ((cols: T) => T)) => void] {
  return useLocalStorage(`table_columns_${tableId}`, defaultColumns, 'user');
}
