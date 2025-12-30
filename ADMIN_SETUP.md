# Admin UI Setup Guide

## 🎯 Overview
The Smart Parking system now has completely separate admin and user interfaces with proper route separation.

## 🚀 Admin Routes
- `/admin/login` - Admin login page (purple theme)
- `/admin/register` - Admin registration page (purple theme) 
- `/admin/dashboard` - Admin dashboard overview
- `/admin/bookings` - Manage all bookings
- `/admin/parking` - Manage parking lots

## 👤 User Routes
- `/login` - User login page (blue theme)
- `/register` - User registration
- `/dashboard` - User dashboard
- `/bookings` - User bookings
- `/parking` - Parking search

## 🔐 Admin Access Setup

### Method 1: Admin Registration (Recommended)
1. Navigate to: `http://localhost:5173/admin/register`
2. Fill in admin details (username, email, password)
3. Account created with `ADMIN` role automatically
4. Redirected to admin dashboard after registration

### Method 2: Create Admin User via Script
```bash
cd backend
npm install bcrypt pg
node create-admin.js
```

This creates:
- Email: `admin@parking.com`
- Password: `admin123`
- Role: `ADMIN`

### Method 3: Manual Database Creation
```sql
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@parking.com', '$2b$04$hashed_password', 'ADMIN');
```

## 🎨 UI Separation

### Admin UI Features:
- **Purple color scheme** (vs blue for users)
- **Separate navigation** (AdminNavbar & AdminSidebar)
- **Admin-only routes** protected by AdminRoute component
- **No mixing** with user UI components

### User UI Features:
- **Blue color scheme**
- **Standard navigation** (Navbar & Sidebar)
- **User-focused routes** protected by ProtectedRoute component
- **Admin login link** in navbar for access

## 🔒 Authentication Flow

1. **Admin Login**: `/admin/login` → Validates admin role → Redirects to `/admin/dashboard`
2. **User Login**: `/login` → Standard user flow → Redirects to `/dashboard`
3. **Role Protection**: AdminRoute component checks `role === 'ADMIN'`
4. **Auto Redirect**: Non-admins accessing admin routes are redirected to user dashboard

## 🛡️ Security Features

- **JWT tokens** include user role
- **Route protection** at component level
- **Separate login flows** prevent confusion
- **Role-based redirects** maintain separation

## 📱 Access Points

### Admin Access:
1. **Registration**: `http://localhost:5173/admin/register` (Recommended)
2. **Login**: `http://localhost:5173/admin/login`
3. **From user navbar**: "Admin Login" and "Admin Register" links
4. **Auto-redirect**: If accessing admin routes without auth

### User Access:
1. **Registration**: `http://localhost:5173/register`
2. **Login**: `http://localhost:5173/login`

## 🔄 Backend Integration

The admin UI integrates with existing backend services:
- **Auth Service**: Validates admin credentials
- **Booking Service**: Admin booking management
- **Parking Service**: Admin parking lot management
- **API Gateway**: Routes all admin requests

## 🎯 Key Differences

| Feature | User UI | Admin UI |
|---------|---------|----------|
| Color Scheme | Blue | Purple |
| Navigation | Standard | Admin-specific |
| Login Page | `/login` | `/admin/login` |
| Dashboard | User-focused | System overview |
| Access Control | ProtectedRoute | AdminRoute |
| Data Scope | Personal data | All system data |

## 🚀 Quick Start

1. **Start services**: `docker-compose up`
2. **Create admin**: `cd backend && node create-admin.js`
3. **Access admin**: `http://localhost:5173/admin/login`
4. **Login**: `admin@parking.com` / `admin123`

The admin UI is now completely separate from the user UI with proper authentication and routing! 🎉
