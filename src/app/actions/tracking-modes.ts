'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Change an item's tracking mode
 */
export async function changeItemTrackingMode(
  itemId: string,
  newMode: 'fully_tracked' | 'cost_added'
) {
  const supabase = supabaseAdmin;

  try {
    const { data, error } = await supabase
      .from('items')
      .update({ tracking_mode: newMode })
      .eq('itemid', itemId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/items');
    return { success: true, data };
  } catch (error) {
    console.error('Error changing tracking mode:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get two-mode tracking alerts
 */
export async function getTwoModeAlerts(): Promise<{
  success: boolean;
  data?: Array<{
    itemid: string;
    sku: string;
    name: string;
    tracking_mode: string;
    alert_type: string;
    alert_message: string;
    priority: number;
  }>;
  error?: string;
}> {
  const supabase = supabaseAdmin;

  try {
    const { data, error } = await supabase.rpc('get_two_mode_alerts');

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching two-mode alerts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get recipe cost with two-mode support
 */
export async function getRecipeCostTwoMode(recipeId: string): Promise<{
  success: boolean;
  data?: { total_cost: number; cost_breakdown: any[] };
  error?: string;
}> {
  const supabase = supabaseAdmin;

  try {
    // For now, just calculate using standard WAC regardless of tracking mode
    // This can be enhanced later if needed
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .select(`
        quantity,
        items (
          name,
          weightedaveragecost,
          tracking_mode
        )
      `)
      .eq('recipeid', recipeId);

    if (error) throw error;

    let totalCost = 0;
    const costBreakdown: any[] = [];

    data?.forEach((ingredient: any) => {
      const cost = ingredient.quantity * (ingredient.items?.weightedaveragecost || 0);
      totalCost += cost;
      
      costBreakdown.push({
        name: ingredient.items?.name || 'Unknown',
        quantity: ingredient.quantity,
        unit_cost: ingredient.items?.weightedaveragecost || 0,
        total_cost: cost,
        tracking_mode: ingredient.items?.tracking_mode || 'fully_tracked'
      });
    });

    return { 
      success: true, 
      data: { 
        total_cost: totalCost, 
        cost_breakdown: costBreakdown 
      } 
    };
  } catch (error) {
    console.error('Error calculating recipe cost:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
