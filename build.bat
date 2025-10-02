@echo off
echo 🚀 Starting Vercel build process...

echo 📦 Installing dependencies...
cd frontend && npm install
cd ../backend && npm install
cd ..

echo 🗄️ Running database migration...
if defined DATABASE_URL (
    echo Running database migration...
    cd backend && node migrate.js
    cd ..
) else (
    echo ⚠️ DATABASE_URL not found, skipping migration
)

echo 🏗️ Building frontend...
cd frontend && npm run build
cd ..

echo ✅ Build completed successfully!