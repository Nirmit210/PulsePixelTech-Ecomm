# 🌐 PulsePixelTech - Vercel Web Deployment Guide

## 🚀 Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy via Vercel Web Interface

1. **Visit Vercel Dashboard**: Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click "New Project"**
3. **Import from GitHub**: Select your PulsePixelTech repository
4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Environment Variables Setup

In the Vercel deployment configuration, add these environment variables:

#### Required Variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
SAMBANOVA_API_KEY=your_sambanova_api_key_here
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app/api
FRONTEND_URL=https://your-project-name.vercel.app
NODE_ENV=production
```

#### Optional Variables:
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@pulsepixeltech.com

# Payment (if using Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Security
BCRYPT_ROUNDS=12
JWT_EXPIRE=7d
```

### Step 4: Database Setup Options

#### Option A: Vercel PostgreSQL (Recommended)
1. In your Vercel project dashboard
2. Go to **Storage** tab
3. Click **Create Database** → **PostgreSQL**
4. Copy the connection string to `DATABASE_URL`

#### Option B: External Database
Popular options:
- **Supabase**: Free PostgreSQL with 500MB
- **Railway**: Simple PostgreSQL hosting  
- **Neon**: Serverless PostgreSQL
- **Aiven**: Managed PostgreSQL

### Step 5: Deploy!

1. **Click "Deploy"** in Vercel
2. **Wait for build** (usually 2-3 minutes)
3. **Visit your live site** at the provided URL

## 🔧 Post-Deployment Setup

### Database Migration

After successful deployment, run the database migration:

1. **Go to Vercel Dashboard** → Your Project → **Functions**
2. **Add a serverless function** or run migration manually:

```bash
# Option 1: Run locally with production DATABASE_URL
DATABASE_URL="your_production_url" node backend/migrate.js

# Option 2: Use Vercel CLI
vercel env pull .env.local
node backend/migrate.js
```

### Verify Deployment

Check these endpoints:
- **Frontend**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **Products API**: `https://your-app.vercel.app/api/products`

## 🎯 Deployment Checklist

### Pre-Deployment:
- [ ] Code pushed to GitHub
- [ ] All environment variables ready
- [ ] Database connection string available
- [ ] SambaNova API key obtained

### During Deployment:
- [ ] Repository imported to Vercel
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Deployment initiated

### Post-Deployment:
- [ ] Database migrated and seeded
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Authentication working
- [ ] Chatbot functional
- [ ] File uploads working (if configured)

## 🔍 Troubleshooting

### Common Build Issues:

#### 1. Build Fails - Missing Dependencies
**Solution**: Ensure all dependencies are in `package.json`
```bash
# Check and install missing deps
npm install
```

#### 2. Environment Variables Not Found
**Solution**: Double-check variable names in Vercel dashboard
- Variables are case-sensitive
- No spaces in variable names
- Values should not have quotes

#### 3. Database Connection Issues
**Solution**: Verify DATABASE_URL format
```
postgresql://username:password@host:port/database
```

#### 4. API Routes Not Working
**Solution**: Check the `vercel.json` configuration
- Ensure API routes are properly configured
- Verify CORS settings in backend

### Debug Steps:

1. **Check Build Logs**: Vercel Dashboard → Deployments → View Logs
2. **Check Function Logs**: Vercel Dashboard → Functions → View Logs
3. **Test API Endpoints**: Use browser or Postman
4. **Verify Environment Variables**: Vercel Dashboard → Settings → Environment Variables

## 🚀 Advanced Configuration

### Custom Domain Setup:
1. **Vercel Dashboard** → Your Project → **Domains**
2. **Add Domain** → Enter your domain
3. **Configure DNS** as instructed
4. **Update Environment Variables** with new domain

### Performance Optimization:
- **Enable Analytics**: Vercel Dashboard → Analytics
- **Configure Caching**: Already set in `vercel.json`
- **Image Optimization**: Configured in `next.config.js`

### Security:
- **Security Headers**: Configured in `next.config.js`
- **CORS**: Configured in `backend/server.js`
- **Environment Variables**: Never commit to Git

## 📊 Monitoring

### Vercel Built-in:
- **Analytics**: User behavior and performance
- **Speed Insights**: Core Web Vitals
- **Function Logs**: API debugging

### Recommended External:
- **Sentry**: Error tracking
- **LogRocket**: Session recording
- **Uptime Robot**: Uptime monitoring

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Frontend loads at your Vercel URL
- ✅ API health check returns 200
- ✅ Database connection works
- ✅ User registration/login works
- ✅ Products display correctly
- ✅ Chatbot responds
- ✅ All major features functional

## 🆘 Getting Help

### Vercel Support:
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [GitHub Discussions](https://github.com/vercel/vercel/discussions)
- **Discord**: Vercel Community Discord

### Project-Specific:
- Check deployment logs for specific errors
- Verify all environment variables are set
- Test API endpoints individually
- Ensure database is accessible

---

## 🎊 Congratulations!

Once deployed, your PulsePixelTech e-commerce platform will be live with:

- 🌍 **Global CDN** for worldwide fast access
- ⚡ **Serverless scaling** for any traffic level
- 🔒 **Automatic HTTPS** and security
- 📊 **Built-in analytics** and monitoring
- 🤖 **AI-powered chatbot** ready to help customers
- 📱 **Mobile-optimized** for all devices

Your customers can now shop from anywhere in the world! 🛒✨