#!/usr/bin/env node

/**
 * Upload Car Models to Supabase Storage using S3 API
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const SUPABASE_PROJECT_REF = 'xoyyudojecpytvyisjqv'
const BUCKET_NAME = 'cars'
const MODELS_DIR = path.join(__dirname, '../temp-models/cars')

// S3 Configuration for Supabase
const s3Client = new S3Client({
  region: 'us-east-1', // Supabase uses this region
  endpoint: `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY,
  },
  forcePathStyle: true,
})

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║     Atlas Auto Works - S3 Upload to Supabase              ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Validate credentials
  if (!process.env.SUPABASE_S3_ACCESS_KEY || !process.env.SUPABASE_S3_SECRET_KEY) {
    console.error('❌ Missing S3 credentials in .env file')
    console.error('Expected: SUPABASE_S3_ACCESS_KEY and SUPABASE_S3_SECRET_KEY')
    process.exit(1)
  }

  console.log('✅ S3 Access Key:', process.env.SUPABASE_S3_ACCESS_KEY.substring(0, 10) + '...')
  console.log('✅ S3 Endpoint:', `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`)
  console.log('✅ Bucket:', BUCKET_NAME)
  console.log('')

  // Find all GLB files
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

  if (!fs.existsSync(MODELS_DIR)) {
    console.error(`❌ Models directory not found: ${MODELS_DIR}`)
    process.exit(1)
  }

  findGLBFiles(MODELS_DIR)

  if (glbFiles.length === 0) {
    console.error('❌ No GLB files found')
    process.exit(1)
  }

  console.log(`✅ Found ${glbFiles.length} car models`)
  console.log('')

  // Check existing files
  console.log('📋 Checking existing files in bucket...')
  let existingFiles = []
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    })
    const response = await s3Client.send(listCommand)
    existingFiles = (response.Contents || []).map(obj => obj.Key)
    console.log(`✅ Found ${existingFiles.length} existing files in bucket`)
  } catch (error) {
    console.log(`⚠️  Could not list existing files: ${error.message}`)
    console.log('   Will attempt uploads anyway...')
  }
  console.log('')

  // Upload models
  console.log('📤 Uploading Car Models to Supabase...')
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

    // Skip if already exists
    if (existingFiles.includes(fileName)) {
      console.log('⏭️  Already exists')
      skipped++
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(filePath)

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'model/gltf-binary',
      })

      await s3Client.send(command)
      console.log('✅ Uploaded')
      uploaded++
    } catch (error) {
      console.log(`❌ ${error.message}`)
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
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const sampleFile = path.basename(glbFiles[0])
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${sampleFile}`

    console.log('🔗 Sample Model URL:')
    console.log(`   ${publicUrl}`)
    console.log('')
    console.log('✅ Your car models are now hosted on Supabase CDN!')
    console.log('')
    console.log('📝 Next Steps:')
    console.log('   1. Test locally: npm run dev')
    console.log('   2. Add Supabase env vars to Netlify:')
    console.log(`      netlify env:set VITE_SUPABASE_URL "${supabaseUrl}"`)
    console.log(`      netlify env:set VITE_SUPABASE_ANON_KEY "${process.env.VITE_SUPABASE_ANON_KEY}"`)
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
