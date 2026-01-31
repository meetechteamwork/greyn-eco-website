# Greyn Eco Backend API

Backend API server for Greyn Eco Platform with MongoDB Atlas integration.

## Features

- MongoDB Atlas database connection
- User authentication for 4 portals:
  - **Simple User (Investor)**: Immediate signup and login
  - **NGO**: Registration with pending approval
  - **Corporate**: Registration with pending approval
  - **Admin**: Admin code protected registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation
- CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/greyn-eco?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_CODE=ADMIN-2024-SECRET-CODE
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier is fine for development)
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and replace `<username>`, `<password>`, and cluster details in `.env`

### 4. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication Endpoints

#### Simple User (Investor)
- `POST /api/auth/signup/simple-user`
  - Body: `{ name, email, password, confirmPassword }`
- `POST /api/auth/login/simple-user`
  - Body: `{ email, password }`

#### NGO
- `POST /api/auth/signup/ngo`
  - Body: `{ organizationName, registrationNumber, contactPerson, email, password, confirmPassword }`
- `POST /api/auth/login/ngo`
  - Body: `{ email, password }`

#### Corporate
- `POST /api/auth/signup/corporate`
  - Body: `{ companyName, taxId, contactPerson, email, password, confirmPassword }`
- `POST /api/auth/login/corporate`
  - Body: `{ email, password }`

#### Admin
- `POST /api/auth/signup/admin`
  - Body: `{ name, email, password, confirmPassword, adminCode }`
- `POST /api/auth/login/admin`
  - Body: `{ email, password, adminCode }`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "simple-user"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [...]
}
```

## Database Collections

The following collections are automatically created:
- `simple_users` - Investor accounts
- `ngos` - NGO accounts
- `corporates` - Corporate accounts
- `admins` - Admin accounts

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 30 days
- Admin registration requires a secret admin code
- NGO and Corporate accounts require admin approval (status: pending -> active)
- CORS is configured to allow requests from frontend URL only

## Development

- Uses `nodemon` for automatic server restart during development
- Environment variables are loaded from `.env` file
- Error logging includes stack traces in development mode
