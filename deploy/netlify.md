# Deploy to Netlify (Recommended for React Apps)

## Why Netlify?
- ✅ **Perfect for React apps**
- ✅ **Automatic builds from GitHub**
- ✅ **Free tier with generous limits**
- ✅ **Easy environment variable management**
- ✅ **No complex configuration needed**

## Steps to Deploy

### 1. Go to Netlify
1. Visit [Netlify.com](https://netlify.com)
2. Sign in with your GitHub account
3. Click **"New site from Git"**

### 2. Connect Repository
1. Select **"GitHub"** as your Git provider
2. Choose your repository: **`Aastik-rai/critque-ai`**
3. Click **"Deploy site"**

### 3. Configure Build Settings
Netlify will auto-detect your React app, but verify these settings:

**Build Command:**
```bash
cd client && npm install && npm run build
```

**Publish Directory:**
```bash
client/build
```

**Node Version:**
```bash
18
```

### 4. Add Environment Variables
In Netlify dashboard, go to **Site settings** → **Environment variables**:

```
NODE_ENV=production
REACT_APP_API_URL=https://your-api-url.vercel.app
```

### 5. Deploy!
1. Click **"Deploy site"**
2. Netlify will build and deploy your React app
3. You'll get a URL like `https://amazing-name-123456.netlify.app`

## Backend API Setup

### Option 1: Use Vercel for API Only
1. Deploy your backend to Vercel (API only)
2. Get the API URL (like `https://critque-ai-abc123.vercel.app`)
3. Update `REACT_APP_API_URL` in Netlify with this URL

### Option 2: Use Netlify Functions
1. Create `netlify/functions/` folder
2. Move your API routes there
3. Deploy everything on Netlify

## Benefits of This Approach
- ✅ **React app on Netlify** (perfect for frontend)
- ✅ **API on Vercel** (perfect for backend)
- ✅ **Both free tiers**
- ✅ **Easy to manage**
- ✅ **Automatic deployments**

## Next Steps
1. **Deploy backend API to Vercel** (should work now)
2. **Deploy frontend to Netlify** (much easier)
3. **Connect them** via environment variables
