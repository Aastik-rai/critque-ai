# Deploy to DigitalOcean

## Option 1: DigitalOcean App Platform (Easiest)

### Prerequisites
- DigitalOcean account
- GitHub repository

### Steps

1. **Create App on DigitalOcean**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure App Settings**
   - **Source**: Your GitHub repo
   - **Type**: Web Service
   - **Build Command**: `cd client && npm install && npm run build`
   - **Run Command**: `npm start`
   - **HTTP Port**: 5000

3. **Add Database**
   - Click "Create Database"
   - Choose MongoDB
   - Select plan (Basic $15/month minimum)

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   MONGODB_URI=your-mongodb-connection-string
   ```

5. **Deploy**
   - Click "Create Resources"
   - DigitalOcean will automatically build and deploy

## Option 2: DigitalOcean Droplet (VPS)

### Prerequisites
- DigitalOcean account
- Basic Linux knowledge

### Steps

1. **Create Droplet**
   - Go to DigitalOcean Droplets
   - Choose Ubuntu 20.04 LTS
   - Select plan (Basic $6/month minimum)
   - Add SSH key

2. **Connect to Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   apt-get update
   apt-get install -y mongodb-org
   
   # Start MongoDB
   systemctl start mongod
   systemctl enable mongod
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd your-app
   
   # Install dependencies
   npm install
   cd client && npm install && npm run build && cd ..
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name "critique-ai"
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx (Optional)**
   ```bash
   # Install Nginx
   apt install nginx
   
   # Configure Nginx
   nano /etc/nginx/sites-available/critique-ai
   
   # Add this configuration:
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Enable site
   ln -s /etc/nginx/sites-available/critique-ai /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

6. **Setup SSL (Optional)**
   ```bash
   # Install Certbot
   apt install certbot python3-certbot-nginx
   
   # Get SSL certificate
   certbot --nginx -d your-domain.com
   ```

## Option 3: DigitalOcean Kubernetes

### Prerequisites
- Docker knowledge
- Kubernetes basics

### Steps

1. **Create Kubernetes Cluster**
   - Go to DigitalOcean Kubernetes
   - Create cluster
   - Download kubeconfig

2. **Create Deployment Files**
   ```yaml
   # k8s-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: critique-ai
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: critique-ai
     template:
       metadata:
         labels:
           app: critique-ai
       spec:
         containers:
         - name: critique-ai
           image: your-docker-image
           ports:
           - containerPort: 5000
           env:
           - name: NODE_ENV
             value: "production"
           - name: JWT_SECRET
             valueFrom:
               secretKeyRef:
                 name: critique-ai-secrets
                 key: jwt-secret
   ```

3. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s-deployment.yaml
   kubectl expose deployment critique-ai --type=LoadBalancer --port=80 --target-port=5000
   ```

## Cost Comparison

- **App Platform**: $5-25/month (easiest)
- **Droplet**: $6-12/month (most control)
- **Kubernetes**: $30+/month (scalable)

## Recommended for Beginners
Start with **DigitalOcean App Platform** - it's the easiest and handles everything automatically!
