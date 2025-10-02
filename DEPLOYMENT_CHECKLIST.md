# ✅ Vercel Web Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code is pushed to GitHub
- [ ] All files are committed
- [ ] Repository is public or accessible to Vercel

### 2. Environment Variables Ready
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - At least 32 characters long
- [ ] `SAMBANOVA_API_KEY` - Your SambaNova API key
- [ ] `NEXT_PUBLIC_API_URL` - Will be your Vercel app URL + /api
- [ ] `FRONTEND_URL` - Will be your Vercel app URL
- [ ] `NODE_ENV=production`

### 3. Database Preparation
- [ ] PostgreSQL database created (Vercel/Supabase/Railway/Neon)
- [ ] Database connection string obtained
- [ ] Database is accessible from internet

## 🚀 Deployment Steps

### Step 1: Vercel Dashboard
- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Import your GitHub repository

### Step 2: Project Configuration
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `.next` (auto-detected)

### Step 3: Environment Variables
Copy and paste these in Vercel's environment variables section:

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_minimum_32_characters
SAMBANOVA_API_KEY=your_sambanova_api_key
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app/api
FRONTEND_URL=https://your-project-name.vercel.app
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
BCRYPT_ROUNDS=12
JWT_EXPIRE=7d
```

### Step 4: Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Note your deployment URL

## 🔧 Post-Deployment Tasks

### 1. Database Migration
Run this command with your production DATABASE_URL:
```bash
DATABASE_URL="your_production_url" node backend/migrate.js
```

### 2. Verification Tests
- [ ] Visit your Vercel URL - frontend loads
- [ ] Test `/api/health` - returns {"status": "OK"}
- [ ] Test `/api/products` - returns products list
- [ ] Try user registration
- [ ] Try user login
- [ ] Test chatbot functionality

### 3. Update Environment Variables
After deployment, update these with your actual Vercel URL:
- [ ] `NEXT_PUBLIC_API_URL=https://your-actual-url.vercel.app/api`
- [ ] `FRONTEND_URL=https://your-actual-url.vercel.app`

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Frontend loads correctly
- ✅ API endpoints respond
- ✅ Database connection works
- ✅ User authentication works
- ✅ Products display
- ✅ Chatbot responds
- ✅ No console errors

## 🚨 Common Issues & Solutions

### Build Fails
**Issue**: Missing dependencies
**Solution**: Check `package.json` files in both frontend and backend

### API Not Working
**Issue**: CORS or routing problems
**Solution**: Check `vercel.json` and `backend/server.js` CORS config

### Database Connection Fails
**Issue**: Wrong connection string format
**Solution**: Ensure format is `postgresql://user:pass@host:port/db`

### Environment Variables Not Working
**Issue**: Variables not set correctly
**Solution**: Check spelling, no quotes around values, redeploy after changes

## 📞 Need Help?

1. **Check Vercel Logs**: Dashboard → Deployments → View Logs
2. **Check Function Logs**: Dashboard → Functions → View Logs  
3. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
4. **Community**: [GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 Ready to Deploy!

Your PulsePixelTech e-commerce platform is fully configured and ready for Vercel deployment. Follow the checklist above and you'll have a live, scalable e-commerce site in minutes!

**Estimated Deployment Time**: 5-10 minutes
**Build Time**: 2-3 minutes
**Total Setup Time**: 15-20 minutes

Good luck! 🚀