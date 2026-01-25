#!/bin/bash

# Atlas Auto Works - Car Model Download Helper
# This script helps you download and organize 25 car models

echo "🚗 Atlas Auto Works - Car Model Downloader"
echo "=========================================="
echo ""

MODELS_DIR="/Users/hamza/Desktop/car configuration app/atlas-auto-works/public/models"

# Create models directory
mkdir -p "$MODELS_DIR"

echo "📁 Models will be saved to: $MODELS_DIR"
echo ""
echo "🔍 Opening Sketchfab search pages in your browser..."
echo ""

# Function to open Sketchfab search
open_search() {
    local search_term="$1"
    local filename="$2"
    echo "  → Searching for: $search_term"
    echo "    Save as: $filename"
    open "https://sketchfab.com/search?features=downloadable&q=$(echo $search_term | sed 's/ /%20/g')&sort_by=-likeCount&type=models"
    sleep 2
}

echo "📥 Opening searches (save each as GLB format)..."
echo ""

# Sports Cars
open_search "Porsche 911 2023" "porsche-911-carrera.glb"
open_search "BMW M3 2016" "bmw-m3.glb"
open_search "BMW M4 2023" "bmw-m4.glb"
open_search "Ferrari 488 GTB" "ferrari-488-gtb.glb"
open_search "Ferrari Roma 2023" "ferrari-roma.glb"

# Luxury Sedans
open_search "Mercedes C63 AMG" "mercedes-benz-c63-amg.glb"
open_search "Mercedes E-Class" "mercedes-benz-e-class.glb"
open_search "BMW 328i sedan" "bmw-328i.glb"
open_search "Audi A6 sedan" "audi-a6.glb"

# SUVs
open_search "Range Rover Sport" "land-rover-range-rover-sport.glb"
open_search "Range Rover 2024" "land-rover-range-rover.glb"
open_search "Porsche Cayenne" "porsche-cayenne.glb"
open_search "Mercedes GLE 450" "mercedes-benz-gle-450.glb"
open_search "Lamborghini Urus" "lamborghini-urus.glb"

# Performance
open_search "Audi R8 V10" "audi-r8.glb"
open_search "Audi RS6 Avant wagon" "audi-rs6-avant.glb"
open_search "Lamborghini Huracan" "lamborghini-huracan.glb"
open_search "Porsche 718 Cayman" "porsche-718-cayman.glb"

echo ""
echo "=========================================="
echo "📋 INSTRUCTIONS:"
echo ""
echo "1. For each browser tab that opened:"
echo "   - Find a good model (check downloads/likes)"
echo "   - Click the model"
echo "   - Click 'Download 3D Model' button"
echo "   - Select format: glTF (.glb)"
echo "   - Download"
echo ""
echo "2. After downloading, rename files as shown above"
echo ""
echo "3. Move all .glb files to:"
echo "   $MODELS_DIR"
echo ""
echo "4. Build and deploy:"
echo "   cd '/Users/hamza/Desktop/car configuration app/atlas-auto-works'"
echo "   npm run build"
echo "   netlify deploy --prod"
echo ""
echo "🎉 Your 3D viewer will then show real car models!"
echo ""
