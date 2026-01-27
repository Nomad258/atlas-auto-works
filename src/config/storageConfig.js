// Storage Configuration for 3D Models
// Supports local storage (public folder) and Supabase (legacy)

// Storage backends
export const STORAGE_BACKENDS = {
  LOCAL: 'local',
  SUPABASE: 'supabase',
}

// Current environment
const isDev = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.DEV : false
const isProd = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PROD : false

// Base URLs for different storage backends
export const STORAGE_CONFIG = {
  // Local models in public folder
  local: {
    baseUrl: '/models',
    enabled: true,
  },

  // Supabase storage (existing car models)
  supabase: {
    baseUrl: 'https://xoyyudojecpytvyisjqv.supabase.co/storage/v1/object/public',
    buckets: {
      cars: 'cars',
      wheels: 'wheels',
      parts: 'parts'
    },
    enabled: true
  }
}

// Model registry - maps product IDs to storage locations
// All assets migrated from Google Drive are now local
export const MODEL_REGISTRY = {
  // Wheels
  wheels: {
    'r001': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/method_305.glb' },
    'r002': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/method_312.glb' },
    'r003': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/xd_grenade.glb' },
    'r004': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/xd_machete.glb' },
    'r005': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/kmc_terra.glb' },
    'r006': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/fuel_syndicate.glb' },
    'r007': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/rim1.glb' },
    'r008': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/rim2.glb' },
    'r009': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/rim3.glb' },
    'r010': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/konig_countersteer.glb' },
    'r011': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/ar_mojave.glb' },
    'r012': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/cragar_soft_8.glb' },
    'r013': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/dirty_life_mesa_race.glb' },
    'r014': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/level_8_strike_6.glb' },
    'r015': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/moto_metal_mo951.glb' },
    'r016': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/toyota_trd.glb' },
    'r017': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/toyota_4runner.glb' },
    'r018': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/ford_bronco.glb' },
    'r019': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/rims/bmw_tyre.glb' },
  },

  // Tires
  tires: {
    't001': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/bfg_at.glb' },
    't002': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/bfg_km2.glb' },
    't003': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/bfg_km3.glb' },
    't004': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/maxxis_trepador.glb' },
    't005': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/mud_grappler.glb' },
    't006': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/thornbird.glb' },
    't007': { backend: STORAGE_BACKENDS.LOCAL, path: '/wheels/tires/toyo_open_country_mt.glb' },
  },

  // Accessories
  accessories: {
    'a001': { backend: STORAGE_BACKENDS.LOCAL, path: '/accessories/exhaust.glb' },
    'a001_cover': { backend: STORAGE_BACKENDS.LOCAL, path: '/accessories/exhaustcover.glb' },
    'a003': { backend: STORAGE_BACKENDS.LOCAL, path: '/accessories/calipers.glb' },
    'a003_disc': { backend: STORAGE_BACKENDS.LOCAL, path: '/accessories/brakedisc.glb' },
  },

  // Bodykits
  bodykits: {
    'b001': { backend: STORAGE_BACKENDS.LOCAL, path: '/bodykits/gt_wing_spoiler.glb' },
    'b005': { backend: STORAGE_BACKENDS.LOCAL, path: '/bodykits/body.glb' },
    'b006': { backend: STORAGE_BACKENDS.LOCAL, path: '/bodykits/undertray.glb' },
    'b007': { backend: STORAGE_BACKENDS.LOCAL, path: '/bodykits/frame.glb' },
    'b008': { backend: STORAGE_BACKENDS.LOCAL, path: '/bodykits/window.glb' },
  },

  // Cars
  // Cars
  cars: {
    // Local car models (migrated from Supabase/GDrive)
    'bmw_m4': { backend: STORAGE_BACKENDS.LOCAL, path: '/2021_bmw_m4_competition.glb' },
    'ferrari_488': { backend: STORAGE_BACKENDS.LOCAL, path: '/2016_ferrari_488_gtb.glb' },
    'lamborghini_huracan': { backend: STORAGE_BACKENDS.LOCAL, path: '/2019_lamborghini_huracan_gt_lbsilhouette.glb' },
    'ferrari_f8': { backend: STORAGE_BACKENDS.LOCAL, path: '/2020_ferrari_f8_tributo.glb' },
    'porsche_cayman': { backend: STORAGE_BACKENDS.LOCAL, path: '/2014_porsche_cayman_s_981.glb' },
    'porsche_panamera': { backend: STORAGE_BACKENDS.LOCAL, path: '/2021_porsche_panamera_turbo_s_sport_turismo.glb' },
    'audi_r8': { backend: STORAGE_BACKENDS.LOCAL, path: '/audi_r8.glb' },
    'audi_rs7': { backend: STORAGE_BACKENDS.LOCAL, path: '/audi_rs7_2014.glb' },
    'bmw_m3': { backend: STORAGE_BACKENDS.LOCAL, path: '/bmw_m3_sedan_topaz_blue_car.glb' },
    'mercedes_amg_gt': { backend: STORAGE_BACKENDS.LOCAL, path: '/mercedes_amg_gt.glb' },

    // Migrated from Google Drive
    'ferrari_threejs': { backend: STORAGE_BACKENDS.LOCAL, path: '/cars/ferrari_threejs.glb' },
    'toycar_sample': { backend: STORAGE_BACKENDS.LOCAL, path: '/cars/toycar_khronos.glb' },
  }
}

// Helper function to get the full URL for a model
export function getModelUrl(category, productId) {
  const registry = MODEL_REGISTRY[category]
  if (!registry || !registry[productId]) {
    console.warn(`Model not found in registry: ${category}/${productId}`)
    return null
  }

  const entry = registry[productId]

  switch (entry.backend) {
    case STORAGE_BACKENDS.LOCAL:
      return `${STORAGE_CONFIG.local.baseUrl}${entry.path}`

    case STORAGE_BACKENDS.SUPABASE:
      return `${STORAGE_CONFIG.supabase.baseUrl}${entry.path}`

    default:
      console.warn(`Unknown storage backend: ${entry.backend}`)
      return null
  }
}

// Helper to check if a model is available
export function isModelAvailable(category, productId) {
  const registry = MODEL_REGISTRY[category]
  if (!registry || !registry[productId]) return false
  return true
}

export default STORAGE_CONFIG

