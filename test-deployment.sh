#!/bin/bash

# Atlas Auto Works - Deployment Verification Script
# Tests all Netlify functions and core features

echo "🧪 Atlas Auto Works - Deployment Verification"
echo "=============================================="
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Netlify URL"
    echo "Usage: ./test-deployment.sh https://your-site.netlify.app"
    exit 1
fi

BASE_URL=$1
echo "Testing site: $BASE_URL"
echo ""

# Test 1: Image Generation Function
echo "📸 Test 1: Image Generation (DALL-E)"
echo "-----------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/.netlify/functions/generate-car-image" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "casablanca",
    "season": "summer",
    "timeOfDay": "sunset",
    "carColor": "noir métallisé",
    "carModel": "Porsche 911"
  }')

if echo "$RESPONSE" | grep -q "imageUrl"; then
    echo "✅ PASS: Image generation working"
    echo "   Response: $(echo $RESPONSE | head -c 100)..."
else
    echo "❌ FAIL: Image generation failed"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 2: Chat Function
echo "💬 Test 2: Chat Assistant (GPT-4)"
echo "--------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/.netlify/functions/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour, quel est le prix moyen dune personnalisation?"}]
  }')

if echo "$RESPONSE" | grep -q "message"; then
    echo "✅ PASS: Chat function working"
    MESSAGE=$(echo $RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4 | head -c 80)
    echo "   Assistant: $MESSAGE..."
else
    echo "❌ FAIL: Chat function failed"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 3: Recommendations Function
echo "🎯 Test 3: Smart Recommendations"
echo "--------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/.netlify/functions/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {
      "vehicle": {"make": "Porsche", "model": "911"},
      "selectedProducts": []
    }
  }')

if echo "$RESPONSE" | grep -q "recommendations"; then
    echo "✅ PASS: Recommendations function working"
    COUNT=$(echo $RESPONSE | grep -o '"recommendations":\[' | wc -l)
    echo "   Recommendations generated successfully"
else
    echo "❌ FAIL: Recommendations function failed"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 4: Website Homepage
echo "🌐 Test 4: Website Homepage"
echo "---------------------------"
RESPONSE=$(curl -s "$BASE_URL")

if echo "$RESPONSE" | grep -q "ATLAS AUTO WORKS"; then
    echo "✅ PASS: Homepage loads correctly"
else
    echo "❌ FAIL: Homepage failed to load"
fi
echo ""

# Test 5: French Translation Check
echo "🇫🇷 Test 5: French Translation"
echo "------------------------------"
if echo "$RESPONSE" | grep -q "Accueil"; then
    echo "✅ PASS: French translations detected"
else
    echo "⚠️  WARNING: French translations may not be fully integrated"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo ""
echo "Core AI Features:"
echo "  - Image Generation (DALL-E 3)"
echo "  - Chat Assistant (GPT-4)"
echo "  - Smart Recommendations"
echo ""
echo "Next Steps:"
echo "  1. Visit $BASE_URL in your browser"
echo "  2. Test the configurator flow"
echo "  3. Check browser console for errors"
echo "  4. Review Netlify function logs"
echo ""
echo "For detailed information, see:"
echo "  - README_DEPLOYMENT.md"
echo "  - IMPLEMENTATION_SUMMARY.md"
echo ""
