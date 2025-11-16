# Quick Deployment Checklist

Use this checklist to ensure you've completed all deployment steps.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB database user created
- [ ] MongoDB IP whitelist configured (add `0.0.0.0/0` for Render)
- [ ] Gmail 2FA enabled
- [ ] Gmail App Password generated

## Backend Deployment (Render)

- [ ] Render account created
- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Build command set: `cd server && npm install`
- [ ] Start command set: `cd server && npm start`
- [ ] Environment variables set:
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI` (from MongoDB Atlas)
  - [ ] `JWT_SECRET` (strong random string, 32+ chars)
  - [ ] `SMTP_USER` (your Gmail)
  - [ ] `SMTP_PASSWORD` (Gmail App Password)
  - [ ] `SENDER_EMAIL` (your Gmail)
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (will update after frontend deploy)
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., `https://your-backend.onrender.com`)
- [ ] Backend test endpoint works (visit URL, should see success message)

## Frontend Deployment (Netlify)

- [ ] Netlify account created
- [ ] New site created from GitHub
- [ ] Build settings configured:
  - [ ] Base directory: `client`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `client/dist`
- [ ] Environment variable set:
  - [ ] `VITE_BACKEND_URL` (your Render backend URL)
- [ ] Site deployed successfully
- [ ] Site name updated (optional)
- [ ] Frontend URL copied (e.g., `https://your-app.netlify.app`)

## Post-Deployment

- [ ] Updated `FRONTEND_URL` in Render with actual Netlify URL
- [ ] Triggered new Netlify deployment (after env var change)
- [ ] Tested user registration
- [ ] Tested email verification (check email inbox)
- [ ] Tested login functionality
- [ ] Tested logout functionality
- [ ] Tested password reset (if applicable)
- [ ] Checked browser console for errors
- [ ] Verified cookies are working (check DevTools → Application → Cookies)

## Common Issues to Verify

- [ ] No CORS errors in browser console
- [ ] Backend responds to requests
- [ ] Emails are being sent and received
- [ ] MongoDB connection is working
- [ ] JWT tokens are being created and validated
- [ ] Cookies are being set correctly (withCredentials: true)

---

**All checked?** Your app should be fully deployed and working! 🎉

