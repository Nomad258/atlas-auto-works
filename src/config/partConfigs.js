// Part Configuration System
// Maps product IDs to 3D model paths and part-specific settings

import { getModelUrl, STORAGE_CONFIG } from './storageConfig'

// Helper to get part GLB URL from registry
function getPartUrl(category, productId) {
  return getModelUrl(category, productId)
}

// Supabase URL for car models
const SUPABASE_URL = STORAGE_CONFIG.supabase.baseUrl

// ============================================
// BODYKIT CONFIGURATIONS
// ============================================
export const bodykitConfigs = {
  'b001': {
    name: 'GT Wing Spoiler',
    type: 'Spoiler',
    parts: {
      spoiler: {
        glbPath: getPartUrl('bodykits', 'b001'),
        position: [-1.8, 0.8, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    }
  },

  'b005': {
    name: 'BMW Body Shell',
    type: 'Body',
    parts: {
      body: {
        glbPath: getPartUrl('bodykits', 'b005'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    }
  },

  'b006': {
    name: 'Carbon Undertray',
    type: 'Aero',
    parts: {
      undertray: {
        glbPath: getPartUrl('bodykits', 'b006'),
        position: [0, -0.5, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    }
  },

  'b007': {
    name: 'Performance Frame',
    type: 'Structure',
    parts: {
      frame: {
        glbPath: getPartUrl('bodykits', 'b007'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    }
  },

  'b008': {
    name: 'Tinted Windows',
    type: 'Glass',
    parts: {
      window: {
        glbPath: getPartUrl('bodykits', 'b008'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    }
  }
}

// ============================================
// INTERIOR CONFIGURATIONS
// ============================================
export const interiorConfigs = {
  'i001': {
    name: 'Full Leather Retrim',
    type: 'Complete',
    materials: {
      seats: { color: '#8B4513', metalness: 0.1, roughness: 0.8 },
      dashboard: { color: '#2C1810', metalness: 0.05, roughness: 0.9 },
      doorPanels: { color: '#8B4513', metalness: 0.1, roughness: 0.8 },
      steeringWheel: { color: '#1A0F0A', metalness: 0.1, roughness: 0.7 }
    },
    colorOptions: {
      'Tan': '#D2691E',
      'Black': '#1A1A1A',
      'Red': '#8B0000',
      'White': '#F5F5DC'
    }
  },

  'i002': {
    name: 'Alcantara Sport Package',
    type: 'Sport',
    materials: {
      seats: { color: '#1A1A1A', metalness: 0.0, roughness: 0.95 },
      dashboard: { color: '#0D0D0D', metalness: 0.0, roughness: 0.9 },
      steeringWheel: { color: '#1A1A1A', metalness: 0.0, roughness: 0.95 }
    },
    colorOptions: {
      'Black': '#1A1A1A',
      'Grey': '#4A4A4A'
    }
  },

  'i003': {
    name: 'Carbon Fiber Trim Set',
    type: 'Trim',
    materials: {
      dashTrim: { color: '#1A1A1A', metalness: 0.3, roughness: 0.4 },
      doorTrim: { color: '#1A1A1A', metalness: 0.3, roughness: 0.4 },
      consoleTrim: { color: '#1A1A1A', metalness: 0.3, roughness: 0.4 }
    }
  },

  'i004': {
    name: 'Custom Steering Wheel',
    type: 'Steering',
    materials: {
      steeringWheel: { color: '#1A1A1A', metalness: 0.2, roughness: 0.6 }
    }
  },

  'i005': {
    name: 'Ambient Lighting Kit',
    type: 'Lighting',
    lightZones: {
      footwell: { color: '#C4A661', intensity: 0.5 },
      dashboard: { color: '#C4A661', intensity: 0.3 },
      doorPanels: { color: '#C4A661', intensity: 0.4 },
      center: { color: '#C4A661', intensity: 0.3 }
    },
    colorOptions: {
      'Gold': '#C4A661',
      'Blue': '#4169E1',
      'Red': '#DC143C',
      'White': '#FFFFFF',
      'Green': '#32CD32',
      'Purple': '#9400D3'
    }
  },

  'i006': {
    name: 'Custom Floor Mats',
    type: 'Accessories',
    materials: {
      carpet: { color: '#1A1A1A', metalness: 0.0, roughness: 0.95 }
    }
  }
}

// ============================================
// STARLIGHT CONFIGURATIONS
// ============================================
export const starlightConfigs = {
  's001': {
    name: 'Starlight Headliner - Standard',
    stars: 300,
    fiberType: 'Standard',
    brightness: 0.6,
    twinkle: false,
    shooting: false,
    pattern: 'random',
    coverage: {
      headliner: true,
      doors: false,
      trunk: false
    }
  },

  's002': {
    name: 'Starlight Headliner - Premium',
    stars: 800,
    fiberType: 'Fiber Optic',
    brightness: 0.8,
    twinkle: true,
    shooting: false,
    pattern: 'random',
    coverage: {
      headliner: true,
      doors: false,
      trunk: false
    }
  },

  's003': {
    name: 'Starlight Headliner - Galaxy',
    stars: 1500,
    fiberType: 'RGB Fiber Optic',
    brightness: 1.0,
    twinkle: true,
    shooting: true,
    shootingInterval: 15000,
    pattern: 'milkyway',
    colorOptions: ['#FFFFFF', '#87CEEB', '#FFD700', '#FF69B4'],
    coverage: {
      headliner: true,
      doors: false,
      trunk: false
    }
  },

  's004': {
    name: 'Constellation Package',
    stars: 2000,
    fiberType: 'RGB Fiber Optic',
    brightness: 1.0,
    twinkle: true,
    shooting: true,
    shootingInterval: 10000,
    pattern: 'constellations',
    constellations: ['orion', 'ursa_major', 'cassiopeia', 'scorpius'],
    colorOptions: ['#FFFFFF', '#87CEEB', '#FFD700', '#FF69B4', '#00FF00'],
    coverage: {
      headliner: true,
      doors: true,
      trunk: true
    }
  },

  's005': {
    name: 'Door Panel Stars',
    stars: 200,
    fiberType: 'Fiber Optic',
    brightness: 0.7,
    twinkle: true,
    shooting: false,
    pattern: 'random',
    coverage: {
      headliner: false,
      doors: true,
      trunk: false
    }
  }
}

// ============================================
// ACCESSORIES CONFIGURATIONS
// ============================================
export const accessoryConfigs = {
  'a001': {
    name: 'Performance Exhaust System',
    type: 'Exhaust',
    parts: {
      exhaust: {
        glbPath: getPartUrl('accessories', 'a001'),
        position: [-2.3, -0.35, 0],
        rotation: [0, Math.PI, 0],
        scale: 1.0
      },
      exhaustCover: {
        glbPath: getPartUrl('accessories', 'a001_cover'),
        position: [-2.4, -0.35, 0],
        rotation: [0, Math.PI, 0],
        scale: 1.0
      }
    },
    material: {
      color: '#B5A642',
      metalness: 0.9,
      roughness: 0.2
    }
  },

  'a002': {
    name: 'KW V3 Coilover Kit',
    type: 'Suspension',
    effect: {
      rideHeight: -35,
      frontCamber: -1.5,
      rearCamber: -2.0
    }
  },

  'a003': {
    name: 'Performance Brake Kit',
    type: 'Brakes',
    parts: {
      calipers: {
        glbPath: getPartUrl('accessories', 'a003'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      },
      brakeDisc: {
        glbPath: getPartUrl('accessories', 'a003_disc'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    },
    caliperColors: {
      'Red': '#CC0000',
      'Yellow': '#FFD700',
      'Black': '#1A1A1A',
      'Silver': '#C0C0C0',
      'Blue': '#0066CC'
    }
  },

  'a004': {
    name: 'Window Tint - Premium',
    type: 'Tint',
    parts: {
      windows: {
        glbPath: getPartUrl('bodykits', 'b008'),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.0
      }
    },
    levels: {
      'Light (50%)': { opacity: 0.5 },
      'Medium (35%)': { opacity: 0.35 },
      'Dark (20%)': { opacity: 0.2 },
      'Limo (5%)': { opacity: 0.05 }
    },
    material: {
      color: '#000000',
      metalness: 0.1,
      roughness: 0.1
    }
  },

  'a005': {
    name: 'XPEL Ultimate PPF',
    type: 'Protection',
    coverage: ['hood', 'fenders', 'mirrors', 'bumper', 'rockers'],
    material: {
      transparent: true,
      opacity: 0.95,
      roughness: 0.05
    }
  },

  'a006': {
    name: 'Gtechniq Crystal Serum',
    type: 'Protection',
    effect: {
      clearcoatBoost: 1.5,
      roughnessReduction: 0.15
    }
  },

  'a007': {
    name: 'Brembo GT 6-Piston Kit',
    type: 'Brakes',
    parts: {
      caliperFrontLeft: {
        glbPath: getPartUrl('accessories', 'a003'),
        position: [1.4, -0.35, 0.75],
        rotation: [0, 0, 0],
        scale: 1.0
      },
      caliperFrontRight: {
        glbPath: getPartUrl('accessories', 'a003'),
        position: [1.4, -0.35, -0.75],
        rotation: [0, Math.PI, 0],
        scale: 1.0
      },
      caliperRearLeft: {
        glbPath: getPartUrl('accessories', 'a003'),
        position: [-1.4, -0.35, 0.75],
        rotation: [0, 0, 0],
        scale: 1.0
      },
      caliperRearRight: {
        glbPath: getPartUrl('accessories', 'a003'),
        position: [-1.4, -0.35, -0.75],
        rotation: [0, Math.PI, 0],
        scale: 1.0
      }
    },
    caliperColors: {
      'Red': '#CC0000',
      'Yellow': '#FFD700',
      'Black': '#1A1A1A',
      'Silver': '#C0C0C0'
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getBodykitConfig(productId) {
  return bodykitConfigs[productId] || null
}

export function getInteriorConfig(productId) {
  return interiorConfigs[productId] || null
}

export function getStarlightConfig(productId) {
  return starlightConfigs[productId] || null
}

export function getAccessoryConfig(productId) {
  return accessoryConfigs[productId] || null
}

export function getPartGLBUrl(basePath) {
  if (!basePath) return null
  return `${SUPABASE_URL}${basePath}`
}

// Get all parts for a bodykit
export function getBodykitParts(productId) {
  const config = bodykitConfigs[productId]
  if (!config || !config.parts) return []

  return Object.entries(config.parts).map(([key, part]) => ({
    key,
    name: key,
    glbUrl: part.glbPath,
    position: part.position,
    rotation: part.rotation,
    scale: part.scale
  }))
}

// Get interior material settings
export function getInteriorMaterials(productId, selectedColor = null) {
  const config = interiorConfigs[productId]
  if (!config) return null

  const materials = { ...config.materials }

  // Apply selected color if available
  if (selectedColor && config.colorOptions && config.colorOptions[selectedColor]) {
    const colorHex = config.colorOptions[selectedColor]
    if (materials.seats) materials.seats.color = colorHex
    if (materials.doorPanels) materials.doorPanels.color = colorHex
  }

  return materials
}

export default {
  bodykitConfigs,
  interiorConfigs,
  starlightConfigs,
  accessoryConfigs,
  getBodykitConfig,
  getInteriorConfig,
  getStarlightConfig,
  getAccessoryConfig,
  getPartGLBUrl,
  getBodykitParts,
  getInteriorMaterials
}
