# 🚀 Deployment Guide for Critique AI

This guide covers multiple deployment options for your AI personal development app.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Environment Variables Ready:**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   MONGODB_URI=your-mongodb-connection-string
   ```

2. **Database Setup:**
   - **MongoDB Atlas** (recommended for production)
   - Or local MongoDB instance

3. **OpenAI API Key:**
   - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

## 🎯 Quick Deploy Options

### 1. **Railway** (Recommended for Beginners)
- ✅ Easiest deployment
- ✅ Built-in MongoDB
- ✅ Automatic HTTPS
- ✅ Free tier available

**Steps:**
1. Go to [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically!

[📖 Detailed Railway Guide](./deploy/railway.md)

### 2. **Vercel** (Frontend + Serverless)
- ✅ Great for React apps
- ✅ Automatic deployments
- ✅ Global CDN
- ⚠️ Requires separate database

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables
4. Deploy!

### 3. **Heroku** (Traditional Hosting)
- ✅ Easy to use
- ✅ Add-ons available
- ⚠️ Requires credit card for add-ons

[📖 Detailed Heroku Guide](./deploy/heroku.md)

## 🏗️ Advanced Deployment Options

### 4. **DigitalOcean** (VPS/Cloud)
- ✅ Full control
- ✅ Cost-effective
- ✅ Multiple options (App Platform, Droplet, Kubernetes)

[📖 Detailed DigitalOcean Guide](./deploy/digitalocean.md)

### 5. **AWS** (Enterprise)
- ✅ Highly scalable
- ✅ Many services
- ⚠️ Complex setup

[📖 Detailed AWS Guide](./deploy/aws.md)

### 6. **Docker Deployment** (Any Platform)
- ✅ Consistent across platforms
- ✅ Easy scaling
- ✅ Production-ready

**Steps:**
```bash
# Build Docker image
docker build -t critique-ai .

# Run with Docker Compose
docker-compose up -d
```

## 🗄️ Database Options

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster (free tier available)
3. Get connection string
4. Add to environment variables

### Self-hosted MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Or install locally
# Follow MongoDB installation guide for your OS
```

## 🔧 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] OpenAI API key valid
- [ ] Build process working locally
- [ ] All dependencies installed
- [ ] Security considerations addressed

## 🚀 Recommended Deployment Path

### For Beginners:
1. **Railway** - Easiest, handles everything
2. **Vercel** - Great for frontend, need separate DB
3. **Heroku** - Traditional, well-documented

### For Production:
1. **DigitalOcean App Platform** - Good balance
2. **AWS Elastic Beanstalk** - Enterprise features
3. **Docker + Any VPS** - Full control

## 🔍 Post-Deployment

### Health Checks
- [ ] App loads correctly
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] Authentication flows
- [ ] AI plan generation works

### Monitoring
- Set up error tracking (Sentry)
- Monitor performance
- Set up logging
- Configure backups

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (18.x recommended)
   - Verify all dependencies installed
   - Check environment variables

2. **Database Connection**
   - Verify MongoDB URI
   - Check network access
   - Ensure database exists

3. **API Errors**
   - Check OpenAI API key
   - Verify JWT secret
   - Check CORS settings

### Getting Help:
- Check platform-specific documentation
- Review error logs
- Test locally first
- Use platform support channels

## 📊 Cost Comparison

| Platform | Cost/Month | Difficulty | Features |
|----------|------------|------------|----------|
| Railway | $5-20 | Easy | Auto-deploy, DB included |
| Vercel | $0-20 | Easy | Global CDN, Serverless |
| Heroku | $7-25 | Easy | Add-ons, Traditional |
| DigitalOcean | $6-15 | Medium | VPS control |
| AWS | $10-50+ | Hard | Enterprise features |

## 🎉 Success!

Once deployed, your AI personal development app will be live and ready for users to:
- Complete assessments
- Get AI-generated plans
- Track progress
- Build confidence scores

Happy deploying! 🚀
