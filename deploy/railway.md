# Deploy to Railway

## Prerequisites
- Railway account
- GitHub repository

## Steps

### 1. Connect to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 2. Configure Environment Variables
In Railway dashboard:
- Go to your project
- Click on "Variables" tab
- Add these variables:
  ```
  NODE_ENV=production
  JWT_SECRET=your-super-secret-jwt-key-here
  OPENAI_API_KEY=your-openai-api-key-here
  MONGODB_URI=mongodb://localhost:27017/critique-ai
  ```

### 3. Add MongoDB Database
1. In Railway dashboard, click "New"
2. Select "Database" → "MongoDB"
3. Copy the connection string
4. Update MONGODB_URI in your environment variables

### 4. Configure Build Settings
Railway will automatically detect your Node.js app. Make sure your `package.json` has:
```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "start": "node server.js"
  }
}
```

### 5. Deploy
Railway will automatically deploy when you push to your main branch:
```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### 6. Access Your App
Railway will provide you with a URL like `https://your-app-name.railway.app`

## Benefits of Railway
- Automatic deployments from GitHub
- Built-in MongoDB database
- Environment variable management
- Automatic HTTPS
- Global CDN
