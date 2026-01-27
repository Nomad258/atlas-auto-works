# Google Drive 3D Models Setup Guide

This guide explains how to upload high-quality 3D models to Google Drive and integrate them with the Atlas Auto Works configurator.

## Step 1: Download High-Quality Models

You need API keys for these services to download professional models:

### CGTrader (Best for Professional Models)
1. Create account at https://www.cgtrader.com
2. Download free models or purchase premium ones
3. Look for models in these categories:
   - BBS Wheels: https://www.cgtrader.com/3d-models/bbs-wheel
   - Vossen Wheels: https://www.cgtrader.com/3d-models/vossen
   - Brembo Brakes: https://www.cgtrader.com/3d-models?keywords=brembo
   - Car Spoilers: https://www.cgtrader.com/3d-models?keywords=car+spoiler

### RenderHub (GLB Format Available)
1. Create account at https://www.renderhub.com
2. Browse free models: https://www.renderhub.com/free-3d-models/car-parts/wheels
3. Look for models with Khronos GLB format

### TurboSquid
1. Create account at https://www.turbosquid.com
2. Browse free models: https://www.turbosquid.com/Search/3D-Models/free/car-parts

## Step 2: Convert to GLB Format

If models aren't in GLB format, convert them:

### Using Blender (Free)
1. Open Blender
2. File > Import > [your format] (OBJ, FBX, etc.)
3. File > Export > glTF 2.0 (.glb/.gltf)
4. Choose "glTF Binary (.glb)" format
5. Enable "Apply Modifiers" for best results

### Using Online Converter
- https://gltf.report/ - Free online GLTF/GLB converter
- https://www.creators3d.com/online-viewer - View and convert 3D files

## Step 3: Upload to Google Drive

Your Google Drive folder structure is already set up:

```
~/Library/CloudStorage/GoogleDrive-housenlax@gmail.com/My Drive/atlas-auto-works/
├── cars/
├── wheels/
│   ├── rims/
│   └── tires/
├── bodykits/
│   ├── bumpers/
│   ├── spoilers/
│   ├── diffusers/
│   └── skirts/
├── accessories/
│   ├── exhaust/
│   ├── brakes/
│   └── lighting/
└── interior/
```

### Upload Steps:
1. Copy your GLB files to the appropriate folder
2. Open Google Drive web: https://drive.google.com
3. Right-click the file > "Get link"
4. Change sharing to "Anyone with the link can view"
5. Copy the file ID from the URL

### Getting the File ID:
From a share link like:
`https://drive.google.com/file/d/1ABC123def456GHI789/view`

The file ID is: `1ABC123def456GHI789`

## Step 4: Update Storage Config

Add the file IDs to `/src/config/storageConfig.js`:

```javascript
// Premium Google Drive wheels
'r101': { backend: STORAGE_BACKENDS.GOOGLE_DRIVE, fileId: 'YOUR_BBS_LM_FILE_ID' },
'r102': { backend: STORAGE_BACKENDS.GOOGLE_DRIVE, fileId: 'YOUR_VOSSEN_VFS_FILE_ID' },
```

## Step 5: Add to Products Catalog

Update the products in `/netlify/functions/products.js` to include the new models:

```javascript
{
  id: 'r101',
  name: 'BBS LM Premium',
  category: 'wheels',
  price: 85000, // MAD
  // ... other product details
}
```

## Recommended Models to Download

### Premium Wheels (High Priority)
1. **BBS LM** - Classic 2-piece design
2. **BBS CH-R** - Modern performance
3. **Vossen VFS-6** - Luxury concave
4. **HRE P101** - Forged monoblock
5. **Rotiform LAS-R** - Street style

### Brake Systems
1. **Brembo GT Kit** - 6-piston calipers
2. **AP Racing CP9660** - Race-spec
3. **Wilwood AERO6** - Track performance

### Exhaust Systems
1. **Akrapovic Evolution** - Titanium system
2. **Capristo Valvetronic** - Carbon tips
3. **IPE F1** - Stainless race exhaust

### Bodykits
1. **Vorsteiner VRS** - Carbon aero
2. **Liberty Walk** - Wide body
3. **RWB** - Porsche style
4. **Novitec Rosso** - Ferrari tuning

## File Size Guidelines

- **Local (public folder)**: < 10MB ideal, max 50MB
- **Google Drive**: No limit, but optimize for web (< 50MB recommended)
- **Supabase**: Good for 10-100MB files

## Optimization Tips

1. **Reduce polygon count** in Blender (Decimate modifier)
2. **Compress textures** to 2K or 1K resolution
3. **Remove hidden geometry** (faces inside the model)
4. **Use Draco compression** when exporting GLB
5. **Test load time** before adding to production

## Testing

After adding a new model:

1. Add entry to `MODEL_REGISTRY` in `storageConfig.js`
2. Add entry to `wheelConfigs.js` or `partConfigs.js`
3. Add product to `products.js`
4. Test in browser at http://localhost:3002/configure
5. Select the product and verify 3D model loads

## Troubleshooting

### Model doesn't load
- Check console for errors
- Verify file is shared publicly on Google Drive
- Check file ID is correct in config

### Model loads incorrectly
- Check scale settings in config
- Verify model orientation (Y-up vs Z-up)
- Test in Blender first

### CORS errors
- Make sure you're using the Netlify proxy URL
- File must be shared with "Anyone with the link"
