# Authentication System Setup

## Overview
Complete authentication system using Supabase with user registration, login, password reset, and admin access control.

## Features
- User registration and login
- Password reset functionality
- Admin role management
- Protected routes
- Row Level Security (RLS) policies
- Session management

## Setup Instructions

### 1. Supabase Configuration
1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Run Database Migrations
Execute the SQL migrations in your Supabase SQL editor:
1. `supabase/migrations/001_init.sql` - Creates tables
2. `supabase/migrations/002_auth_policies.sql` - Sets up RLS policies

### 3. Create Admin User
1. Sign up a user through the app
2. In Supabase dashboard, go to Authentication > Users
3. Copy the user's UUID
4. Run in SQL editor:
```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'user_uuid_here';
```

## Usage

### Authentication Context
```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, signIn, signUp, signOut } = useAuth();
  
  // user contains: id, email, fullName, isAdmin
}
```

### Protected Routes
```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

### Auth Modal
Already integrated in Header component. Users can:
- Sign up with email, password, and full name
- Sign in with email and password
- Reset password via email

## Security Features
- Row Level Security enabled on all tables
- Users can only view/edit their own data
- Admins have full access to products and orders
- Automatic profile creation on signup
- Secure password hashing by Supabase Auth

## API Reference

### authService
- `signUp(email, password, fullName)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user data
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password
- `onAuthStateChange(callback)` - Listen to auth state changes

## Files Created
- `src/lib/auth.ts` - Authentication service
- `src/context/AuthContext.tsx` - Auth context provider
- `src/components/ProtectedRoute.tsx` - Protected route component
- `src/components/ResetPasswordModal.tsx` - Password reset modal
- `supabase/migrations/002_auth_policies.sql` - RLS policies

## Files Modified
- `src/main.tsx` - Added AuthProvider
- `src/components/AuthModal.tsx` - Integrated Supabase auth
- `src/components/Header.tsx` - Integrated useAuth hook
