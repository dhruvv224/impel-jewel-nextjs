# cPanel Deployment Guide for Next.js Project

This guide covers deploying your Next.js application to cPanel hosting.

## Prerequisites

1. cPanel access with Node.js support (check with your hosting provider)
2. FTP/SFTP access or cPanel File Manager
3. SSH access (recommended, but not always available)

## Option 1: Static Export (Recommended for cPanel without Node.js)

If your cPanel doesn't support Node.js applications, you can export your Next.js app as static files.

### Step 1: Update next.config.ts for Static Export

Add the `output: 'export'` configuration:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: false,
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.impel.store',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Remove rewrites for static export - they won't work
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://admin.impel.store/api/:path*',
  //     },
  //   ];
  // },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
```

### Step 2: Build the Static Export

On your local machine:

```bash
npm run build
```

This will create a `out` folder with all static files.

### Step 3: Upload to cPanel

1. **Via cPanel File Manager:**
   - Log into cPanel
   - Open File Manager
   - Navigate to `public_html` (or your domain's root directory)
   - Upload all contents from the `out` folder
   - Make sure `index.html` is in the root

2. **Via FTP/SFTP:**
   - Connect using an FTP client (FileZilla, WinSCP, etc.)
   - Upload all files from the `out` folder to `public_html`

### Step 4: Update API Calls

Since static export doesn't support rewrites, update your API calls to use the full URL directly. Your `Call.jsx` already handles this, but ensure `NEXT_PUBLIC_API_KEY` is set if needed.

---

## Option 2: Node.js Application (If cPanel Supports Node.js)

If your cPanel hosting supports Node.js applications, follow these steps:

### Step 1: Prepare Your Application

1. **Create a `.htaccess` file** (if needed for routing):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 2: Build Your Application Locally

```bash
npm install
npm run build
```

### Step 3: Upload Files to cPanel

Upload the following to your cPanel:
- `.next` folder (build output)
- `public` folder
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `app` folder
- All other necessary files

**DO NOT upload:**
- `node_modules` (will be installed on server)
- `.git` folder
- Development files

### Step 4: Set Up Node.js Application in cPanel

1. **In cPanel, find "Node.js" or "Node.js Selector":**
   - Go to cPanel → Software → Node.js Selector (or similar)
   - Click "Create Application"

2. **Configure the Application:**
   - **Node.js Version:** Select the latest stable version (18.x or 20.x)
   - **Application Mode:** Production
   - **Application Root:** `/home/username/yourdomain.com` (or `public_html`)
   - **Application URL:** Your domain or subdomain
   - **Application Startup File:** `server.js` (you'll create this)

3. **Create `server.js` file:**

Create a `server.js` file in your project root:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

4. **Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "node server.js",
    "lint": "eslint"
  }
}
```

### Step 5: Install Dependencies and Start

1. **In cPanel Node.js Selector:**
   - Click on your application
   - Click "Run NPM Install"
   - Wait for installation to complete

2. **Start the Application:**
   - Click "Start App" or "Restart App"
   - The app should now be running

### Step 6: Environment Variables

If you need environment variables:
- In cPanel Node.js Selector, add environment variables
- Or create a `.env.production` file (make sure it's not in `.gitignore`)

---

## Option 3: Using PM2 (If SSH Access Available)

If you have SSH access, you can use PM2 for better process management:

### Step 1: Install PM2

```bash
npm install -g pm2
```

### Step 2: Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'impel-jewel-nextjs',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Step 3: Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Important Notes

### For Static Export:
- ✅ Works on any cPanel hosting
- ❌ No server-side rendering
- ❌ No API routes
- ❌ No rewrites (update API calls to use full URLs)

### For Node.js Deployment:
- ✅ Full Next.js features
- ✅ Server-side rendering
- ✅ API routes and rewrites
- ❌ Requires Node.js support from hosting provider
- ❌ May require specific port configuration

### Common Issues:

1. **404 Errors on Refresh:**
   - Add `.htaccess` file for routing (see Option 2, Step 1)

2. **API Calls Not Working:**
   - Check CORS settings on your API server
   - Verify API URL in environment variables
   - For static export, ensure API calls use full URLs

3. **Build Errors:**
   - Run `npm run build` locally first to catch errors
   - Check Node.js version compatibility

4. **Port Conflicts:**
   - cPanel may assign a specific port
   - Check your Node.js application settings in cPanel

---

## Recommended Approach

**For this project, I recommend Option 1 (Static Export)** because:
- Your app uses client-side data fetching
- API calls are already configured to work with full URLs
- Easier to deploy and maintain
- Works on any cPanel hosting

If you need server-side features later, you can switch to Option 2.

---

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify API calls are working
- [ ] Check images are loading
- [ ] Test navigation and routing
- [ ] Verify environment variables (if any)
- [ ] Check mobile responsiveness
- [ ] Test form submissions
- [ ] Verify SSL/HTTPS is working

---

## Need Help?

If you encounter issues:
1. Check cPanel error logs
2. Check browser console for errors
3. Verify file permissions (should be 644 for files, 755 for folders)
4. Contact your hosting provider for Node.js support details

