#!/bin/bash

# Medscan AI - Vercel Deployment Script
echo "🚀 Deploying Medscan AI to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to production
echo "📦 Deploying to production..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up environment variables in Vercel dashboard"
    echo "2. Configure MongoDB Atlas connection"
    echo "3. Test the application"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Deployment failed!"
    echo "📖 Check DEPLOYMENT.md for troubleshooting"
    exit 1
fi 