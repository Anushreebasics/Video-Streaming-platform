# 🚀 Deployment Guide - PulseStream

This guide walks you through deploying the PulseStream application to production using cloud services.

---

## 📋 Deployment Checklist

Before deploying, ensure:
- [ ] All environment variables are configured
- [ ] MongoDB Atlas cluster is set up
- [ ] Application runs locally without errors
- [ ] CORS origins are configured for production URLs
- [ ] File upload limits are appropriate for production
- [ ] JWT secrets are secure (not default values)

---

## 🗄️ Step 1: MongoDB Atlas Setup

### Create Database

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Create a Free Cluster**:
   - Choose M0 Sandbox (Free Forever)
   - Select region closest to your app server
   - Name your cluster (e.g., `pulse-cluster`)

3. **Create Database User**:
   ```
   Database Access → Add New Database User
   - Username: pulseadmin
   - Password: <generate-strong-password>
   - Database User Privileges: Read and write to any database
   ```

4. **Configure Network Access**:
   ```
   Network Access → Add IP Address
   - For testing: 0.0.0.0/0 (Allow access from anywhere)
   - For production: Add specific IP addresses of your servers
   ```

5. **Get Connection String**:
   ```
   Clusters → Connect → Connect your application
   - Driver: Node.js
   - Version: 4.0 or later
   - Copy connection string:
     mongodb+srv://pulseadmin:<password>@pulse-cluster.xxxxx.mongodb.net/videostreaming?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Backend Deployment (Heroku)

### Prerequisites
- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Git repository initialized

### Deploy to Heroku

```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
cd backend
heroku create pulse-backend-prod

# 3. Set environment variables
heroku config:set MONGO_URI="mongodb+srv://pulseadmin:<password>@pulse-cluster.xxxxx.mongodb.net/videostreaming"
heroku config:set JWT_SECRET="your-super-secure-jwt-secret-key-min-32-chars"
heroku config:set PORT=5001
heroku config:set NODE_ENV=production

# 4. Create Procfile
echo "web: npm start" > Procfile

# 5. Ensure package.json has correct scripts
# Verify "start": "node dist/server.js" exists

# 6. Deploy
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main

# 7. View logs
heroku logs --tail

# 8. Open app
heroku open
```

### Alternative: Render

```bash
# 1. Sign up at https://render.com
# 2. New → Web Service → Connect GitHub repo
# 3. Settings:
#    - Name: pulse-backend
#    - Environment: Node
#    - Build Command: npm install && npm run build
#    - Start Command: npm start
#    - Add Environment Variables (same as above)
# 4. Deploy
```

### Backend URL
Your backend will be available at:
```
https://pulse-backend-prod.herokuapp.com
```

---

## 🎨 Step 3: Frontend Deployment (Netlify)

### Prerequisites
- Create account at [Netlify](https://app.netlify.com/signup)

### Update API URL

Before deploying, update the frontend to use production backend URL:

```typescript
// frontend/src/utils/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://pulse-backend-prod.herokuapp.com/api',
});

// ...rest of code
```

```typescript
// frontend/src/pages/Dashboard.tsx
// Update socket connection
const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://pulse-backend-prod.herokuapp.com');
```

Create `.env` file in frontend:
```bash
# frontend/.env
VITE_API_URL=https://pulse-backend-prod.herokuapp.com/api
VITE_SOCKET_URL=https://pulse-backend-prod.herokuapp.com
```

### Deploy to Netlify

#### Option A: Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build frontend
cd frontend
npm run build

# 3. Login to Netlify
netlify login

# 4. Deploy
netlify deploy --prod --dir=dist

# 5. Set environment variables in Netlify dashboard
# Site settings → Build & deploy → Environment variables
```

#### Option B: Netlify Web UI

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Netlify Dashboard:
#    - New site from Git
#    - Connect to GitHub
#    - Select repository
#    - Build settings:
#      * Base directory: frontend
#      * Build command: npm run build
#      * Publish directory: frontend/dist
#    - Environment variables:
#      * VITE_API_URL=https://pulse-backend-prod.herokuapp.com/api
#      * VITE_SOCKET_URL=https://pulse-backend-prod.herokuapp.com
#    - Deploy site
```

### Alternative: Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel --prod

# 3. Set environment variables in Vercel dashboard
```

### Frontend URL
Your frontend will be available at:
```
https://pulse-stream.netlify.app
```

---

