'use server'

import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// Note: unstable_after is available but might need to be enabled in next.config.ts
// For now, we'll use a fallback pattern
const after = (callback: () => Promise<void>) => {
  // In production, this would be the actual unstable_after
  // For now, we'll run it immediately (but in a microtask)
  setTimeout(callback, 0)
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  
  // Validate input
  if (!name || !price || !category) {
    console.error('❌ Validation failed: All fields are required')
    return
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
      console.log('📦 Product created:', product)
    })

    // Revalidate the products page
    revalidatePath('/products')
    
  } catch (error) {
    console.error('Error creating product:', error)
  }
}

export async function updateInventoryAction(formData: FormData) {
  const productId = formData.get('productId') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  if (!productId || isNaN(quantity)) {
    console.error('❌ Invalid inventory update data')
    return
  }

  try {
    // Simulate inventory update
    await new Promise(resolve => setTimeout(resolve, 100))

    // Background logging
    after(async () => {
      console.log('📊 Inventory updated:', { productId, quantity, timestamp: new Date() })
    })

    // Revalidate related pages
    revalidatePath('/products')
    revalidatePath('/inventory')
    
  } catch (error) {
    console.error('Error updating inventory:', error)
  }
}

export async function deleteProductAction(formData: FormData) {
  const productId = formData.get('productId') as string
  
  if (!productId) {
    console.error('❌ No product ID provided')
    return
  }

  try {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 100))

    // Background cleanup
    after(async () => {
      console.log('🗑️ Product deleted:', { productId, timestamp: new Date() })
    })

    // Revalidate
    revalidatePath('/products')
    
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}
