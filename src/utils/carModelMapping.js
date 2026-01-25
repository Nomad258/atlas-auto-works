// Car Model Mapping for 3D Viewer
// Maps vehicle make/model to actual GLB files
import { getSupabaseModelUrl } from './supabaseClient'

// Model file names (without path - can be loaded from Supabase or local)
const modelFiles = {
  // BMW Models
  'bmw-m3': 'bmw_m3_sedan_topaz_blue_car.glb',
  'bmw-m4': '2021_bmw_m4_competition.glb',
  'bmw-m4-competition': '2021_bmw_m4_competition.glb',
  'bmw-i8': 'bmw_i8_xs_2015__www.vecarz.com.glb',
  'bmw-328i': 'bmw_m3_sedan_topaz_blue_car.glb', // Use M3 as fallback

  // Porsche Models
  'porsche-911': '2014_porsche_cayman_s_981.glb', // Use Cayman as similar coupe
  'porsche-911-carrera': '2014_porsche_cayman_s_981.glb',
  'porsche-718-cayman': '2014_porsche_cayman_s_981.glb',
  'porsche-cayman': '2014_porsche_cayman_s_981.glb',
  'porsche-panamera': '2021_porsche_panamera_turbo_s_sport_turismo.glb',
  'porsche-panamera-turbo-s-sport-turismo': '2021_porsche_panamera_turbo_s_sport_turismo.glb',
  'porsche-taycan': 'porsche_taycan_turbo_s_project_cars_3.glb',
  'porsche-taycan-turbo-s': 'porsche_taycan_turbo_s_project_cars_3.glb',
  'porsche-cayenne': '2021_porsche_panamera_turbo_s_sport_turismo.glb', // SUV fallback

  // Mercedes-Benz Models (mercedes_amg_gt.glb too large, using low_poly as fallback)
  'mercedes-benz-c63-amg': 'low_poly_mercedes.glb',
  'mercedes-benz-amg-gt': 'low_poly_mercedes.glb',
  'mercedes-benz-e-class': 'low_poly_mercedes.glb',
  'mercedes-benz-gle-450': 'low_poly_mercedes.glb',

  // Ferrari Models
  'ferrari-488-gtb': '2016_ferrari_488_gtb.glb',
  'ferrari-f8-tributo': '2020_ferrari_f8_tributo.glb',
  'ferrari-roma': '2020_ferrari_f8_tributo.glb',

  // Lamborghini Models
  'lamborghini-huracan': '2019_lamborghini_huracan_gt_lbsilhouette.glb',
  'lamborghini-huracán': '2019_lamborghini_huracan_gt_lbsilhouette.glb',
  'lamborghini-aventador': '2020_lamborghini_aventador_svj_63_roadster.glb',
  'lamborghini-urus': '2020_lamborghini_aventador_svj_63_roadster.glb', // Fallback

  // Audi Models (audi_rs7_2014.glb too large, using R8 as fallback)
  'audi-r8': 'audi_r8.glb',
  'audi-rs6-avant': 'audi_r8.glb',
  'audi-rs7': 'audi_r8.glb',
  'audi-a6': 'audi_r8.glb',

  // McLaren Models
  'mclaren-720s': '2017_mclaren_720s.glb',

  // Aston Martin Models
  'aston-martin-vantage': 'aston_martin_vantage_roadster__www.vecarz.com.glb',

  // Tesla Models (cybertruck_modified.glb too large - removed, will use procedural fallback)

  // Chevrolet Models
  'chevrolet-corvette': '2020_chevrolet_corvette_c8_stingray_convertible.glb',
  'chevrolet-corvette-c8': '2020_chevrolet_corvette_c8_stingray_convertible.glb',
  'chevrolet-camaro': '2016_chevrolet_camaro_ss.glb',
  'chevrolet-camaro-ss': '2016_chevrolet_camaro_ss.glb',

  // Toyota Models
  'toyota-supra': 'toyota_supra_mk5_a90.glb',
  'toyota-land-cruiser': '2022_toyota_land_cruiser_300_vx.r.glb',

  // Nissan Models
  'nissan-gt-r': 'nissan_aimgain_gt_r35_type2.glb',
  'nissan-370z': 'nissan_370z_z34.glb',

  // Ford Models
  'ford-mustang': 'ford_mustang_gt_convertible_1968.glb',
  'ford-f-150': '2018_ford_f-150_raptor.glb',
  'ford-f-150-raptor': '2018_ford_f-150_raptor.glb',

  // Dodge Models
  'dodge-challenger': '2018_dodge_challenger_srt_hellcat.glb',
  'dodge-challenger-srt': '2018_dodge_challenger_srt_hellcat.glb',

  // Honda Models
  'honda-civic': 'custom_honda_civic_type-r_2024.glb',
  'honda-civic-type-r': 'custom_honda_civic_type-r_2024.glb',
  'honda-nsx': 'honda_nsx_1990.glb',

  // Hyundai Models (hyundai_creta_2016.glb too large, using Tucson as SUV fallback)
  'hyundai-veloster': '2021_hyundai_veloster_n.glb',
  'hyundai-elantra': '2022_hyundai_elantra_n.glb',
  'hyundai-tucson': '2015_hyundai_tucson.glb',
  'hyundai-sonata': 'hyundai_sonata_2009.glb',
  'hyundai-creta': '2015_hyundai_tucson.glb',

  // Mazda Models
  'mazda-rx-7': 'mazda_rx-7_car.glb',

  // Subaru Models
  'subaru-impreza': 'subaru_impreza_wrx.glb',
  'subaru-wrx': 'subaru_impreza_wrx.glb',

  // Maserati Models
  'maserati-granturismo': 'maserati_granturismo_mc_stradale.glb',

  // Volkswagen Models
  'volkswagen-golf': 'volkswagen_golf_ii.glb',

  // Land Rover Models (using available models as fallbacks)
  'land-rover-range-rover': '2022_toyota_land_cruiser_300_vx.r.glb',
  'land-rover-range-rover-sport': '2022_toyota_land_cruiser_300_vx.r.glb',
}

/**
 * Get the model path for a given vehicle
 * @param {Object} vehicle - Vehicle object with make and model
 * @returns {string|null} Path to GLB model or null if not found
 */
export function getCarModelPath(vehicle) {
  if (!vehicle || !vehicle.make || !vehicle.model) {
    return null
  }

  // Create lookup key: make-model (lowercase, hyphenated)
  const make = vehicle.make.toLowerCase().replace(/\s+/g, '-')
  const model = vehicle.model.toLowerCase().replace(/\s+/g, '-')
  const key = `${make}-${model}`

  // Check if we have a specific model
  let fileName = modelFiles[key]

  // Try variations without trim levels
  if (!fileName) {
    const baseModel = model.split('-')[0]
    const baseKey = `${make}-${baseModel}`
    fileName = modelFiles[baseKey]
  }

  if (!fileName) {
    return null
  }

  // Try to get from Supabase first, fallback to local
  const supabaseUrl = getSupabaseModelUrl(fileName)
  if (supabaseUrl) {
    console.log('📦 Loading from Supabase:', fileName)
    return supabaseUrl
  }

  // Fallback to local models (if they exist)
  console.log('💾 Loading from local:', fileName)
  return `/models/${fileName}`
}

/**
 * Check if a model exists for a vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {boolean}
 */
export function hasCarModel(vehicle) {
  return getCarModelPath(vehicle) !== null
}

/**
 * Get all available car models
 * @returns {Array} List of all model keys
 */
export function getAvailableModels() {
  return Object.keys(modelFiles)
}
