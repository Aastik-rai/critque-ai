# Deploy to Heroku

## Prerequisites
- Heroku CLI installed
- Git repository
- MongoDB Atlas account (for production database)

## Steps

### 1. Prepare for Heroku
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

### 2. Create Heroku App
```bash
# Create new Heroku app
heroku create your-app-name

# Add MongoDB Atlas addon (or use your own MongoDB)
heroku addons:create mongolab:sandbox
```

### 3. Set Environment Variables
```bash
# Set your environment variables
heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
heroku config:set OPENAI_API_KEY=your-openai-api-key-here
heroku config:set NODE_ENV=production
```

### 4. Update package.json for Heroku
Add this to your package.json:
```json
{
  "scripts": {
    "heroku-postbuild": "cd client && npm install && npm run build"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 5. Deploy
```bash
# Add and commit changes
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy to Heroku
git push heroku main
```

### 6. Open Your App
```bash
heroku open
```

## Troubleshooting
- Check logs: `heroku logs --tail`
- Restart app: `heroku restart`
- Check config: `heroku config`
