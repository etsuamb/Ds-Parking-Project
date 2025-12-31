# Admin Functionality Implementation Guide

## 📋 Overview

This document describes the complete admin functionality implementation for the Distributed Smart Parking System. The admin system is built as a separate frontend application running on port 5174, with backend endpoints protected by role-based authentication.

## 🏗️ Architecture

### Backend Services
- **Auth Service**: Handles admin registration (with secret key) and login
- **Booking Service**: Admin endpoints for managing all bookings
- **Parking Service**: Admin endpoints for managing parking lots and spots
- **API Gateway**: Routes admin requests to appropriate services

### Frontend
- **User Frontend**: Port 5173 (existing)
- **Admin Frontend**: Port 5174 (new, separate application)

## 🔐 Authentication & Authorization

### User Roles
- `USER`: Default role for regular users
- `ADMIN`: Special role for administrators

### JWT Token Structure
```json
{
  "userId": 1,
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

### Middleware
- `authenticate`: Verifies JWT token
- `isAdmin`: Ensures user has ADMIN role

## 📡 Backend Endpoints

### Auth Service

#### POST /auth/register-admin
**Protected by**: Admin secret key (not JWT)
**Body**:
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "adminSecret": "admin-secret-key-change-in-production"
}
```

#### GET /auth/users
**Protected by**: JWT + ADMIN role
**Response**: List of all users

### Booking Service

#### GET /admin/bookings
**Protected by**: JWT + ADMIN role
**Response**: List of all bookings

#### POST /admin/bookings/:id/cancel
**Protected by**: JWT + ADMIN role
**Response**: Confirmation message

### Parking Service

#### GET /admin/parking/lots
**Protected by**: JWT + ADMIN role
**Response**: List of all parking lots with statistics

#### POST /admin/parking/lots
**Protected by**: JWT + ADMIN role
**Body**:
```json
{
  "lotId": "lot3",
  "spotNumbers": ["C1", "C2", "C3"]
}
```

#### POST /admin/parking/spots
**Protected by**: JWT + ADMIN role
**Body**:
```json
{
  "lotId": "lot1",
  "spotNumbers": ["A5", "A6"]
}
```

#### PUT /admin/parking/lots/:id
**Protected by**: JWT + ADMIN role
**Body**:
```json
{
  "name": "Updated Lot Name"
}
```

#### DELETE /admin/parking/lots/:id
**Protected by**: JWT + ADMIN role
**Note**: Cannot delete lots with reserved spots

## 🎨 Admin Frontend

### Structure
```
admin-frontend/
├── src/
│   ├── api/
│   │   └── adminApi.js          # Axios instance with JWT interceptor
│   ├── auth/
│   │   └── adminAuth.js          # Auth utilities
│   ├── components/admin/
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── pages/admin/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Bookings.jsx
│   │   └── Parking.jsx
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── Dockerfile
```

### Routes
- `/admin/login` - Admin login page
- `/admin/register` - Admin registration (requires secret key)
- `/admin/dashboard` - Overview with statistics
- `/admin/bookings` - Manage all bookings
- `/admin/parking` - Manage parking lots

### Features
- **JWT Token Management**: Stored in localStorage as `adminToken`
- **Automatic Token Attachment**: Axios interceptor adds token to requests
- **Route Protection**: ProtectedRoute component checks authentication
- **Role Verification**: Login verifies ADMIN role in JWT
- **Auto Redirect**: Unauthenticated users redirected to login

## 🚀 Setup & Deployment

### Environment Variables

#### Auth Service
Add to `backend/services/auth-service/src/.env`:
```
ADMIN_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret
```

#### Admin Frontend
Add to `admin-frontend/.env` (optional):
```
VITE_API_URL=http://localhost:8080
```

### Docker Compose

The admin frontend is included in `docker-compose.yml`:
```yaml
admin-frontend:
  build: ./admin-frontend
  ports:
    - "5174:80"
  depends_on:
    - api-gateway
  environment:
    - VITE_API_URL=http://localhost:8080
```

### Running Locally (Development)

1. **Start all services**:
   ```bash
   docker-compose up
   ```

2. **Or run admin frontend separately**:
   ```bash
   cd admin-frontend
   npm install
   npm run dev
   ```
   Access at: `http://localhost:5174`

### Creating First Admin

1. **Using Registration Endpoint**:
   - Navigate to `http://localhost:5174/admin/register`
   - Fill in details with admin secret key
   - Default secret: `admin-secret-key-change-in-production`

2. **Using Environment Variable**:
   Set `ADMIN_SECRET_KEY` in auth service `.env` file

## 🔒 Security Features

1. **Secret Key Protection**: Admin registration requires secret key
2. **Role Validation**: JWT must contain ADMIN role
3. **Route Protection**: All admin routes protected by middleware
4. **Token Expiration**: JWT tokens expire after 1 hour
5. **Automatic Logout**: Invalid/expired tokens trigger logout

## 📝 API Gateway Configuration

The API Gateway routes admin requests:
- `/admin/bookings/*` → Booking Service
- `/admin/parking/*` → Parking Service
- `/auth/*` → Auth Service

CORS is configured for both frontend ports (5173 and 5174).

## 🧪 Testing

### Test Admin Registration
```bash
curl -X POST http://localhost:8080/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@test.com",
    "password": "password123",
    "adminSecret": "admin-secret-key-change-in-production"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### Test Admin Endpoint (with token)
```bash
curl -X GET http://localhost:8080/admin/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Key Files Modified/Created

### Backend
- `backend/services/auth-service/src/controllers/auth.controller.js` - Added admin registration
- `backend/services/auth-service/src/routes/auth.routes.js` - Added admin routes
- `backend/services/booking-service/src/routes/adminRoutes.js` - Admin booking endpoints
- `backend/services/parking-service/src/routes/adminRoutes.js` - Admin parking endpoints
- `backend/services/api-gateway/config/gateway.config.yml` - Admin route configuration

### Frontend
- `admin-frontend/` - Complete new admin frontend application
- All admin pages and components

## 🎯 Usage

1. **Access Admin UI**: `http://localhost:5174`
2. **Register Admin**: Use registration page with secret key
3. **Login**: Use admin credentials
4. **Manage System**: Use dashboard, bookings, and parking pages

## ⚠️ Important Notes

1. **Change Admin Secret**: Update `ADMIN_SECRET_KEY` in production
2. **Separate Ports**: Admin frontend runs on 5174, user frontend on 5173
3. **No Direct Access**: Admin endpoints require JWT with ADMIN role
4. **Database**: Role column already exists in users table
5. **CORS**: Configured for both frontend ports

## 🔄 Future Enhancements

- Admin user management (edit/delete users)
- Advanced parking lot management (update lot details)
- Booking analytics and reports
- System logs and audit trails

