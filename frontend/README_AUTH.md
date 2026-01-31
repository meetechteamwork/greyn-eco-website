# JWT Authentication Setup - Greyn Eco Frontend

## Overview

The frontend now uses professional JWT-based authentication with MongoDB Atlas backend integration. All routes are protected and require authentication before access.

## Features Implemented

1. **JWT Token Management**
   - Automatic token storage in localStorage
   - Token validation and expiration checking
   - Automatic token refresh handling
   - Secure token storage

2. **Protected Routes**
   - All pages redirect to `/auth` if not authenticated
   - Role-based access control
   - Automatic redirect based on user role after login

3. **API Integration**
   - Professional API client with automatic token injection
   - Error handling and automatic logout on 401
   - Centralized API configuration

4. **Authentication Flow**
   - Login → Store JWT → Redirect to dashboard
   - Signup → Store JWT (if immediate login) → Redirect OR show login form
   - Logout → Clear tokens → Redirect to login

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## File Structure

```
frontend/src/
├── utils/
│   ├── jwt.ts          # JWT token management utilities
│   └── api.ts          # Professional API client
├── context/
│   └── AuthContext.tsx # Authentication context with real API calls
└── app/
    ├── page.tsx        # Root page - redirects to /auth
    ├── auth/
    │   └── page.tsx    # Login/Signup page with real API integration
    └── [other routes]  # All protected routes
```

## Usage

### Accessing Auth Context

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  
  // Use authentication state
}
```

### Making Authenticated API Calls

```typescript
import { apiClient } from '@/utils/api';

// Automatic token injection
const response = await apiClient.get('/protected-endpoint', true);
```

### Using JWT Utilities

```typescript
import { getAuthToken, isTokenValid, getUserFromToken } from '@/utils/jwt';

const token = getAuthToken();
if (isTokenValid(token)) {
  const user = getUserFromToken(token);
}
```

## Authentication Flow

1. **User visits website** → Redirected to `/auth` (login page)
2. **User logs in** → JWT token stored → Redirected to dashboard
3. **User accesses protected route** → Token validated → Access granted
4. **Token expires** → User redirected to `/auth` automatically
5. **User logs out** → Tokens cleared → Redirected to `/auth`

## Protected Routes

All routes are protected by default. The `ProtectedRoute` component handles:
- Authentication checking
- Role-based access control
- Automatic redirects

## API Endpoints Used

- `POST /api/auth/signup/simple-user` - Investor signup
- `POST /api/auth/login/simple-user` - Investor login
- `POST /api/auth/signup/ngo` - NGO signup
- `POST /api/auth/login/ngo` - NGO login
- `POST /api/auth/signup/corporate` - Corporate signup
- `POST /api/auth/login/corporate` - Corporate login
- `POST /api/auth/signup/admin` - Admin signup
- `POST /api/auth/login/admin` - Admin login

## Security Features

1. **Token Storage**: Secure localStorage with validation
2. **Automatic Logout**: On token expiration or 401 responses
3. **CORS Protection**: Backend configured for frontend URL
4. **Input Validation**: Both frontend and backend validation
5. **Error Handling**: Professional error messages without exposing sensitive data

## Testing

1. Start backend server: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3000` → Should redirect to `/auth`
4. Sign up or log in → Should redirect to dashboard
5. Access any route without login → Should redirect to `/auth`

## Troubleshooting

- **401 Errors**: Check if JWT_SECRET matches between frontend and backend
- **CORS Errors**: Verify FRONTEND_URL in backend .env matches frontend URL
- **Token Expired**: User will be automatically redirected to login
- **API Connection**: Verify NEXT_PUBLIC_API_URL matches backend URL
