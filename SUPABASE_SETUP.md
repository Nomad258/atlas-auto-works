# 🚀 Automated Supabase Setup Guide

This guide will help you set up cloud storage for your car 3D models using Supabase (free tier includes 1GB storage).

## Why Supabase?

- ✅ **Free tier**: 1GB storage, plenty for car models
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **No deploy size limits**: Keep your Netlify build small
- ✅ **Easy updates**: Add/remove models without redeploying
- ✅ **Professional**: Production-ready infrastructure

## Quick Setup (5 minutes)

### Step 1: Create Supabase Account (1 minute)

1. Go to https://supabase.com
2. Click "Start your project" (free!)
3. Sign up with GitHub (easiest) or email

### Step 2: Create a Project (2 minutes)

1. Click "New project"
2. Fill in:
   - **Name**: `atlas-auto-works`
   - **Database Password**: Generate a strong password (you won't need it for this setup)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
3. Click "Create new project"
4. Wait ~2 minutes for project to initialize ☕

### Step 3: Get Your Credentials (30 seconds)

1. Once project is ready, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
3. Keep this tab open, you'll need these values

### Step 4: Run Automated Setup (2 minutes)

Open your terminal and run:

```bash
npm run setup-supabase
```

The script will:
1. ✅ Ask for your Supabase URL and anon key
2. ✅ Test the connection
3. ✅ Create the `car-models` storage bucket
4. ✅ Upload all 37 car models (~780MB)
5. ✅ Update your `.env` file
6. ✅ Test that models are accessible

**That's it!** Your models are now in the cloud.

## Step 5: Deploy to Netlify

Now add the Supabase variables to Netlify:

```bash
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
```

Or set them in the Netlify dashboard:
1. Go to https://app.netlify.com
2. Select your site (papaya-nougat-5c5076)
3. Go to **Site settings** → **Environment variables**
4. Add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon key

Then deploy:

```bash
npm run build
netlify deploy --prod
```

## How It Works

The app now:
1. **Tries Supabase first**: Loads models from CDN (fast!)
2. **Falls back to local**: If Supabase isn't configured, uses procedural models
3. **Smart caching**: Browser caches models for instant loading

## Model URLs

Your models are now available at:
```
https://xxxxx.supabase.co/storage/v1/object/public/car-models/bmw_m3.glb
```

The app automatically uses these URLs when Supabase is configured.

## Managing Models

### Add a New Model

1. Go to Supabase Dashboard → Storage → car-models
2. Click "Upload file"
3. Upload your GLB file
4. Add mapping in `src/utils/carModelMapping.js`:

```javascript
'new-car-key': 'new-car-model.glb',
```

### Delete a Model

1. Go to Supabase Dashboard → Storage → car-models
2. Find the file → click "..." → Delete

No need to redeploy! Changes are instant.

## Troubleshooting

### "Connection failed"
- Check your Project URL and anon key are correct
- Make sure project is fully initialized (green status in Supabase)

### "Bucket creation failed"
- Create bucket manually:
  1. Go to Supabase Dashboard → Storage
  2. Click "New bucket"
  3. Name: `car-models`
  4. Make it **PUBLIC**
  5. Run setup script again

### "Models not loading"
- Check browser console for errors
- Verify environment variables are set in Netlify
- Make sure models are uploaded and bucket is public

### "Upload failed"
- Check file size (max 50MB per file)
- Verify bucket exists and is public
- Some models might be too large - that's okay, skip them

## Cost Estimation

**Free Tier Limits:**
- Storage: 1GB (our models: ~780MB ✅)
- Bandwidth: 2GB/month
- Storage requests: 50k/month

With 100 users/day viewing 5 cars each:
- Monthly bandwidth: ~390MB (well under 2GB ✅)
- FREE! 🎉

For higher traffic, upgrade to Pro ($25/mo) for 100GB bandwidth.

## Cleanup Local Models

After successful upload, you can remove local models to save space:

```bash
rm -rf public/models
rm -rf temp-models
```

The app will load everything from Supabase instead!

## Support

If you run into issues:
1. Check the browser console for errors
2. Verify Supabase credentials are correct
3. Ensure bucket is public and models are uploaded
4. Check network tab to see if model URLs are correct
