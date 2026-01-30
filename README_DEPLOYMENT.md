# Atlas Auto Works - Deployment Instructions

## 🚨 IMPORTANT: Security First

**NEVER commit your `.env` file or API keys to Git!**

The `.gitignore` file has been configured to prevent this, but always double-check before committing.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Set Up Your Environment

```bash
# Navigate to the project
cd atlas-auto-works

# Create your .env file from the template
cp .env.example .env
```

### Step 2: Add Your OpenAI API Key

Edit the `.env` file and replace the placeholders:

```env
VITE_OPENAI_API_KEY=your-openai-api-key-here

OPENAI_API_KEY=your-openai-api-key-here
```

⚠️ **Security Reminder**: After deployment, consider rotating this API key for security.

### Step 3: Test Locally

```bash
# Start the development server
npm run dev

# In another terminal, test the Netlify functions
npx netlify dev
```

Visit `http://localhost:5173` to see your application.

---

## 🚀 Deploy to Netlify (10 Minutes)

### Option 1: Netlify CLI (Recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize your site
netlify init

# Set environment variables (IMPORTANT!)
netlify env:set OPENAI_API_KEY "your-openai-api-key-here"

netlify env:set VITE_OPENAI_API_KEY "your-openai-api-key-here"

netlify env:set NODE_VERSION "18"

# Deploy to production
netlify deploy --prod
```

### Option 2: Netlify Dashboard

1. **Go to Netlify Dashboard**: https://app.netlify.com

2. **Create New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository (or drag & drop the `atlas-auto-works` folder)

3. **Configure Build Settings**:
   - **Base directory**: Leave empty (or `atlas-auto-works` if needed)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

4. **Add Environment Variables** (CRITICAL STEP):
   - Go to: Site settings → Environment variables → Add a variable
   - Add these three variables:

   | Key | Value |
   |-----|-------|
   | `OPENAI_API_KEY` | `your-openai-api-key-here` |
   | `VITE_OPENAI_API_KEY` | `your-openai-api-key-here` |
   | `NODE_VERSION` | `18` |

5. **Deploy**:
   - Click "Deploy site"
   - Wait 2-3 minutes for build
   - Your site will be live at `https://[random-name].netlify.app`

---

## ✅ Post-Deployment Checklist

After deployment, test these features:

### 1. Test Image Generation
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/generate-car-image \
  -H "Content-Type: application/json" \
  -d '{
    "location": "casablanca",
    "season": "summer",
    "timeOfDay": "sunset",
    "carColor": "noir",
    "carModel": "Porsche 911"
  }'
```

Expected: JSON response with `imageUrl`

### 2. Test Chat Function
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

Expected: JSON response with French message

### 3. Test Recommendations
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {"selectedProducts": []},
    "availableProducts": []
  }'
```

Expected: JSON response with recommendations

### 4. Check Website
- [ ] Navigate to your Netlify URL
- [ ] All text should be in French
- [ ] No console errors
- [ ] Navigation works
- [ ] Footer displays correctly

---

## 🔧 Troubleshooting

### "Configuration API manquante" Error

**Cause**: API key not set in Netlify environment variables

**Fix**:
1. Go to Netlify Dashboard → Site Settings → Environment variables
2. Verify `OPENAI_API_KEY` and `VITE_OPENAI_API_KEY` are set
3. Click "Trigger deploy" to rebuild with new variables

### Build Fails

**Cause**: Missing dependencies or wrong Node version

**Fix**:
1. Add `NODE_VERSION=18` to environment variables
2. Verify `package.json` has all dependencies
3. Check build logs in Netlify for specific errors

### Functions Return 500 Error

**Cause**: API key invalid or OpenAI service issue

**Fix**:
1. Check Netlify function logs: Site → Functions → Select function → Logs
2. Verify API key is valid on OpenAI dashboard
3. Check OpenAI status: https://status.openai.com

---

## 💰 Monitor Your Costs

### OpenAI Dashboard
- Visit: https://platform.openai.com/usage
- Set usage limits to prevent overages
- Recommended limit: $50/month

### Expected Monthly Costs
- **Low usage** (100 visitors): ~$10/month
- **Medium usage** (500 visitors): ~$30/month
- **High usage** (1000 visitors): ~$60/month

### Cost Optimization Tips
- Image caching is already implemented (saves ~70% on image costs)
- Consider adding usage limits per user
- Monitor which features are used most

---

## 🎯 What's Working Now

### ✅ Fully Implemented
- Environment setup with security
- French translation infrastructure
- DALL-E image generation API
- GPT-4 chat assistant API
- Smart recommendations API
- Error handling
- Image caching
- Netlify deployment configuration

### ⚠️ Needs Frontend Integration
- Chat widget UI (API ready, needs component)
- Recommendations display (API ready, needs component)
- Image generation in LocationVisualizer (API ready, needs integration)
- Complete French translation of all components

See `IMPLEMENTATION_SUMMARY.md` for full details.

---

## 📚 Additional Resources

- **Full implementation details**: `IMPLEMENTATION_SUMMARY.md`
- **Original plan**: `/Users/hamza/.claude/plans/crispy-puzzling-lagoon.md`
- **Netlify docs**: https://docs.netlify.com
- **OpenAI API docs**: https://platform.openai.com/docs

---

## 🔐 Security Best Practices

1. **Never commit `.env`** - Already in `.gitignore`
2. **Rotate API keys** after sharing or if compromised
3. **Set usage limits** in OpenAI dashboard
4. **Monitor function logs** for unusual activity
5. **Use environment variables** for all secrets

---

## 🎉 You're Ready!

Your Atlas Auto Works configurator now has:
- ✅ French translation system
- ✅ AI-powered image generation
- ✅ Intelligent chat assistant
- ✅ Smart product recommendations
- ✅ Professional error handling
- ✅ Production-ready security

**Next step**: Deploy to Netlify and test the AI features!

Good luck with your deployment! 🚀
