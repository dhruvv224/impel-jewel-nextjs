# Quick Deployment Checklist

## Pre-Deployment Steps

1. **Test Build Locally:**
   ```bash
   npm install
   npm run build
   npm start  # Test the production build
   ```

2. **Check for Errors:**
   - Fix any build errors
   - Test all pages locally
   - Verify API connections

## Static Export Deployment (Easiest)

1. **Update `next.config.ts`:**
   - Add `output: 'export'`
   - Add `images: { unoptimized: true }`
   - Comment out `rewrites()` function

2. **Build:**
   ```bash
   npm run build
   ```

3. **Upload:**
   - Upload contents of `out/` folder to `public_html/`
   - Upload `.htaccess` file to root

## Node.js Deployment

1. **Upload Files:**
   - Upload entire project (except `node_modules`, `.git`)
   - Include `server.js` file

2. **In cPanel:**
   - Go to Node.js Selector
   - Create new application
   - Set startup file: `server.js`
   - Run `npm install`
   - Start application

3. **Verify:**
   - Check application is running
   - Test your domain

## Files to Upload

✅ **Upload these:**
- `.next/` folder (after build)
- `app/` folder
- `public/` folder
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `server.js` (for Node.js deployment)
- `.htaccess` (for static export)
- Any `.env.production` files (if needed)

❌ **Don't upload:**
- `node_modules/` (install on server)
- `.git/` folder
- `.next/cache/` (if exists)
- Development files

## Environment Variables

If your app needs environment variables:
- Set them in cPanel Node.js application settings
- Or create `.env.production` file (don't commit secrets!)

## Post-Deployment

- [ ] Test homepage loads
- [ ] Test navigation
- [ ] Test API calls
- [ ] Test images loading
- [ ] Test on mobile
- [ ] Check browser console for errors
- [ ] Verify SSL/HTTPS

## Troubleshooting

**404 on refresh:**
- Add/check `.htaccess` file

**API not working:**
- Check API URL in code
- Verify CORS settings
- Check network tab in browser

**Build fails:**
- Check Node.js version
- Run `npm install` again
- Check for missing dependencies

