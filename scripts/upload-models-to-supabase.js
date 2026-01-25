#!/usr/bin/env node

/**
 * Upload Car Models to Supabase Storage
 *
 * This script uploads all car GLB models to Supabase Storage bucket.
 * Models will be served via Supabase CDN for fast global delivery.
 *
 * Setup:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Create a storage bucket named 'car-models' (public)
 * 3. Add environment variables to .env:
 *    VITE_SUPABASE_URL=your_project_url
 *    VITE_SUPABASE_ANON_KEY=your_anon_key
 *
 * Usage:
 *    node scripts/upload-models-to-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const BUCKET_NAME = 'car-models'

// Models directory
const MODELS_DIR = path.join(__dirname, '../temp-models/cars')

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env')
  console.log('\n📝 To set up Supabase:')
  console.log('1. Go to https://supabase.com and create a project')
  console.log('2. Go to Settings → API')
  console.log('3. Copy your Project URL and anon/public key')
  console.log('4. Add to .env file:')
  console.log('   VITE_SUPABASE_URL=your_project_url')
  console.log('   VITE_SUPABASE_ANON_KEY=your_anon_key')
  console.log('5. Go to Storage → Create bucket → Name: "car-models" (make it public)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function uploadModels() {
  console.log('🚗 Atlas Auto Works - Model Upload to Supabase')
  console.log('=' .repeat(50))
  console.log('')

  // Check if bucket exists
  console.log('📦 Checking storage bucket...')
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError.message)
    return
  }

  const bucketExists = buckets.some(b => b.name === BUCKET_NAME)

  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}...`)
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    })

    if (createError) {
      console.error('❌ Error creating bucket:', createError.message)
      console.log('\n💡 Please create the bucket manually:')
      console.log(`   1. Go to ${SUPABASE_URL}/project/_/storage`)
      console.log(`   2. Create new bucket: "${BUCKET_NAME}"`)
      console.log('   3. Make it PUBLIC')
      console.log('   4. Run this script again')
      return
    }
  }

  console.log(`✅ Bucket "${BUCKET_NAME}" ready`)
  console.log('')

  // Find all GLB files
  console.log('🔍 Finding GLB files...')
  const glbFiles = []

  function findGLBFiles(dir) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        findGLBFiles(fullPath)
      } else if (item.endsWith('.glb')) {
        glbFiles.push(fullPath)
      }
    }
  }

  findGLBFiles(MODELS_DIR)

  console.log(`📁 Found ${glbFiles.length} GLB files`)
  console.log('')

  // Upload each file
  let uploaded = 0
  let failed = 0

  for (const filePath of glbFiles) {
    const relativePath = path.relative(MODELS_DIR, filePath)
    const fileName = path.basename(filePath)
    const fileSize = fs.statSync(filePath).size
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)

    console.log(`⬆️  Uploading: ${fileName} (${fileSizeMB} MB)...`)

    try {
      const fileBuffer = fs.readFileSync(filePath)

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: 'model/gltf-binary',
          upsert: true, // Overwrite if exists
        })

      if (error) {
        console.error(`   ❌ Failed: ${error.message}`)
        failed++
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName)

        console.log(`   ✅ Uploaded: ${urlData.publicUrl}`)
        uploaded++
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`)
      failed++
    }
  }

  console.log('')
  console.log('=' .repeat(50))
  console.log(`✅ Upload complete: ${uploaded} succeeded, ${failed} failed`)
  console.log('')

  if (uploaded > 0) {
    console.log('🎉 Next steps:')
    console.log('1. Your models are now on Supabase CDN')
    console.log('2. Update your .env with Supabase credentials (already done)')
    console.log('3. The app will automatically load models from Supabase')
    console.log('4. Deploy your app: npm run build && netlify deploy --prod')
  }
}

uploadModels().catch(console.error)
