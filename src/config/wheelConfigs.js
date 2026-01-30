// Wheel Configuration System
// Wheel Configurations
// Maps wheel brands and models to 3D assets

import { getModelUrl } from './storageConfig'

// Helper to get wheel GLB URL
const getWheelModelUrl = (id) => {
  return getModelUrl('wheels', id)
}

// Helper to get tire GLB URL
const getTireModelUrl = (id) => {
  return getModelUrl('tires', id)
}

// Wheel rim model configurations - using local storage
export const wheelConfigs = {
  // Method Racing Wheels
  'r001': {
    name: 'Method 305 NV',
    glbPath: getWheelModelUrl('r001'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'Method',
    style: 'Off-Road',
    specs: {
      diameter: 17,
      width: 8.5,
      spokes: 6,
      finish: 'Matte Black'
    }
  },

  'r002': {
    name: 'Method 312',
    glbPath: getWheelModelUrl('r002'),
    fallbackColor: '#2a2a2a',
    scale: 1.0,
    brand: 'Method',
    style: 'Racing',
    specs: {
      diameter: 18,
      width: 9,
      spokes: 8,
      finish: 'Matte Black'
    }
  },

  // XD Wheels
  'r003': {
    name: 'XD Grenade',
    glbPath: getWheelModelUrl('r003'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'XD Wheels',
    style: 'Aggressive',
    specs: {
      diameter: 20,
      width: 9,
      spokes: 8,
      finish: 'Gloss Black'
    }
  },

  'r004': {
    name: 'XD Machete',
    glbPath: getWheelModelUrl('r004'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'XD Wheels',
    style: 'Split-Spoke',
    specs: {
      diameter: 20,
      width: 10,
      spokes: 10,
      finish: 'Satin Black'
    }
  },

  // KMC Wheels
  'r005': {
    name: 'KMC Terra',
    glbPath: getWheelModelUrl('r005'),
    fallbackColor: '#3a3a3a',
    scale: 1.0,
    brand: 'KMC',
    style: 'Beadlock',
    specs: {
      diameter: 17,
      width: 9,
      spokes: 6,
      finish: 'Satin Bronze'
    }
  },

  // Fuel Wheels
  'r006': {
    name: 'Fuel Syndicate',
    glbPath: getWheelModelUrl('r006'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'Fuel',
    style: 'Mesh',
    specs: {
      diameter: 20,
      width: 10,
      spokes: 12,
      finish: 'Gloss Black Milled'
    }
  },

  // BMW Style Rims
  'r007': {
    name: 'BMW M Performance Style 1',
    glbPath: getWheelModelUrl('r007'),
    fallbackColor: '#C0C0C0',
    scale: 1.0,
    brand: 'BMW',
    style: 'Sport',
    specs: {
      diameter: 19,
      width: 8.5,
      spokes: 5,
      finish: 'Machined Silver'
    }
  },

  'r008': {
    name: 'BMW M Performance Style 2',
    glbPath: getWheelModelUrl('r008'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'BMW',
    style: 'Competition',
    specs: {
      diameter: 20,
      width: 9,
      spokes: 10,
      finish: 'Jet Black'
    }
  },

  'r009': {
    name: 'BMW M Performance Style 3',
    glbPath: getWheelModelUrl('r009'),
    fallbackColor: '#8B7355',
    scale: 1.0,
    brand: 'BMW',
    style: 'Luxury',
    specs: {
      diameter: 20,
      width: 9.5,
      spokes: 7,
      finish: 'Frozen Bronze'
    }
  },

  // Classic/Retro Wheels
  'r010': {
    name: 'Konig Countersteer',
    glbPath: getWheelModelUrl('r010'),
    fallbackColor: '#D4AF37',
    scale: 1.0,
    brand: 'Konig',
    style: 'Classic',
    specs: {
      diameter: 15,
      width: 8,
      spokes: 5,
      finish: 'Bronze'
    }
  },

  'r011': {
    name: 'American Racing Mojave',
    glbPath: getWheelModelUrl('r011'),
    fallbackColor: '#C0C0C0',
    scale: 1.0,
    brand: 'American Racing',
    style: 'Classic',
    specs: {
      diameter: 16,
      width: 8,
      spokes: 5,
      finish: 'Polished'
    }
  },

  'r012': {
    name: 'Cragar Soft 8',
    glbPath: getWheelModelUrl('r012'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'Cragar',
    style: 'Retro',
    specs: {
      diameter: 15,
      width: 7,
      spokes: 8,
      finish: 'Black Steel'
    }
  },

  // Off-Road/Race
  'r013': {
    name: 'Dirty Life Mesa Race',
    glbPath: getWheelModelUrl('r013'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'Dirty Life',
    style: 'Beadlock Race',
    specs: {
      diameter: 17,
      width: 9,
      spokes: 6,
      finish: 'Matte Black'
    }
  },

  'r014': {
    name: 'Level 8 Strike 6',
    glbPath: getWheelModelUrl('r014'),
    fallbackColor: '#2a2a2a',
    scale: 1.0,
    brand: 'Level 8',
    style: 'Tactical',
    specs: {
      diameter: 17,
      width: 8,
      spokes: 6,
      finish: 'Matte Gunmetal'
    }
  },

  'r015': {
    name: 'Moto Metal MO951',
    glbPath: getWheelModelUrl('r015'),
    fallbackColor: '#E8E8E8',
    scale: 1.0,
    brand: 'Moto Metal',
    style: 'Chrome',
    specs: {
      diameter: 20,
      width: 9,
      spokes: 8,
      finish: 'Chrome'
    }
  },

  // OEM Wheels
  'r016': {
    name: 'Toyota TRD Pro',
    glbPath: getWheelModelUrl('r016'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'Toyota',
    style: 'OEM TRD',
    specs: {
      diameter: 17,
      width: 7.5,
      spokes: 6,
      finish: 'Matte Black'
    }
  },

  'r017': {
    name: 'Toyota 4Runner OEM',
    glbPath: getWheelModelUrl('r017'),
    fallbackColor: '#4a4a4a',
    scale: 1.0,
    brand: 'Toyota',
    style: 'OEM',
    specs: {
      diameter: 17,
      width: 7,
      spokes: 5,
      finish: 'Charcoal'
    }
  },

  'r018': {
    name: 'Ford Bronco OEM',
    glbPath: getWheelModelUrl('r018'),
    fallbackColor: '#3a3a3a',
    scale: 1.0,
    brand: 'Ford',
    style: 'OEM',
    specs: {
      diameter: 17,
      width: 8,
      spokes: 5,
      finish: 'Carbonized Gray'
    }
  },

  // BMW Tyre (wheel with tire)
  'r019': {
    name: 'BMW Performance Wheel',
    glbPath: getWheelModelUrl('r019'),
    fallbackColor: '#1a1a1a',
    scale: 1.0,
    brand: 'BMW',
    style: 'Performance',
    specs: {
      diameter: 19,
      width: 8.5,
      spokes: 5,
      finish: 'Matte Black'
    }
  }
}

// Tire model configurations
export const tireConfigs = {
  't001': {
    name: 'BFGoodrich All-Terrain T/A KO2',
    glbPath: getTireModelUrl('t001'),
    brand: 'BFGoodrich',
    type: 'All-Terrain',
    sizes: ['265/70R17', '285/70R17', '315/70R17']
  },
  't002': {
    name: 'BFGoodrich Mud-Terrain T/A KM2',
    glbPath: getTireModelUrl('t002'),
    brand: 'BFGoodrich',
    type: 'Mud-Terrain',
    sizes: ['285/75R16', '305/70R16', '35x12.5R17']
  },
  't003': {
    name: 'BFGoodrich Mud-Terrain T/A KM3',
    glbPath: getTireModelUrl('t003'),
    brand: 'BFGoodrich',
    type: 'Mud-Terrain',
    sizes: ['285/70R17', '315/70R17', '37x12.5R17']
  },
  't004': {
    name: 'Maxxis Trepador',
    glbPath: getTireModelUrl('t004'),
    brand: 'Maxxis',
    type: 'Extreme Off-Road',
    sizes: ['37x12.5R17', '40x13.5R17', '42x14.5R17']
  },
  't005': {
    name: 'Nitto Mud Grappler',
    glbPath: getTireModelUrl('t005'),
    brand: 'Nitto',
    type: 'Mud-Terrain',
    sizes: ['33x12.5R17', '35x12.5R17', '38x15.5R17']
  },
  't006': {
    name: 'Interco Thornbird',
    glbPath: getTireModelUrl('t006'),
    brand: 'Interco',
    type: 'Extreme Mud',
    sizes: ['35x14.5R15', '38x15.5R15', '44x19.5R15']
  },
  't007': {
    name: 'Toyo Open Country M/T',
    glbPath: getTireModelUrl('t007'),
    brand: 'Toyo',
    type: 'Mud-Terrain',
    sizes: ['285/75R16', '315/75R16', '35x12.5R17']
  },
  't008': {
    name: 'BMW Performance Tire',
    glbPath: getWheelModelUrl('r019'), // Uses wheel model with tire
    brand: 'Michelin',
    type: 'Performance',
    sizes: ['245/40R19', '275/35R19', '285/30R20']
  }
}

// Wheel positions relative to car body (standard sedan/coupe)
// Wheel positions for a car scaled to ~4 units length
// Y offset is wheel center height from ground, Z is track width
export const wheelPositions = {
  frontLeft: { position: [1.3, 0.35, 0.85], rotation: [0, 0, 0] },
  frontRight: { position: [1.3, 0.35, -0.85], rotation: [0, Math.PI, 0] },
  rearLeft: { position: [-1.3, 0.35, 0.85], rotation: [0, 0, 0] },
  rearRight: { position: [-1.3, 0.35, -0.85], rotation: [0, Math.PI, 0] }
}

// Helper functions
export function getWheelConfig(productId) {
  return wheelConfigs[productId] || null
}

export function getTireConfig(productId) {
  return tireConfigs[productId] || null
}

export function getWheelGLBPath(productId) {
  const config = wheelConfigs[productId]
  return config?.glbPath || null
}

export function getTireGLBPath(productId) {
  const config = tireConfigs[productId]
  return config?.glbPath || null
}

// Get all wheel options as array for product listing
export function getAllWheelOptions() {
  return Object.entries(wheelConfigs).map(([id, config]) => ({
    id,
    ...config
  }))
}

export function getAllTireOptions() {
  return Object.entries(tireConfigs).map(([id, config]) => ({
    id,
    ...config
  }))
}

export default wheelConfigs
