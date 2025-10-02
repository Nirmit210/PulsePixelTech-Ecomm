# 🪟 Windows Setup Guide for PulsePixelTech

## Step 1: Create Database Using pgAdmin (Easiest Method)

Since `psql` isn't in your PATH yet, let's use the GUI:

### 1. Open pgAdmin
- Look for **pgAdmin 4** in your Start Menu
- It should have been installed with PostgreSQL
- If you can't find it, search for "pgAdmin" in Windows search

### 2. Create/Connect to PostgreSQL Server
If you don't see a server on the left, create one:

**Option A: If you see a server already:**
- **Right-click the server** → **Connect Server**
- **Enter the password** you set during PostgreSQL installation

**Option B: If no server is visible, create one:**
- **Right-click "Servers"** in the left panel
- Select **Create** → **Server...**
- **General tab:**
  - Name: `cLoal PostgreSQL` (or any name you like)
- **Connection tab:**
  - Host name/address: `localhost`
  - Port: `5432`
  - Username: `postgres`
  - Password: (the password you set during installation)
- **Click "Save"**

### 3. Create the Database
- Once connected, expand the server
- **Right-click on "Databases"**
- Select **Create** → **Database...**
- **Database name**: `pulsepixeltech`
- **Owner**: postgres (should be default)
- **Click "Save"**

### 4. Update your connection string
Edit `backend/.env` and replace `your_password` with your actual PostgreSQL password:

```
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/pulsepixeltech"
```

## Step 2: Alternative - Add psql to PATH (Optional)

If you want to use command line later:

1. **Find PostgreSQL installation folder**:
   - Usually: `C:\Program Files\PostgreSQL\15\bin`
   - Or: `C:\Program Files\PostgreSQL\14\bin`

2. **Add to Windows PATH**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click **Environment Variables**
   - Under **System Variables**, find and select **Path**
   - Click **Edit** → **New**
   - Add your PostgreSQL bin path (e.g., `C:\Program Files\PostgreSQL\15\bin`)
   - Click **OK** on all dialogs
   - **Restart Command Prompt**

## Step 3: Update Your Password

Make sure your `backend/.env` file has the correct PostgreSQL password:

```
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/pulsepixeltech"
```

Replace `YOUR_ACTUAL_PASSWORD` with the password you used in pgAdmin.

## Step 4: Run the Application

Now you can proceed with the setup:

```cmd
# Backend setup
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

```cmd
# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

## Troubleshooting

### If you get "psql is not recognized"
Add PostgreSQL to your PATH:
1. Find your PostgreSQL installation (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add this path to your Windows PATH environment variable
3. Restart Command Prompt

### If you forgot your PostgreSQL password
1. Open **pgAdmin**
2. Right-click your server → **Properties** → **Connection**
3. Or reinstall PostgreSQL and set a new password

### Common PostgreSQL passwords
If you're not sure what password you set, try these common ones:
- `postgres`
- `admin`
- `password`
- `123456`

## Success Indicators
✅ Database `pulsepixeltech` created
✅ Can connect with psql
✅ Backend runs without database errors
✅ Sample data loads successfully

## Next Steps
Once everything is running:
- Frontend: http://localhost:3000
- Admin: admin@pulsepixeltech.com / admin123
- Customer: customer@test.com / customer123

Happy coding! 🎉