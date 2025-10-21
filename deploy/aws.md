# Deploy to AWS

## Option 1: AWS Elastic Beanstalk (Easiest)

### Prerequisites
- AWS CLI installed
- AWS account

### Steps

1. **Install AWS CLI**
   ```bash
   # Windows
   choco install awscli
   
   # Mac
   brew install awscli
   
   # Linux
   sudo apt-get install awscli
   ```

2. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret, and region
   ```

3. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

4. **Initialize Elastic Beanstalk**
   ```bash
   eb init
   # Select your region and platform (Node.js)
   ```

5. **Create Environment**
   ```bash
   eb create production
   ```

6. **Set Environment Variables**
   ```bash
   eb setenv JWT_SECRET=your-super-secret-jwt-key-here
   eb setenv OPENAI_API_KEY=your-openai-api-key-here
   eb setenv NODE_ENV=production
   ```

7. **Deploy**
   ```bash
   eb deploy
   ```

8. **Open Application**
   ```bash
   eb open
   ```

## Option 2: AWS EC2 with Docker

### Prerequisites
- AWS EC2 instance
- Docker installed on EC2

### Steps

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t2.micro (free tier)
   - Configure security group (ports 22, 80, 443, 5000)

2. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker ubuntu
   ```

4. **Clone and Deploy**
   ```bash
   git clone your-repo-url
   cd your-app
   
   # Create .env file with your variables
   nano .env
   
   # Deploy with Docker
   docker-compose up -d
   ```

5. **Configure Nginx (Optional)**
   ```bash
   sudo apt install nginx
   # Configure nginx to proxy to your app
   ```

## Option 3: AWS App Runner (Serverless)

### Steps

1. **Prepare app.yaml**
   ```yaml
   version: 1.0
   runtime: nodejs18
   build:
     commands:
       build:
         - cd client && npm install && npm run build
   run:
     runtime-version: 18
     command: npm start
     network:
       port: 5000
   ```

2. **Deploy via AWS Console**
   - Go to AWS App Runner
   - Create service
   - Connect to GitHub
   - Configure environment variables
   - Deploy

## Database Options

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in environment variables

### AWS DocumentDB
1. Create DocumentDB cluster in AWS
2. Configure security groups
3. Update connection string
