# MongoDB Atlas Setup - Greyn Eco

## Your MongoDB Connection Details

**Connection String:**
```
mongodb+srv://muhammadfaaranakbar_db_user:KtDsQ6bcVXANLRCT@greyn-dev-cluster.22hoofz.mongodb.net/?appName=greyn-dev-cluster
```

**Complete Connection String (with database name):**
```
mongodb+srv://muhammadfaaranakbar_db_user:KtDsQ6bcVXANLRCT@greyn-dev-cluster.22hoofz.mongodb.net/greyn-eco?retryWrites=true&w=majority&appName=greyn-dev-cluster
```

## Setup Your .env File

Create a `.env` file in the `backend/` directory with the following:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://muhammadfaaranakbar_db_user:KtDsQ6bcVXANLRCT@greyn-dev-cluster.22hoofz.mongodb.net/greyn-eco?retryWrites=true&w=majority&appName=greyn-dev-cluster

# JWT Secret Key (Generate a strong random string for production)
JWT_SECRET=greyn_eco_jwt_secret_key_2024_production_secure_random_string_min_32_chars

# Admin Code (Required for admin registration)
ADMIN_CODE=ADMIN-2024-SECRET-CODE

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Important Notes

1. **Database Name**: The connection string includes `/greyn-eco` as the database name. MongoDB Atlas will create this database automatically when you first use it.

2. **IP Whitelist**: Make sure your current IP address is whitelisted in MongoDB Atlas:
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access" in the left menu
   - Click "Add IP Address"
   - For development, you can add `0.0.0.0/0` (allows all IPs - only for development!)
   - For production, whitelist only your server's IP addresses

3. **Database User**: Your database user is `muhammadfaaranakbar_db_user` with the password provided above.

4. **Security**: 
   - Never commit your `.env` file to Git (it's already in `.gitignore`)
   - Change the `JWT_SECRET` to a strong random string in production
   - Change the `ADMIN_CODE` to a secure value in production

## Collections Created Automatically

When you start using the API, MongoDB will automatically create these collections:
- `simple_users` - Investor accounts
- `ngos` - NGO accounts  
- `corporates` - Corporate accounts
- `admins` - Admin accounts

## Testing Connection

After setting up your `.env` file, start the server:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected: ...
📊 Database: greyn-eco
```

If you see connection errors, check:
1. Your IP is whitelisted in MongoDB Atlas
2. The connection string is correct in `.env`
3. Your MongoDB Atlas cluster is running
