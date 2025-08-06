#!/bin/bash

# Portfolio TypeScript Build Script
echo "🚀 Building Portfolio TypeScript..."

# Check if TypeScript is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npm/npx not found. Please install Node.js"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
npm run clean 2>/dev/null || rm -rf dist

# Build TypeScript
echo "🔨 Compiling TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Compiled files available in dist/"
    echo "🌐 Open index.html in your browser to see the result"
    
    # List the generated files
    echo "📋 Generated files:"
    find dist -name "*.js" -o -name "*.d.ts" | head -10
    
    # Show file sizes
    echo "📊 File sizes:"
    du -h dist/*.js dist/**/*.js 2>/dev/null | head -5
else
    echo "❌ Build failed!"
    exit 1
fi
