#!/bin/bash

# Google Drive API Setup Script for Atlas Auto Works
# This script helps you set up Google Drive API access for large 3D model files

echo "========================================"
echo "Atlas Auto Works - Google Drive API Setup"
echo "========================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK (gcloud) is not installed."
    echo ""
    echo "Install it with Homebrew:"
    echo "  brew install google-cloud-sdk"
    echo ""
    echo "Or download from:"
    echo "  https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "Step 1: Create or select a Google Cloud Project"
echo "------------------------------------------------"
echo ""
echo "If you already have a project, enter its ID."
echo "If not, enter a new project name to create one."
echo ""
read -p "Project ID (or new name): " PROJECT_ID

# Check if project exists
if gcloud projects describe "$PROJECT_ID" &> /dev/null; then
    echo "Using existing project: $PROJECT_ID"
else
    echo "Creating new project: $PROJECT_ID"
    gcloud projects create "$PROJECT_ID" --name="$PROJECT_ID"
fi

# Set the project
gcloud config set project "$PROJECT_ID"

echo ""
echo "Step 2: Enable Google Drive API"
echo "--------------------------------"
gcloud services enable drive.googleapis.com

echo ""
echo "Step 3: Create Service Account"
echo "------------------------------"
SA_NAME="atlas-auto-drive"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Check if service account exists
if gcloud iam service-accounts describe "$SA_EMAIL" &> /dev/null; then
    echo "Service account already exists: $SA_EMAIL"
else
    echo "Creating service account: $SA_NAME"
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="Atlas Auto Works Drive Access"
fi

echo ""
echo "Step 4: Generate Service Account Key"
echo "------------------------------------"
KEY_FILE="./google-drive-key.json"
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SA_EMAIL"

echo ""
echo "Step 5: Encode key for Netlify"
echo "------------------------------"
ENCODED_KEY=$(base64 -i "$KEY_FILE")

echo ""
echo "========================================"
echo "SETUP COMPLETE!"
echo "========================================"
echo ""
echo "Service Account Email (share files with this):"
echo "  $SA_EMAIL"
echo ""
echo "Add this environment variable to Netlify:"
echo "  Variable Name: GOOGLE_SERVICE_ACCOUNT_KEY"
echo "  Variable Value: $ENCODED_KEY"
echo ""
echo "To add it via CLI:"
echo "  netlify env:set GOOGLE_SERVICE_ACCOUNT_KEY '$ENCODED_KEY'"
echo ""
echo "IMPORTANT: Share your Google Drive folder with the service account email above!"
echo ""
echo "The key file is saved at: $KEY_FILE"
echo "Delete it after adding to Netlify for security."
echo ""
