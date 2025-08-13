# GitHub Pages Deployment Guide

This guide explains how to deploy the RoadSurfer Calendar Dashboard to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

The project is configured for automatic deployment using GitHub Actions:

### 1. **Push to Main Branch**

```bash
git add .
git commit -m "feat: setup GitHub Pages deployment"
git push origin main
```

### 2. **Enable GitHub Pages**

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 3. **Monitor Deployment**

- Go to the **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow
- Once completed, your site will be available at: `https://your-username.github.io/rdserfer/`

## 🛠 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build and deploy manually
npm run deploy
```

## ⚙️ Configuration Files

The following files configure GitHub Pages deployment:

### `.github/workflows/deploy.yml`

- **Purpose**: GitHub Actions workflow for CI/CD
- **Features**: Tests, builds, and deploys automatically
- **Triggers**: Push to main branch or manual trigger

### `vite.config.ts`

- **Base URL**: Set to `/rdserfer/` for GitHub Pages
- **Build Output**: Configured for static hosting

### `public/.nojekyll`

- **Purpose**: Tells GitHub Pages not to use Jekyll
- **Effect**: Ensures proper asset serving

### `public/404.html`

- **Purpose**: Handles SPA routing for direct URL access
- **Feature**: Redirects to main page for client-side routing

## 🎯 Deployment Features

### ✅ **Automatic CI/CD Pipeline**

- Dependency installation
- Test execution (all 65 tests)
- TypeScript compilation
- Production build optimization
- Automatic deployment to GitHub Pages

### ✅ **Performance Optimizations**

- Minified assets
- Code splitting
- Tree shaking
- CSS optimization

### ✅ **Production Ready**

- Error boundaries
- Loading states
- Responsive design
- Accessibility features

## 🔧 Troubleshooting

### **Common Issues**

1. **404 Errors**
   - Ensure base URL in `vite.config.ts` matches repository name
   - Check that GitHub Pages is enabled in repository settings

2. **Assets Not Loading**
   - Verify `.nojekyll` file exists in `public` folder
   - Check console for CORS or path errors

3. **Build Failures**
   - Ensure all tests pass: `npm run test`
   - Check TypeScript errors: `npm run type-check`
   - Verify build locally: `npm run build`

### **Debug Steps**

```bash
# Check build output
npm run build
ls -la dist/

# Test locally
npm run preview

# Check GitHub Actions logs
# Go to Actions tab → Select failed workflow → View logs
```

## 📊 Build Output

Expected build artifacts:

```
dist/
├── index.html          # Main HTML file
├── 404.html            # SPA routing fallback
├── assets/
│   ├── index-*.css     # Bundled styles (~30KB)
│   └── index-*.js      # Bundled JavaScript (~190KB)
└── vite.svg           # Favicon
```

## 🌐 Live Demo

Once deployed, your application will be available at:
**https://your-username.github.io/rdserfer/**

Replace `your-username` with your actual GitHub username.

---

## 🎉 Success!

Your RoadSurfer Calendar Dashboard is now deployed and ready to use!

### **What's Included:**

- ✅ Professional Vue 3 + TypeScript application
- ✅ Comprehensive test suite (65 tests)
- ✅ Modern UI with Tailwind CSS
- ✅ Accessibility features
- ✅ Data-testid testing approach
- ✅ Automatic CI/CD deployment
- ✅ Production-optimized build
