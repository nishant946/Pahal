# Teacher Verification System

## Overview

The application has been updated to use a teacher-only model with a verification system. All users who register are now teachers, and they must be verified by an admin before they can perform any operations.

## Key Changes

### Backend Changes

1. **Removed User Model**: The separate user model has been removed. All authentication now uses the teacher model.

2. **Updated Teacher Model**: Added `isAdmin` field to distinguish between regular teachers and admin teachers.

3. **Authentication Middleware**: Created comprehensive middleware for:
   - Token verification (`authenticateToken`)
   - Verification status check (`requireVerification`)
   - Admin access check (`requireAdmin`)

4. **Registration Flow**: 
   - All registrations create teacher accounts
   - New teachers are unverified by default (`isVerified: false`)
   - Teachers can login but are restricted until verified

5. **Admin Routes**: Created dedicated admin routes for teacher verification:
   - `GET /api/v1/admin/teachers/unverified` - Get unverified teachers
   - `PATCH /api/v1/admin/teachers/:id/verify` - Verify a teacher

### Frontend Changes

1. **Updated Authentication Context**: 
   - Removed user-related functionality
   - Added verification status handling
   - Updated login flow to redirect based on verification status

2. **New Pages**:
   - `PendingVerification` - Shows verification status for unverified teachers
   - Updated `TeacherVerification` - Admin page to verify teachers

3. **Protected Routes**: 
   - Created `VerifiedTeacherProtectedRoute` for verified teachers only
   - Updated sidebar to show/hide items based on verification status

4. **Registration Form**: 
   - Simplified to match teacher model fields
   - Removed confirm password field
   - Updated validation

## User Flow

### For New Teachers:
1. Register with teacher information
2. Account is created with `isVerified: false`
3. Can login but redirected to pending verification page
4. Must wait for admin verification
5. Once verified, can access all features

### For Admins:
1. Login with admin credentials
2. Access admin dashboard
3. View unverified teachers in Teacher Verification section
4. Verify teachers by clicking "Approve"
5. Verified teachers can now access the platform

### For Verified Teachers:
1. Login with verified credentials
2. Access all features normally
3. Can perform all operations

## Setup Instructions

1. **Create Admin Account**:
   ```bash
   cd server
   npm run create-admin
   ```
   This creates an admin account with:
   - Email: admin@school.com
   - Password: admin123

2. **Start the Application**:
   ```bash
   # Backend
   cd server
   npm run dev
   
   # Frontend
   cd client
   npm run dev
   ```

3. **Test the Flow**:
   - Register a new teacher account
   - Login as admin and verify the teacher
   - Login as the verified teacher to access features

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new teacher
- `POST /api/v1/auth/login` - Login teacher

### Admin (requires admin token)
- `GET /api/v1/admin/teachers/unverified` - Get unverified teachers
- `PATCH /api/v1/admin/teachers/:id/verify` - Verify teacher

### Protected Routes (requires verified teacher token)
- All other routes require verification

## Security Features

1. **JWT Authentication**: All requests require valid JWT tokens
2. **Verification Check**: Unverified teachers cannot access protected routes
3. **Admin Authorization**: Admin-only routes require admin privileges
4. **Automatic Logout**: Invalid tokens automatically redirect to login

## Database Schema

### Teacher Model
```javascript
{
  rollNo: String (unique),
  name: String,
  mobileNo: String,
  email: String (unique),
  department: String,
  preferredDays: [String],
  subjectChoices: [String],
  designation: String,
  qualification: String (optional),
  joiningDate: Date,
  password: String (hashed),
  isVerified: Boolean (default: false),
  isAdmin: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
``` 