# 🚀 Vercel Deployment Guide for PulsePixelTech

## Overview
This guide will help you deploy your full-stack e-commerce application to Vercel with both frontend and backend.

## 🎯 **Deployment Architecture**

```
Frontend (Next.js) → Vercel
Backend (Express.js) → Vercel Serverless Functions
Database → Vercel PostgreSQL / External PostgreSQL
File Storage → Vercel Blob Storage
```

## 📋 **Pre-Deployment Checklist**

### ✅ **Frontend Ready**
- [x] Next.js app builds successfully (`npm run build`)
- [x] No build warnings or errors
- [x] Environment variables configured
- [x] Image optimization configured

### ✅ **Backend Ready**
- [x] Express.js server working
- [x] Database connection configured
- [x] API routes functional
- [x] Environment variables set

## 🚀 **Step 1: Prepare Your Project**

### **1.1 Create Vercel Configuration**

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **1.2 Update Package.json Scripts**

Add to your root `package.json`:

```json
{
  "name": "pulsepixeltech",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm run build",
    "start": "cd frontend && npm start",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "install-deps": "cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### **1.3 Environment Variables Setup**

Create `.env.example` in root:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SambaNova AI
SAMBANOVA_API_KEY=your_sambanova_api_key

# Frontend URL
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
FRONTEND_URL=https://your-app.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🚀 **Step 2: Deploy to Vercel**

### **2.1 Install Vercel CLI**

```bash
npm install -g vercel
```

### **2.2 Login to Vercel**

```bash
vercel login
```

### **2.3 Deploy Your Project**

```bash
# In your project root
vercel

# Follow the prompts:
# ? Set up and deploy "~/your-project"? [Y/n] y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? pulsepixeltech
# ? In which directory is your code located? ./
```

### **2.4 Configure Environment Variables**

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all your environment variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
SAMBANOVA_API_KEY=your_sambanova_key
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🗄️ **Step 3: Database Setup**

### **Option A: Vercel PostgreSQL (Recommended)**

```bash
# Install Vercel PostgreSQL
vercel postgres create

# Connect to your project
vercel postgres connect
```

### **Option B: External PostgreSQL**

Popular options:
- **Supabase**: Free PostgreSQL with great features
- **PlanetScale**: MySQL alternative
- **Railway**: Simple PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

### **3.1 Database Migration**

Create `migrate.js` in backend:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        images TEXT[],
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('Database migrated successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
```

Run migration:
```bash
node backend/migrate.js
```

## 📁 **Step 4: File Storage Setup**

### **Option A: Vercel Blob Storage**

```bash
npm install @vercel/blob
```

Update your upload service:

```javascript
// backend/services/uploadService.js
const { put } = require('@vercel/blob');

async function uploadFile(file, filename) {
  const blob = await put(filename, file, {
    access: 'public',
  });
  
  return blob.url;
}
```

### **Option B: Cloudinary (Recommended for Images)**

```bash
npm install cloudinary
```

## 🔧 **Step 5: Update Configuration**

### **5.1 Update Frontend API URL**

In `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
```

### **5.2 Update Backend CORS**

In `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

### **5.3 Update Image Domains**

In `frontend/next.config.js`:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-app.vercel.app',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        pathname: '/**',
      },
      // ... other patterns
    ],
  },
}
```

## 🚀 **Step 6: Deploy and Test**

### **6.1 Deploy Updates**

```bash
vercel --prod
```

### **6.2 Test Your Deployment**

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **API**: Test `https://your-app.vercel.app/api/test`
3. **Database**: Check if data loads correctly
4. **Authentication**: Test login/register
5. **File Upload**: Test image uploads
6. **Chatbot**: Test SambaNova integration

## 📊 **Step 7: Performance Optimization**

### **7.1 Enable Analytics**

In Vercel Dashboard:
- Enable Web Analytics
- Enable Speed Insights
- Monitor Core Web Vitals

### **7.2 Configure Caching**

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## 🔒 **Step 8: Security Setup**

### **8.1 Environment Variables**

Ensure all sensitive data is in environment variables:
- Database credentials
- API keys
- JWT secrets
- Email passwords

### **8.2 HTTPS Redirect**

Vercel automatically provides HTTPS, but ensure your app redirects:

```javascript
// In your middleware
if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
  res.redirect(`https://${req.header('host')}${req.url}`);
}
```

## 📈 **Step 9: Monitoring and Maintenance**

### **9.1 Set Up Monitoring**

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking (optional)
- **LogRocket**: User session recording (optional)

### **9.2 Database Backups**

Set up automated backups for your database:
- Vercel PostgreSQL: Automatic backups included
- External providers: Configure backup schedules

## 🎯 **Step 10: Custom Domain (Optional)**

### **10.1 Add Custom Domain**

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### **10.2 Update Environment Variables**

Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to use your custom domain.

## 🚀 **Deployment Commands Summary**

```bash
# Initial setup
npm install -g vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## 🎉 **Success Checklist**

After deployment, verify:

- [ ] Frontend loads correctly
- [ ] All pages accessible (admin, products, etc.)
- [ ] API endpoints working
- [ ] Database connections successful
- [ ] Authentication working
- [ ] File uploads functional
- [ ] SambaNova chatbot responding
- [ ] Email notifications working
- [ ] Payment integration functional
- [ ] Mobile responsiveness
- [ ] Performance metrics good

## 💡 **Pro Tips**

1. **Use Preview Deployments**: Every git push creates a preview URL
2. **Environment Branches**: Different env vars for staging/production
3. **Function Regions**: Deploy functions closer to your users
4. **Edge Functions**: Use for ultra-fast responses
5. **Analytics**: Monitor performance and user behavior

## 🆘 **Troubleshooting**

### Common Issues:

1. **Build Failures**: Check build logs in Vercel dashboard
2. **API Errors**: Verify environment variables
3. **Database Connection**: Check connection string format
4. **CORS Issues**: Update allowed origins
5. **File Upload Issues**: Check storage configuration

### Debug Commands:

```bash
# Local development
vercel dev

# Check environment variables
vercel env ls

# View function logs
vercel logs --follow
```

---

## 🎊 **Congratulations!**

Your PulsePixelTech e-commerce platform is now deployed on Vercel with:

- ✅ **Global CDN** for fast loading
- ✅ **Serverless scaling** for high traffic
- ✅ **Automatic HTTPS** for security
- ✅ **Zero downtime** deployments
- ✅ **Built-in analytics** for insights

Your customers can now shop from anywhere in the world with lightning-fast performance! 🚀