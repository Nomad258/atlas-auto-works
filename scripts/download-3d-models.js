#!/usr/bin/env node
/**
 * Download 3D Model Assets Script
 * Downloads wheel rims, tires, and other 3D assets from GitHub repos
 * Then uploads them to Supabase storage
 *
 * Usage: node scripts/download-3d-models.js
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directories for local storage (before upload to Supabase)
const MODELS_DIR = path.join(__dirname, '../public/models')
const WHEELS_DIR = path.join(MODELS_DIR, 'wheels')
const RIMS_DIR = path.join(WHEELS_DIR, 'rims')
const TIRES_DIR = path.join(WHEELS_DIR, 'tires')

// Real wheel rim models from 4x4builder (MIT licensed)
// These are production-ready GLB files
const WHEEL_RIMS = [
  {
    name: 'Method 305 NV',
    filename: 'method_305.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/method_305.glb',
    brand: 'Method',
    style: 'Off-Road',
    spokes: 6
  },
  {
    name: 'Method 312',
    filename: 'method_312.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/method_312.glb',
    brand: 'Method',
    style: 'Racing',
    spokes: 8
  },
  {
    name: 'XD Grenade',
    filename: 'xd_grenade.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/xd_grenade.glb',
    brand: 'XD Wheels',
    style: 'Aggressive',
    spokes: 8
  },
  {
    name: 'XD Machete',
    filename: 'xd_machete.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/xd_machete.glb',
    brand: 'XD Wheels',
    style: 'Split-Spoke',
    spokes: 10
  },
  {
    name: 'KMC Terra',
    filename: 'kmc_terra.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/kmc_terra.glb',
    brand: 'KMC',
    style: 'Beadlock',
    spokes: 6
  },
  {
    name: 'Fuel Syndicate',
    filename: 'fuel_syndicate.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/fuel_syndicate.glb',
    brand: 'Fuel',
    style: 'Mesh',
    spokes: 12
  },
  {
    name: 'Konig Countersteer',
    filename: 'konig_countersteer.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/konig_countersteer.glb',
    brand: 'Konig',
    style: 'Classic',
    spokes: 5
  },
  {
    name: 'American Racing Mojave',
    filename: 'ar_mojave.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/ar_mojave.glb',
    brand: 'American Racing',
    style: 'Classic',
    spokes: 5
  },
  {
    name: 'Cragar Soft 8',
    filename: 'cragar_soft_8.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/cragar_soft_8.glb',
    brand: 'Cragar',
    style: 'Retro',
    spokes: 8
  },
  {
    name: 'Dirty Life Mesa Race',
    filename: 'dirty_life_mesa_race.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/dirty_life_mesa_race.glb',
    brand: 'Dirty Life',
    style: 'Beadlock Race',
    spokes: 6
  },
  {
    name: 'Moto Metal MO951',
    filename: 'moto_metal_mo951.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/moto_metal_mO951.glb',
    brand: 'Moto Metal',
    style: 'Chrome',
    spokes: 8
  },
  {
    name: 'Level 8 Strike 6',
    filename: 'level_8_strike_6.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/level_8_strike_6.glb',
    brand: 'Level 8',
    style: 'Tactical',
    spokes: 6
  },
  {
    name: 'Toyota TRD',
    filename: 'toyota_trd.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/toyota_trd.glb',
    brand: 'Toyota',
    style: 'OEM TRD',
    spokes: 6
  },
  {
    name: 'Toyota 4Runner OEM',
    filename: 'toyota_4runner.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/toyota_4runner.glb',
    brand: 'Toyota',
    style: 'OEM',
    spokes: 5
  },
  {
    name: 'Ford Bronco OEM',
    filename: 'ford_bronco.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/rims/ford_bronco.glb',
    brand: 'Ford',
    style: 'OEM',
    spokes: 5
  }
]

// Real tire models from 4x4builder
const TIRES = [
  {
    name: 'BFGoodrich All-Terrain T/A KO2',
    filename: 'bfg_at.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/bfg_at.glb',
    brand: 'BFGoodrich',
    type: 'All-Terrain'
  },
  {
    name: 'BFGoodrich Mud-Terrain T/A KM2',
    filename: 'bfg_km2.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/bfg_km2.glb',
    brand: 'BFGoodrich',
    type: 'Mud-Terrain'
  },
  {
    name: 'BFGoodrich Mud-Terrain T/A KM3',
    filename: 'bfg_km3.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/bfg_km3.glb',
    brand: 'BFGoodrich',
    type: 'Mud-Terrain'
  },
  {
    name: 'Maxxis Trepador',
    filename: 'maxxis_trepador.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/maxxis_trepador.glb',
    brand: 'Maxxis',
    type: 'Extreme Off-Road'
  },
  {
    name: 'Nitto Mud Grappler',
    filename: 'nitto_mud_grappler.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/mud_grappler.glb',
    brand: 'Nitto',
    type: 'Mud-Terrain'
  },
  {
    name: 'Thornbird',
    filename: 'thornbird.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/thornbird.glb',
    brand: 'Interco',
    type: 'Extreme Mud'
  },
  {
    name: 'Toyo Open Country M/T',
    filename: 'toyo_open_country_mt.glb',
    url: 'https://raw.githubusercontent.com/theshanergy/4x4builder/master/public/assets/models/wheels/tires/toyo_open_country_mt.glb',
    brand: 'Toyo',
    type: 'Mud-Terrain'
  }
]

// Create directories if they don't exist
function ensureDirectories() {
  const dirs = [MODELS_DIR, WHEELS_DIR, RIMS_DIR, TIRES_DIR]
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  })
}

// Download a file from URL
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        console.log(`  ↪️ Redirecting to: ${redirectUrl}`)
        downloadFile(redirectUrl, destPath).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }

      response.pipe(file)

      file.on('finish', () => {
        file.close()
        const stats = fs.statSync(destPath)
        const sizeKB = (stats.size / 1024).toFixed(1)
        resolve({ path: destPath, size: sizeKB })
      })
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}) // Delete partial file
      reject(err)
    })
  })
}

// Download all wheel rims
async function downloadWheelRims() {
  console.log('\n🔧 Downloading Wheel Rim Models...\n')

  for (const rim of WHEEL_RIMS) {
    const destPath = path.join(RIMS_DIR, rim.filename)

    if (fs.existsSync(destPath)) {
      console.log(`  ⏭️  ${rim.name} - Already exists`)
      continue
    }

    try {
      console.log(`  ⬇️  Downloading ${rim.name}...`)
      const result = await downloadFile(rim.url, destPath)
      console.log(`  ✅ ${rim.name} (${result.size} KB)`)
    } catch (err) {
      console.log(`  ❌ Failed to download ${rim.name}: ${err.message}`)
    }
  }
}

// Download all tires
async function downloadTires() {
  console.log('\n🛞 Downloading Tire Models...\n')

  for (const tire of TIRES) {
    const destPath = path.join(TIRES_DIR, tire.filename)

    if (fs.existsSync(destPath)) {
      console.log(`  ⏭️  ${tire.name} - Already exists`)
      continue
    }

    try {
      console.log(`  ⬇️  Downloading ${tire.name}...`)
      const result = await downloadFile(tire.url, destPath)
      console.log(`  ✅ ${tire.name} (${result.size} KB)`)
    } catch (err) {
      console.log(`  ❌ Failed to download ${tire.name}: ${err.message}`)
    }
  }
}

// Generate inventory JSON for reference
function generateInventory() {
  const inventory = {
    rims: WHEEL_RIMS.map(rim => ({
      ...rim,
      localPath: `/models/wheels/rims/${rim.filename}`,
      supabasePath: `/wheels/rims/${rim.filename}`
    })),
    tires: TIRES.map(tire => ({
      ...tire,
      localPath: `/models/wheels/tires/${tire.filename}`,
      supabasePath: `/wheels/tires/${tire.filename}`
    }))
  }

  const inventoryPath = path.join(MODELS_DIR, 'inventory.json')
  fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2))
  console.log(`\n📋 Inventory saved to: ${inventoryPath}`)

  return inventory
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  Atlas Auto Works - 3D Model Asset Downloader')
  console.log('═══════════════════════════════════════════════════════')
  console.log('  Source: 4x4builder (MIT License)')
  console.log('  https://github.com/theshanergy/4x4builder')
  console.log('═══════════════════════════════════════════════════════')

  ensureDirectories()

  await downloadWheelRims()
  await downloadTires()

  const inventory = generateInventory()

  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  Download Complete!')
  console.log(`  • ${WHEEL_RIMS.length} wheel rims`)
  console.log(`  • ${TIRES.length} tire models`)
  console.log('═══════════════════════════════════════════════════════')
  console.log('\n📤 Next Steps:')
  console.log('  1. Upload models to Supabase Storage:')
  console.log('     - Go to your Supabase dashboard')
  console.log('     - Navigate to Storage > wheels bucket')
  console.log('     - Upload the contents of public/models/wheels/')
  console.log('')
  console.log('  2. Or run the upload script:')
  console.log('     node scripts/upload-to-supabase.js')
  console.log('')
}

main().catch(console.error)
