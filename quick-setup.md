# 🚀 Quick Setup Guide for PulsePixelTech

## Step 1: Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database named `pulsepixeltech`
3. Update the `DATABASE_URL` in `backend/.env`:
```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/pulsepixeltech"
```

### Option B: Free Cloud Database (Recommended)
Use **Supabase** for a free PostgreSQL database:

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string
6. Update `backend/.env`:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Step 2: Backend Setup
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Demo Accounts
- **Admin**: admin@pulsepixeltech.com / admin123
- **Customer**: customer@test.com / customer123

## Troubleshooting

### Database Connection Issues
If you get database connection errors:

1. **Check PostgreSQL is running**:
   ```bash
   # On Windows
   net start postgresql-x64-14
   
   # On Mac
   brew services start postgresql
   
   # On Linux
   sudo systemctl start postgresql
   ```

2. **Verify database exists**:
   ```sql
   -- Connect to PostgreSQL and run:
   CREATE DATABASE pulsepixeltech;
   ```

3. **Check credentials**: Make sure username/password in DATABASE_URL are correct

### Port Issues
If ports 3000 or 5000 are busy:
- Change `PORT=5001` in `backend/.env`
- Update `NEXT_PUBLIC_API_URL=http://localhost:5001/api` in `frontend/.env.local`

### Node.js Version
Ensure you're using Node.js v18 or higher:
```bash
node --version
```

## Success Indicators
✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ Database connected successfully
✅ Sample data loaded
✅ Can login with demo accounts

## Next Steps
1. Explore the admin dashboard
2. Browse products as a customer
3. Test the complete shopping flow
4. Try the fake payment system
5. Check out the PWA features on mobile

Happy coding! 🎉