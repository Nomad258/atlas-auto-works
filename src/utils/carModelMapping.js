// Car Model Mapping for 3D Viewer
// Maps vehicle make/model to actual GLB files stored locally

// All models now served from /models/ in public folder
const MODEL_BASE_PATH = '/models'

// Model file names mapped to vehicle keys
const modelFiles = {
  // BMW Models
  'bmw-m3': 'bmw_m3_sedan_topaz_blue_car.glb',
  'bmw-m4': '2021_bmw_m4_competition.glb',
  'bmw-m4-competition': '2021_bmw_m4_competition.glb',

  // Porsche Models
  'porsche-911': '2014_porsche_cayman_s_981.glb',
  'porsche-911-carrera': '2014_porsche_cayman_s_981.glb',
  'porsche-718-cayman': '2014_porsche_cayman_s_981.glb',
  'porsche-cayman': '2014_porsche_cayman_s_981.glb',
  'porsche-gt3': '2014_porsche_cayman_s_981.glb',
  'porsche-gt3-rs': '2014_porsche_cayman_s_981.glb',
  'porsche-panamera': '2021_porsche_panamera_turbo_s_sport_turismo.glb',

  // Mercedes-Benz Models
  'mercedes-benz-amg-gt': 'mercedes_amg_gt.glb',
  'mercedes-amg-gt': 'mercedes_amg_gt.glb',

  // Ferrari Models
  'ferrari-488': '2016_ferrari_488_gtb.glb',
  'ferrari-488-gtb': '2016_ferrari_488_gtb.glb',
  'ferrari-f8': '2020_ferrari_f8_tributo.glb',
  'ferrari-f8-tributo': '2020_ferrari_f8_tributo.glb',

  // Lamborghini Models
  'lamborghini-huracan': '2019_lamborghini_huracan_gt_lbsilhouette.glb',
  'lamborghini-huracán': '2019_lamborghini_huracan_gt_lbsilhouette.glb',

  // Audi Models
  'audi-r8': 'audi_r8.glb',
  'audi-rs7': 'audi_rs7_2014.glb',
}

/**
 * Get the local model path for a given vehicle
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

  // Try just the make if still no match
  if (!fileName) {
    const makeOnlyKeys = Object.keys(modelFiles).filter(k => k.startsWith(make))
    if (makeOnlyKeys.length > 0) {
      fileName = modelFiles[makeOnlyKeys[0]]
    }
  }

  if (!fileName) {
    console.log('⚠️ No model found for:', key)
    return null
  }

  // Return local path
  const localPath = `${MODEL_BASE_PATH}/${fileName}`
  console.log('💾 Loading model from local:', localPath)
  return localPath
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
