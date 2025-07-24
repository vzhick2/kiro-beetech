export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Format US phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  // Return original if not a standard format
  return phone
}

export const cleanEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

export const formatWebsite = (website: string): string => {
  const cleaned = website.trim().toLowerCase()
  if (!cleaned) return ""

  // Add https:// if no protocol
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    return `https://${cleaned}`
  }

  return cleaned
}

export const detectDuplicates = (
  newSupplier: { name: string; email: string },
  existingSuppliers: Array<{ name: string; email?: string }>,
): {
  hasExactMatch: boolean
  hasSimilarMatch: boolean
  exactMatches: Array<{ type: "name" | "email"; value: string }>
  similarMatches: Array<{ type: "name" | "email"; value: string }>
} => {
  const exactMatches: Array<{ type: "name" | "email"; value: string }> = []
  const similarMatches: Array<{ type: "name" | "email"; value: string }> = []

  // Check for exact name matches
  const exactNameMatch = existingSuppliers.find(
    (supplier) => supplier.name.toLowerCase() === newSupplier.name.toLowerCase(),
  )
  if (exactNameMatch) {
    exactMatches.push({ type: "name", value: exactNameMatch.name })
  }

  // Check for exact email matches
  const exactEmailMatch = existingSuppliers.find(
    (supplier) => supplier.email?.toLowerCase() === newSupplier.email.toLowerCase(),
  )
  if (exactEmailMatch) {
    exactMatches.push({ type: "email", value: exactEmailMatch.email! })
  }

  // Check for similar names (only if no exact match)
  if (!exactNameMatch) {
    const similarNameMatch = existingSuppliers.find((supplier) => {
      const similarity = calculateSimilarity(supplier.name.toLowerCase(), newSupplier.name.toLowerCase())
      return similarity > 0.8 && similarity < 1
    })
    if (similarNameMatch) {
      similarMatches.push({ type: "name", value: similarNameMatch.name })
    }
  }

  return {
    hasExactMatch: exactMatches.length > 0,
    hasSimilarMatch: similarMatches.length > 0,
    exactMatches,
    similarMatches,
  }
}

const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0))

  for (let i = 0; i <= str1.length; i++) matrix[0]![i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j]![0] = j

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j]![i] = Math.min(
        matrix[j]![i - 1]! + 1, // deletion
        matrix[j - 1]![i]! + 1, // insertion
        matrix[j - 1]![i - 1]! + indicator, // substitution
      )
    }
  }

  return matrix[str2.length]![str1.length]!
}
