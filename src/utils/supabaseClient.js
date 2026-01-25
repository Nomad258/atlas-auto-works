// Supabase Client for Car Models Storage

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client (only if credentials are available)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Get public URL for a car model from Supabase Storage
 * @param {string} fileName - The model file name (e.g., 'bmw_m3.glb')
 * @returns {string|null} Public URL or null if Supabase not configured
 */
export function getSupabaseModelUrl(fileName) {
  if (!supabaseUrl) {
    console.warn('Supabase not configured, models will be loaded from local storage')
    return null
  }

  // Construct the public URL directly
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/cars/${fileName}`
  console.log('🔗 Supabase model URL:', publicUrl)
  return publicUrl
}

/**
 * List all available car models in Supabase Storage
 * @returns {Promise<Array>} List of model files
 */
export async function listCarModels() {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase.storage
    .from('cars')
    .list()

  if (error) {
    console.error('Error listing car models:', error)
    return []
  }

  return data || []
}
