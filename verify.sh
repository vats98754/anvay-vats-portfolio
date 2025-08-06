#!/bin/bash

# Quick verification script for the TypeScript portfolio
echo "🔍 Verifying TypeScript Portfolio Setup..."

# Check if source files exist
echo "📁 Checking source files..."
for file in "src/main.ts" "src/types.ts" "src/config/Config.ts" "src/scene/SceneManager.ts" "src/ui/UIHandler.ts" "src/utils/Utils.ts"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file missing"
    fi
done

# Check if compiled files exist
echo "🔨 Checking compiled files..."
for file in "dist/main.js" "dist/types.js" "dist/config/Config.js" "dist/scene/SceneManager.js" "dist/ui/UIHandler.js" "dist/utils/Utils.js"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file missing"
    fi
done

# Check HTML update
echo "🌐 Checking HTML..."
if grep -q "dist/main.js" index.html; then
    echo "  ✅ HTML updated to use compiled modules"
else
    echo "  ❌ HTML not updated"
fi

# Check file sizes
echo "📊 File sizes:"
du -h dist/*.js dist/**/*.js 2>/dev/null | sort

echo ""
echo "🎯 Setup complete! To test:"
echo "   1. Run: python3 -m http.server 8000"
echo "   2. Open: http://localhost:8000"
echo ""
