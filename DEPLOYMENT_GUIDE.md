# GitHub Pages Deployment & Troubleshooting Guide

## 🚀 Deployment Status

This portfolio is deployed to GitHub Pages with a custom domain: **anvay.blog**

### Current Configuration:
- **Custom Domain**: anvay.blog
- **Repository**: vats98754/anvay-vats-portfolio
- **Branch**: threejs (for Three.js enhanced version)
- **CNAME**: anvay.blog

## 🔧 Troubleshooting Three.js Assets

### Common Issues & Solutions

#### 1. **Assets Not Loading (404 Errors)**
**Symptoms**: Three.js models don't appear, console shows 404 errors for `.gltf` files

**Solutions**:
- ✅ Verify CNAME file contains `anvay.blog`
- ✅ Check that asset files exist in the repository
- ✅ Ensure assets are not in `.gitignore`
- ✅ Wait 10-15 minutes after deployment for DNS propagation

#### 2. **CORS (Cross-Origin) Errors**
**Symptoms**: Console shows CORS policy errors when loading assets

**Solutions**:
- ✅ Assets are served from same domain (anvay.blog)
- ✅ `.htaccess` and `_headers` files configured for CORS
- ✅ Using HTTPS consistently

#### 3. **MIME Type Issues**
**Symptoms**: Assets fail to load with "incorrect MIME type" errors

**Solutions**:
- ✅ `.htaccess` configures correct MIME types for `.gltf` files
- ✅ `_headers` file provides fallback configuration
- ✅ GitHub Pages should auto-detect GLTF MIME types

## 🛠 Debug Tools

### 1. **Asset Debug Page**
Visit `/debug-assets.html` to run comprehensive asset tests:
```
https://anvay.blog/debug-assets.html
```

### 2. **Browser Console Debug Functions**
After the site loads, use these debug functions in the browser console:
```javascript
// Test asset path resolution
window.debugPortfolio.testAssetPaths();

// Get current scene information
window.debugPortfolio.getSceneInfo();

// Manually reload GLTF models
window.debugPortfolio.reloadModels();
```

### 3. **Manual Asset Tests**
Test individual assets directly in browser:
```
https://anvay.blog/assets/the_thinker_by_auguste_rodin/scene.gltf
https://anvay.blog/assets/brain_point_cloud/scene.gltf
https://anvay.blog/lib/three/three.min.js
```

## 📁 Asset Structure

```
assets/
├── the_thinker_by_auguste_rodin/
│   ├── scene.gltf
│   ├── scene.bin
│   └── textures/
├── brain_point_cloud/
│   ├── scene.gltf
│   └── scene.bin
├── shiba/
│   ├── scene.gltf
│   ├── scene.bin
│   └── textures/
└── [other models...]

lib/
└── three/
    ├── three.min.js
    ├── GLTFLoader.js
    └── GLTFLoader-legacy.js
```

## 🔄 Deployment Process

### 1. **Build Process**
```bash
npm run build  # Compiles TypeScript to JavaScript
```

### 2. **GitHub Pages Settings**
- Source: Deploy from branch `threejs`
- Custom domain: `anvay.blog`
- Enforce HTTPS: ✅ Enabled

### 3. **DNS Configuration**
Ensure your domain provider (where you bought anvay.blog) has:
```
Type: CNAME
Name: @
Value: vats98754.github.io
```

### 4. **Verification Steps**
1. Check CNAME file exists and contains `anvay.blog`
2. Run asset verification: `npm run verify-assets` (if available)
3. Test debug page: `/debug-assets.html`
4. Check browser console for errors

## 🐛 Known Issues & Workarounds

### Issue: Assets work locally but not on GitHub Pages
**Cause**: Different base paths between local and GitHub Pages
**Solution**: Code automatically detects environment and adjusts paths

### Issue: Intermittent loading failures
**Cause**: GitHub Pages CDN caching or DNS propagation
**Solution**: 
- Wait 10-15 minutes after changes
- Clear browser cache
- Use hard refresh (Ctrl+F5)

### Issue: Models appear but textures missing
**Cause**: Relative texture paths in GLTF files
**Solution**: GLTF files should use relative paths, which are supported

## 📞 Support

If assets still don't load:

1. **Check the debug page**: `/debug-assets.html`
2. **Run browser console tests**: Use `window.debugPortfolio` functions
3. **Verify DNS**: Use tools like `nslookup anvay.blog`
4. **Check GitHub Pages status**: [GitHub Status](https://www.githubstatus.com/)

## 🔄 Last Updated
This guide was last updated with the Three.js revamp deployment.

---

**Working Local Test Command:**
```bash
npx http-server -p 8080
# Then visit: http://localhost:8080
```

If it works locally but not on anvay.blog, the issue is likely deployment-specific and this guide should help resolve it.
