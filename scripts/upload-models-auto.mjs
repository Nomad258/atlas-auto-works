#!/usr/bin/env node

/**
 * Automated Supabase Model Upload (Non-Interactive)
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const BUCKET_NAME = 'cars'
const MODELS_DIR = path.join(__dirname, '../temp-models/cars')

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║     Atlas Auto Works - Supabase Model Upload              ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Validate credentials
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file')
    console.log('Expected:')
    console.log('  VITE_SUPABASE_URL=', SUPABASE_URL || '(not set)')
    console.log('  VITE_SUPABASE_ANON_KEY=', SUPABASE_KEY ? '(set)' : '(not set)')
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
    console.log(`   Found ${data.length} existing buckets`)
    console.log('')
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }

  // Step 2: Verify bucket exists (skip creation, assume user created it)
  console.log('🪣 Verifying Storage Bucket...')
  try {
    // Try to list files in the bucket to verify it exists and is accessible
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 })

    if (error && error.message.includes('not found')) {
      console.error(`❌ Bucket "${BUCKET_NAME}" not found`)
      console.error('Please create the bucket manually in Supabase dashboard:')
      console.error('   1. Name: ' + BUCKET_NAME)
      console.error('   2. Make it PUBLIC')
      process.exit(1)
    } else if (error) {
      throw error
    }

    console.log(`✅ Bucket "${BUCKET_NAME}" is ready and accessible`)
    console.log('')
  } catch (error) {
    console.error('❌ Bucket verification failed:', error.message)
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
  } else {
    console.error(`❌ Models directory not found: ${MODELS_DIR}`)
    process.exit(1)
  }

  if (glbFiles.length === 0) {
    console.error('❌ No GLB files found in', MODELS_DIR)
    console.log('Make sure you have the temp-models directory with car files')
    process.exit(1)
  }

  console.log(`✅ Found ${glbFiles.length} car models`)
  console.log('')

  // Step 4: Upload models
  console.log('📤 Uploading Car Models to Supabase CDN...')
  console.log('─'.repeat(60))

  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < glbFiles.length; i++) {
    const filePath = glbFiles[i]
    const fileName = path.basename(filePath)
    const fileSize = fs.statSync(filePath).size
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)

    const displayName = fileName.length > 45 ? fileName.substring(0, 42) + '...' : fileName
    process.stdout.write(`[${String(i + 1).padStart(2)}/${glbFiles.length}] ${displayName.padEnd(48)} ${fileSizeMB.padStart(6)}MB... `)

    try {
      // Check if exists
      const { data: existing } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { search: fileName })

      if (existing && existing.length > 0) {
        console.log('⏭️  Already exists')
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
        console.log('✅ Uploaded')
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
  console.log(`   📦 Total:    ${uploaded + skipped} models available`)
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
    console.log('      netlify env:set VITE_SUPABASE_URL "' + SUPABASE_URL + '"')
    console.log('      netlify env:set VITE_SUPABASE_ANON_KEY "' + SUPABASE_KEY + '"')
    console.log('   3. Build and deploy:')
    console.log('      npm run build && netlify deploy --prod')
    console.log('')
  }
}

main().catch(error => {
  console.error('\n❌ Upload failed:', error.message)
  console.error(error)
  process.exit(1)
})
