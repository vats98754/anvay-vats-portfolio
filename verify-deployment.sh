#!/bin/bash

# GitHub Pages Asset Verification Script
# This script helps verify that all required assets are present and accessible

echo "🔍 GitHub Pages Asset Verification"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the portfolio root directory"
    exit 1
fi

echo "✅ Running from correct directory"

# Check CNAME file
echo ""
echo "📄 Checking CNAME configuration..."
if [ -f "CNAME" ]; then
    CNAME_CONTENT=$(cat CNAME)
    echo "✅ CNAME file exists: $CNAME_CONTENT"
    
    if [ "$CNAME_CONTENT" = "anvay.blog" ]; then
        echo "✅ CNAME correctly set to anvay.blog"
    else
        echo "⚠️  CNAME is not set to anvay.blog (current: $CNAME_CONTENT)"
    fi
else
    echo "❌ CNAME file missing"
fi

# Check critical asset files
echo ""
echo "📦 Checking GLTF asset files..."
GLTF_ASSETS=(
    "assets/the_thinker_by_auguste_rodin/scene.gltf"
    "assets/brain_point_cloud/scene.gltf"
    "assets/shiba/scene.gltf"
    "assets/an-animated-cat/source/scene.gltf"
    "assets/arduino_uno_r3_elegoo/scene.gltf"
    "assets/stylized_planet/scene.gltf"
)

for asset in "${GLTF_ASSETS[@]}"; do
    if [ -f "$asset" ]; then
        SIZE=$(ls -lh "$asset" | awk '{print $5}')
        echo "✅ $asset ($SIZE)"
    else
        echo "❌ Missing: $asset"
    fi
done

# Check Three.js libraries
echo ""
echo "🎮 Checking Three.js libraries..."
THREE_LIBS=(
    "lib/three/three.min.js"
    "lib/three/GLTFLoader.js"
)

for lib in "${THREE_LIBS[@]}"; do
    if [ -f "$lib" ]; then
        SIZE=$(ls -lh "$lib" | awk '{print $5}')
        echo "✅ $lib ($SIZE)"
    else
        echo "❌ Missing: $lib"
    fi
done

# Check compiled TypeScript
echo ""
echo "🔧 Checking compiled TypeScript..."
if [ -f "dist/main.js" ]; then
    SIZE=$(ls -lh "dist/main.js" | awk '{print $5}')
    echo "✅ dist/main.js ($SIZE)"
else
    echo "❌ Missing: dist/main.js - Run 'npm run build'"
fi

# Check debug tools
echo ""
echo "🛠️  Checking debug tools..."
if [ -f "debug-assets.html" ]; then
    echo "✅ debug-assets.html available"
else
    echo "❌ Missing: debug-assets.html"
fi

# Git status check
echo ""
echo "📝 Git status..."
if command -v git &> /dev/null; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        BRANCH=$(git branch --show-current)
        echo "✅ Current branch: $BRANCH"
        
        if [ "$BRANCH" = "threejs" ]; then
            echo "✅ On correct branch for Three.js deployment"
        else
            echo "⚠️  Consider switching to 'threejs' branch for Three.js features"
        fi
        
        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            echo "⚠️  Uncommitted changes detected"
            echo "   Consider committing and pushing changes for deployment"
        else
            echo "✅ No uncommitted changes"
        fi
    else
        echo "❌ Not a git repository"
    fi
else
    echo "⚠️  Git not available"
fi

echo ""
echo "🌐 Testing URLs that should work after deployment:"
echo "   Main site: https://anvay.blog/"
echo "   Debug tool: https://anvay.blog/debug-assets.html"
echo "   Sample asset: https://anvay.blog/assets/the_thinker_by_auguste_rodin/scene.gltf"

echo ""
echo "💡 Next steps:"
echo "   1. Commit and push changes if needed"
echo "   2. Wait 5-10 minutes for GitHub Pages deployment"
echo "   3. Test https://anvay.blog/debug-assets.html"
echo "   4. Check browser console for any errors"

echo ""
echo "=================================="
echo "🎯 Verification complete!"