## 🔄 Step 4: Update CORS Settings

Update backend CORS to allow production frontend:

```typescript
// backend/src/server.ts
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://pulse-stream.netlify.app'  // Add your Netlify URL
    ],
    credentials: true
}));
```

Commit and redeploy backend:
```bash
cd backend
git add .
git commit -m "Update CORS for production"
git push heroku main
```

---

## 📦 Step 5: File Storage (AWS S3) [Optional]

For production, consider moving from local file storage to AWS S3:

### Setup AWS S3

```bash
# 1. Install AWS SDK
npm install @aws-sdk/client-s3 multer-s3

# 2. Create S3 bucket in AWS Console
# 3. Configure IAM user with S3 permissions
# 4. Update backend/src/middleware/upload.ts
```

```typescript
// Example S3 configuration
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME!,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});
```

---

## 🔐 Step 6: Security Hardening

### Environment Variables

Never commit these to Git! Add to `.gitignore`:
```
.env
.env.local
.env.production
```

### Secure Production Values

```bash
# Generate secure JWT secret (minimum 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update Heroku
heroku config:set JWT_SECRET="<generated-secret>"
```

### Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```typescript
// backend/src/server.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Helmet for Security Headers

```bash
npm install helmet
```

```typescript
// backend/src/server.ts
import helmet from 'helmet';

app.use(helmet());
```

---

## 📊 Step 7: Monitoring & Logging

### Heroku Logging

```bash
# View real-time logs
heroku logs --tail

# View last 1000 lines
heroku logs -n 1000

# Filter by level
heroku logs --source app
```

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/node @sentry/react

# Backend setup
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
});

# Frontend setup
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE
});
```

---

## ✅ Step 8: Verification

### Health Checks

Test your deployed application:

```bash
# Backend health check
curl https://pulse-backend-prod.herokuapp.com/health

# Expected response:
# {"status":"ok","message":"Server is running"}

# Database connectivity
curl https://pulse-backend-prod.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Frontend Verification

1. Open `https://pulse-stream.netlify.app`
2. Register a new user
3. Login
4. Upload a video
5. Watch processing progress
6. Play video

---

## 🔄 Continuous Deployment

### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "pulse-backend-prod"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check Heroku logs
heroku logs --tail

# Common issues:
# - Missing environment variables
# - MongoDB connection failure
# - Port binding issues
```

### Frontend can't connect to backend
```bash
# Verify CORS settings in backend
# Check browser console for errors
# Ensure API_URL environment variable is set correctly
```

### Video upload fails
```bash
# Check Heroku dyno type (Hobby or higher for persistent storage)
# Consider AWS S3 for file storage
# Verify upload size limits
```

---

## 💰 Cost Estimate

### Free Tier (Sufficient for MVP)

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Sandbox | Free |
| Heroku | Eco Dyno | $5/month |
| Netlify | Starter | Free |
| **Total** | | **$5/month** |

### Production Scale

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M10 | $57/month |
| Heroku | Standard 1X | $25/month |
| Netlify | Pro | $19/month |
| AWS S3 | Standard | ~$5/month |
| **Total** | | **~$106/month** |

---

## 🎯 Performance Optimization

1. **CDN**: Use Cloudflare for frontend assets
2. **Compression**: Enable gzip/brotli compression
3. **Caching**: Implement Redis for session storage
4. **Database Indexing**: Add indexes to MongoDB collections
5. **Image Optimization**: Generate video thumbnails
6. **Load Balancing**: Use multiple Heroku dynos

---

## 📈 Scaling Considerations

- **Horizontal Scaling**: Add more Heroku dynos
- **Database Sharding**: MongoDB Atlas supports automatic sharding
- **CDN**: Use AWS CloudFront or Cloudflare
- **Worker Processes**: Separate video processing to background jobs
- **Queue System**: Implement Bull or RabbitMQ for job queues

---

## ✅ Deployment Complete!

Your PulseStream application is now live! 🎉

**Access your application**:
- Frontend: https://pulse-stream.netlify.app
- Backend: https://pulse-backend-prod.herokuapp.com

---

## 📞 Next Steps

1. Set up custom domain
2. Configure SSL certificates
3. Implement monitoring
4. Set up automated backups
5. Create deployment documentation for team
6. Establish CI/CD pipeline

---

**Need help?** Check the main [DOCUMENTATION.md](./DOCUMENTATION.md) for more details.
