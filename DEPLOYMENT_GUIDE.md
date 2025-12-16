# BurgeRank Deployment Guide

## Pre-Deployment Checklist ✅

- [x] Build succeeds with zero errors
- [x] TypeScript compilation complete
- [x] Supabase integration complete
- [x] Authentication system implemented
- [x] Database APIs created
- [x] Route protection middleware configured

---

## What's Required for Deployment

### 1. Supabase Setup (Already Done ✅)

**Status**: Your Supabase project is already configured in `.env.local`

**What's configured**:
- ✅ PostgreSQL database with all required tables
- ✅ Supabase Auth service enabled
- ✅ Email verification configured
- ✅ RLS policies (if needed for security)

**Verify in Supabase Dashboard**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Check "SQL Editor" for these tables:
   - `users` - User profiles
   - `cities` - City data
   - `restaurants` - Restaurant info
   - `burgers` - Burger definitions
   - `ratings` - User ratings
   - `badges` - Achievement badges
   - `user_badges` - User-badge relationships
   - `notifications` - User notifications

**Email Configuration** (IMPORTANT for Vercel):
1. Go to "Authentication" → "Email Templates"
2. Make sure email verification templates are configured
3. Update redirect URL in email template to your Vercel domain:
   - Development: `http://localhost:3000/auth/verify-email`
   - Production: `https://your-domain.vercel.app/auth/verify-email`

### 2. Vercel Environment Variables

Add these to your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Steps**:
1. Go to https://vercel.com
2. Select your BurgeRank project
3. Go to "Settings" → "Environment Variables"
4. Add the three variables above
5. **IMPORTANT**: The `NEXT_PUBLIC_*` variables will be exposed to the browser (intentional)
6. **IMPORTANT**: Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (only needed for local development)

### 3. Vercel Deployment

**Option A: Automatic Deployment (Recommended)**
1. Push to GitHub (see below)
2. Vercel will automatically deploy on every push to main
3. Deployment takes ~2-3 minutes

**Option B: Manual Deployment**
1. Connect GitHub repo to Vercel
2. Click "Deploy" in Vercel dashboard

---

## GitHub Push Instructions

Run these commands:

```bash
# 1. Stage all changes
git add .

# 2. Commit with message
git commit -m "feat: add realistic authentication and data APIs

- Complete auth system (signup, signin, logout, email verification)
- Database-backed APIs (profile, ranking, ratings)
- Route protection middleware
- TypeScript database types
- Supabase integration
- Points and badges infrastructure"

# 3. Push to GitHub
git push origin main
```

---

## Post-Deployment Verification

Once deployed to Vercel, test these flows:

1. **Registration Flow**
   - Visit `https://your-domain.vercel.app/auth/signup`
   - Register with email
   - Check email for verification link
   - Click verification link
   - Should see success message and redirect to signin

2. **Login Flow**
   - Visit `https://your-domain.vercel.app/auth/signin`
   - Login with registered credentials
   - Should redirect to `/ranking` page

3. **Profile API**
   - Visit `https://your-domain.vercel.app/api/profile/[userId]`
   - Should return user data with ratings and badges

4. **Ranking API**
   - Visit `https://your-domain.vercel.app/api/burgers/ranking`
   - Should return list of burgers with ratings

---

## Troubleshooting

### Problem: Email verification not working
**Solution**: Update redirect URL in Supabase email templates to match your Vercel domain

### Problem: Authentication fails
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

### Problem: Database errors
**Solution**: Make sure all tables exist in Supabase. Run schema setup SQL if needed.

### Problem: CORS errors
**Solution**: Supabase handles CORS. If issues persist, update security policies in Supabase dashboard.

---

## Infrastructure Summary

```
GitHub (Code Repository)
    ↓
Vercel (Hosting & Auto-Deploy)
    ↓
Edge Network (Global CDN)
    ↓
Supabase Backend
    ├─ PostgreSQL Database
    ├─ Auth Service
    └─ Real-time Subscriptions
```

---

## What's NOT Yet Implemented (For Future)

- [ ] UI components for profile display
- [ ] Rating form component
- [ ] Badge verification logic
- [ ] Notifications UI
- [ ] Burger creation by users
- [ ] Admin panel updates
- [ ] Payment/rewards redemption
- [ ] Real-time notifications
- [ ] Social features (follow users, etc.)

---

## Environment Variables Reference

| Variable | Required | Scope | Purpose |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Public | Browser authentication |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Public | Email verification redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Dev Only | Private | Server-side operations (NOT in Vercel) |

---

## Timeline

- **Now**: Push to GitHub
- **~2-3 min**: Vercel auto-builds and deploys
- **After deploy**: Test authentication flows
- **Next phases**: Build UI components and integrate APIs

---

**Status**: Ready for production deployment ✅
**Last Updated**: Current session
