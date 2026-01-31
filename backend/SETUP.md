# Backend Setup Instructions

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create .env File

Create a `.env` file in the `backend/` directory with the following content:

```env
# MongoDB Atlas Connection
# Replace <username> and <password> with your MongoDB Atlas credentials
# Replace cluster URL with your actual cluster URL
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/greyn-eco?retryWrites=true&w=majority

# JWT Secret Key (Change this to a strong random string in production)
# Minimum 32 characters recommended for production security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-at-least-32-characters-long

# Admin Code (Required for admin registration)
# Change this to a secure string in production (minimum 8 characters)
ADMIN_CODE=ADMIN-2024-SECRET-CODE

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS configuration)
# Must be a valid URL starting with http:// or https://
# Examples: http://localhost:3000, https://yourdomain.com
# If not set or empty, defaults to http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- **FRONTEND_URL**: Must be a valid URL. If you leave it empty or set an invalid value, the server will use the default `http://localhost:3000`
- **JWT_SECRET**: Should be at least 32 characters for production security
- **ADMIN_CODE**: Should be at least 8 characters
- Do NOT commit the `.env` file to version control (it's already in `.gitignore`)

## Step 3: MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free M0 tier is fine)
4. Click "Connect" on your cluster
5. Create a database user (save username and password)
6. Whitelist your IP address (use `0.0.0.0/0` for development)
7. Get connection string: Click "Connect" → "Connect your application"
8. Copy the connection string and replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - Update cluster URL if needed

## Step 4: Update .env File

Replace the `MONGODB_URI` in your `.env` file with your actual connection string from MongoDB Atlas.

## Step 5: Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Testing the API

You can test the endpoints using:
- Postman
- curl
- Your frontend application

Example curl command for simple user signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup/simple-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## Database Collections

Once you start using the API, MongoDB Atlas will automatically create these collections:
- `simple_users` - Investor accounts
- `ngos` - NGO accounts  
- `corporates` - Corporate accounts
- `admins` - Admin accounts
