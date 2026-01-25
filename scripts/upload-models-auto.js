#!/usr/bin/env node

/**
 * Automated Supabase Model Upload (Non-Interactive)
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const BUCKET_NAME = 'car-models'
const MODELS_DIR = path.join(__dirname, '../temp-models/cars')

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║     Atlas Auto Works - Supabase Model Upload              ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Validate credentials
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file')
    process.exit(1)
  }

  console.log('✅ Supabase URL:', SUPABASE_URL)
  console.log('✅ API Key:', SUPABASE_KEY.substring(0, 20) + '...')
  console.log('')

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Step 1: Test connection
  console.log('🔌 Testing Connection...')
  try {
    const { data, error } = await supabase.storage.listBuckets()
    if (error) throw error
    console.log('✅ Connected successfully!')
    console.log('')
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }

  // Step 2: Create/verify bucket
  console.log('🪣 Setting Up Storage Bucket...')
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets.some(b => b.name === BUCKET_NAME)

    if (bucketExists) {
      console.log(`✅ Bucket "${BUCKET_NAME}" already exists`)
    } else {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800,
      })
      if (error) throw error
      console.log(`✅ Created bucket "${BUCKET_NAME}"`)
    }
    console.log('')
  } catch (error) {
    console.error('❌ Bucket setup failed:', error.message)
    console.error('Please create the bucket manually in Supabase dashboard')
    process.exit(1)
  }

  // Step 3: Find GLB files
  console.log('🔍 Finding Car Models...')
  const glbFiles = []

  function findGLBFiles(dir) {
    try {
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
    } catch (error) {
      // Ignore
    }
  }

  if (fs.existsSync(MODELS_DIR)) {
    findGLBFiles(MODELS_DIR)
  }

  if (glbFiles.length === 0) {
    console.error('❌ No GLB files found in', MODELS_DIR)
    console.log('Make sure you have the temp-models directory with car files')
    process.exit(1)
  }

  console.log(`✅ Found ${glbFiles.length} car models`)
  console.log('')

  // Step 4: Upload models
  console.log('📤 Uploading Car Models...')
  console.log('─'.repeat(60))

  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < glbFiles.length; i++) {
    const filePath = glbFiles[i]
    const fileName = path.basename(filePath)
    const fileSize = fs.statSync(filePath).size
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)

    process.stdout.write(`[${i + 1}/${glbFiles.length}] ${fileName.padEnd(50)} ${fileSizeMB.padStart(6)}MB... `)

    try {
      // Check if exists
      const { data: existing } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { search: fileName })

      if (existing && existing.length > 0) {
        console.log('⏭️  ')
        skipped++
        continue
      }

      // Upload
      const fileBuffer = fs.readFileSync(filePath)
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: 'model/gltf-binary',
          upsert: false
        })

      if (error) {
        console.log(`❌ ${error.message}`)
        failed++
      } else {
        console.log('✅')
        uploaded++
      }
    } catch (err) {
      console.log(`❌ ${err.message}`)
      failed++
    }
  }

  console.log('─'.repeat(60))
  console.log('')

  // Summary
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                   Upload Complete!                         ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📊 Results:`)
  console.log(`   ✅ Uploaded: ${uploaded} models`)
  console.log(`   ⏭️  Skipped:  ${skipped} models (already exist)`)
  console.log(`   ❌ Failed:   ${failed} models`)
  console.log('')

  if (uploaded > 0 || skipped > 0) {
    // Test URL
    const testFile = path.basename(glbFiles[0])
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(testFile)

    console.log('🔗 Sample Model URL:')
    console.log(`   ${data.publicUrl}`)
    console.log('')
    console.log('✅ Your car models are now hosted on Supabase CDN!')
    console.log('')
    console.log('📝 Next Steps:')
    console.log('   1. Test locally: npm run dev')
    console.log('   2. Add Supabase env vars to Netlify:')
    console.log('      - VITE_SUPABASE_URL')
    console.log('      - VITE_SUPABASE_ANON_KEY')
    console.log('   3. Deploy: npm run build && netlify deploy --prod')
    console.log('')
  }
}

main().catch(error => {
  console.error('\n❌ Upload failed:', error.message)
  console.error(error)
  process.exit(1)
})
