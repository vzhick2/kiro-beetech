/**
 * Generate display IDs for user-facing identifiers
 */

export function generatePurchaseDisplayId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `PO-${year}${month}${day}-${random}`;
}

export function generateBatchDisplayId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `BATCH-${year}${month}${day}-${random}`;
}

export function generateSKU(name: string, type: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const prefix = type.substring(0, 3).toUpperCase();
  const namePart = cleanName.substring(0, 6);
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  return `${prefix}-${namePart}-${random}`;
}
