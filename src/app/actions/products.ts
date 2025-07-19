'use server'

import { revalidatePath } from 'next/cache'

// Note: unstable_after is available but might need to be enabled in next.config.ts
// For now, we'll use a fallback pattern
const after = (callback: () => Promise<void>) => {
  // In production, this would be the actual unstable_after
  // For now, we'll run it immediately (but in a microtask)
  setTimeout(callback, 0)
}

export async function createProduct(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  
  // Validate input
  if (!name || !price || !category) {
    throw new Error('All fields are required')
  }

  try {
    // Simulate product creation
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price),
      category,
      createdAt: new Date().toISOString(),
    }

    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 100))

    // Use background task simulation
    after(async () => {
      // Background processing would happen here
    })

    // Revalidate the products page
    revalidatePath('/products')
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateInventoryAction(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  if (!productId || isNaN(quantity)) {
    throw new Error('Invalid inventory update data')
  }

  try {
    // Simulate inventory update
    await new Promise(resolve => setTimeout(resolve, 100))

    // Background logging
    after(async () => {
      // Background processing would happen here
    })

    // Revalidate related pages
    revalidatePath('/products')
    revalidatePath('/inventory')
  } catch (error) {
    throw new Error(`Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string
  
  if (!productId) {
    throw new Error('No product ID provided')
  }

  try {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 100))

    // Background cleanup
    after(async () => {
      // Background processing would happen here
    })

    // Revalidate
    revalidatePath('/products')
  } catch (error) {
    throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
