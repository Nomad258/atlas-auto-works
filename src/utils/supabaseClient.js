// Supabase Client for Car Models Storage

import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase URL as fallback - this is a public bucket, no security risk
const SUPABASE_URL_FALLBACK = 'https://xoyyudojecpytvyisjqv.supabase.co'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client (only if credentials are available)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Get public URL for a car model from Supabase Storage
 * @param {string} fileName - The model file name (e.g., 'bmw_m3.glb')
 * @returns {string} Public URL for the model
 */
export function getSupabaseModelUrl(fileName) {
  // Always use the URL - even if env var is not set, use the fallback
  const baseUrl = supabaseUrl || SUPABASE_URL_FALLBACK

  // Construct the public URL directly
  const publicUrl = `${baseUrl}/storage/v1/object/public/cars/${fileName}`
  console.log('📦 Loading car model from Supabase:', publicUrl)
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
