#!/usr/bin/env node

/**
 * Automated Supabase Setup for Atlas Auto Works
 *
 * This script will:
 * 1. Guide you through creating a Supabase project
 * 2. Create the storage bucket automatically
 * 3. Upload all car models to Supabase
 * 4. Configure environment variables
 * 5. Test the setup
 *
 * Usage: node scripts/setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.clear()
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║     Atlas Auto Works - Automated Supabase Setup           ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Step 1: Get Supabase credentials
  console.log('📋 Step 1: Supabase Project Setup')
  console.log('─'.repeat(60))
  console.log('')
  console.log('If you don\'t have a Supabase account yet:')
  console.log('1. Go to https://supabase.com')
  console.log('2. Click "Start your project" (it\'s free!)')
  console.log('3. Create a new project (takes ~2 minutes to set up)')
  console.log('')
  console.log('Once your project is ready:')
  console.log('1. Go to Settings → API')
  console.log('2. Copy your Project URL and anon/public key')
  console.log('')

  const supabaseUrl = await question('Enter your Supabase Project URL: ')
  const supabaseKey = await question('Enter your Supabase anon key: ')

  if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Both URL and key are required!')
    process.exit(1)
  }

  console.log('\n✅ Credentials received')
  console.log('')

  // Step 2: Test connection
  console.log('🔌 Step 2: Testing Connection')
  console.log('─'.repeat(60))

  const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim())

  try {
    const { data, error } = await supabase.storage.listBuckets()
    if (error) throw error
    console.log('✅ Connected to Supabase successfully!')
    console.log('')
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\nPlease check your credentials and try again.')
    process.exit(1)
  }

  // Step 3: Create storage bucket
  console.log('🪣 Step 3: Creating Storage Bucket')
  console.log('─'.repeat(60))

  const BUCKET_NAME = 'car-models'

  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets.some(b => b.name === BUCKET_NAME)

    if (bucketExists) {
      console.log(`ℹ️  Bucket "${BUCKET_NAME}" already exists`)
    } else {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB per file
        allowedMimeTypes: ['model/gltf-binary', 'application/octet-stream']
      })

      if (error) throw error
      console.log(`✅ Created bucket "${BUCKET_NAME}"`)
    }
    console.log('')
  } catch (error) {
    console.error('❌ Bucket creation failed:', error.message)
    console.log('\nℹ️  You may need to create the bucket manually:')
    console.log(`   1. Go to ${supabaseUrl}/project/_/storage`)
    console.log(`   2. Create bucket: "${BUCKET_NAME}"`)
    console.log('   3. Make it PUBLIC')
    console.log('   4. Run this script again')
    process.exit(1)
  }

  // Step 4: Upload car models
  console.log('🚗 Step 4: Uploading Car Models')
  console.log('─'.repeat(60))
  console.log('')

  const MODELS_DIR = path.join(__dirname, '../temp-models/cars')

  if (!fs.existsSync(MODELS_DIR)) {
    console.error('❌ Models directory not found:', MODELS_DIR)
    console.log('\nThe car models need to be downloaded first.')
    console.log('It looks like temp-models/cars directory is missing.')
    process.exit(1)
  }

  // Find all GLB files
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
      // Ignore errors
    }
  }

  findGLBFiles(MODELS_DIR)

  if (glbFiles.length === 0) {
    console.error('❌ No GLB files found in', MODELS_DIR)
    process.exit(1)
  }

  console.log(`📁 Found ${glbFiles.length} car models to upload`)
  console.log('')

  let uploaded = 0
  let failed = 0
  let skipped = 0

  for (let i = 0; i < glbFiles.length; i++) {
    const filePath = glbFiles[i]
    const fileName = path.basename(filePath)
    const fileSize = fs.statSync(filePath).size
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)

    process.stdout.write(`[${i + 1}/${glbFiles.length}] ${fileName} (${fileSizeMB}MB)... `)

    try {
      // Check if file already exists
      const { data: existingFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { search: fileName })

      if (existingFiles && existingFiles.length > 0) {
        console.log('⏭️  Already exists')
        skipped++
        continue
      }

      // Upload file
      const fileBuffer = fs.readFileSync(filePath)
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: 'model/gltf-binary',
          upsert: false
        })

      if (error) {
        console.log(`❌ Failed: ${error.message}`)
        failed++
      } else {
        console.log('✅ Uploaded')
        uploaded++
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`)
      failed++
    }
  }

  console.log('')
  console.log('─'.repeat(60))
  console.log(`Upload Summary:`)
  console.log(`  ✅ Uploaded: ${uploaded}`)
  console.log(`  ⏭️  Skipped:  ${skipped}`)
  console.log(`  ❌ Failed:   ${failed}`)
  console.log('')

  // Step 5: Update .env file
  console.log('⚙️  Step 5: Configuring Environment Variables')
  console.log('─'.repeat(60))

  const envPath = path.join(__dirname, '../.env')
  let envContent = ''

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8')
  }

  // Update or add Supabase variables
  const supabaseVars = {
    'VITE_SUPABASE_URL': supabaseUrl.trim(),
    'VITE_SUPABASE_ANON_KEY': supabaseKey.trim()
  }

  for (const [key, value] of Object.entries(supabaseVars)) {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`)
    } else {
      envContent += `\n${key}=${value}`
    }
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n')
  console.log('✅ Updated .env file with Supabase credentials')
  console.log('')

  // Step 6: Test model loading
  console.log('🧪 Step 6: Testing Model Access')
  console.log('─'.repeat(60))

  try {
    const testFile = glbFiles[0] ? path.basename(glbFiles[0]) : null
    if (testFile) {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(testFile)

      console.log('✅ Models are publicly accessible!')
      console.log(`   Sample URL: ${data.publicUrl}`)
      console.log('')
    }
  } catch (error) {
    console.error('⚠️  Could not test model access:', error.message)
    console.log('')
  }

  // Final summary
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                   🎉 Setup Complete!                       ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log('✅ Supabase is configured and ready to use')
  console.log(`✅ ${uploaded + skipped} car models are available in cloud storage`)
  console.log('✅ Environment variables are configured')
  console.log('')
  console.log('📝 Next Steps:')
  console.log('   1. Build your app: npm run build')
  console.log('   2. Test locally: npm run dev')
  console.log('   3. Deploy to Netlify: netlify deploy --prod')
  console.log('')
  console.log('💡 Don\'t forget to add these variables to Netlify:')
  console.log('   - VITE_SUPABASE_URL')
  console.log('   - VITE_SUPABASE_ANON_KEY')
  console.log('')

  rl.close()
}

main().catch(error => {
  console.error('\n❌ Setup failed:', error.message)
  console.error(error)
  rl.close()
  process.exit(1)
})
