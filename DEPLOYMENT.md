# Deployment Guide: MERN Auth to Netlify & Render

This guide will help you deploy your MERN authentication application with:
- **Frontend (React)**: Deployed on **Netlify**
- **Backend (Node.js/Express)**: Deployed on **Render**

---

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Netlify Account** (free tier available)
3. **Render Account** (free tier available)
4. **MongoDB Atlas Account** (free tier available) - for cloud database
5. **Gmail Account** - for email service (or any SMTP service)

---

## Step 1: Prepare Your Code

### 1.1 Push Your Code to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/mern-auth.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` to allow all IPs, or Render's IPs)
5. Get your connection string (replace `<password>` with your password)

### 2.2 Deploy Backend on Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the Service**:
   - **Name**: `mern-auth-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `server` if you want)

4. **Set Environment Variables** in Render Dashboard:
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   SENDER_EMAIL=your_email@gmail.com
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.netlify.app
   ```

   **Important Notes**:
   - `PORT`: Render automatically sets this, but you can use `10000` as default
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong random string (at least 32 characters)
   - `SMTP_USER`: Your Gmail address (for SMTP authentication)
   - `SMTP_PASSWORD`: Gmail App Password (not your regular password)
     - Enable 2FA on Gmail
     - Go to Google Account → Security → App Passwords
     - Generate a new app password for "Mail"
   - `SENDER_EMAIL`: Your Gmail address (used as the "from" address in emails)
   - `FRONTEND_URL`: Your Netlify URL (you'll update this after deploying frontend)

5. **Click "Create Web Service"**

6. **Wait for deployment** - Render will build and deploy your backend

7. **Copy your backend URL** - It will look like: `https://mern-auth-backend.onrender.com`

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Deploy Frontend on Netlify

1. **Sign up/Login** to [Netlify](https://www.netlify.com)

2. **Create a New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

4. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_BACKEND_URL=https://your-backend-name.onrender.com
     ```
   - Replace `your-backend-name.onrender.com` with your actual Render backend URL

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the build to complete

6. **Update Site Name** (Optional):
   - Go to Site settings → General → Site details
   - Change site name to something like `mern-auth-app`
   - Your URL will be: `https://mern-auth-app.netlify.app`

---

## Step 4: Update CORS and Environment Variables

### 4.1 Update Backend CORS

After deploying frontend, update the `FRONTEND_URL` environment variable in Render:
1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Update `FRONTEND_URL` to your actual Netlify URL:
   ```
   FRONTEND_URL=https://your-app-name.netlify.app
   ```
4. Save and redeploy (or it will auto-redeploy)

### 4.2 Verify Frontend Environment Variable

In Netlify, ensure `VITE_BACKEND_URL` is set correctly:
```
VITE_BACKEND_URL=https://your-backend-name.onrender.com
```

**Important**: After changing environment variables in Netlify, you need to **trigger a new deployment**:
- Go to Deploys → Trigger deploy → Deploy site

---

## Step 5: Testing Your Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-name.onrender.com`
   - Should see: "✅ Backend running properly with CORS"

2. **Test Frontend**:
   - Visit your Netlify URL
   - Try registering a new user
   - Check if emails are being sent
   - Test login/logout functionality

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Problem**: CORS errors
- Verify `FRONTEND_URL` in Render matches your Netlify URL exactly
- Check that the URL includes `https://` and no trailing slash

**Problem**: MongoDB connection failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database user password is correct

**Problem**: Email not sending
- Verify Gmail App Password (not regular password)
- Check `SMTP_USER`, `SMTP_PASSWORD`, and `SENDER_EMAIL` are correct
- Ensure 2FA is enabled on Gmail
- Verify all three email-related environment variables are set

### Frontend Issues

**Problem**: API calls failing
- Verify `VITE_BACKEND_URL` in Netlify matches your Render backend URL
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Problem**: Build fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**Problem**: Routes not working (404 on refresh)
- The `netlify.toml` file should handle this with redirects
- Verify `netlify.toml` is in the `client` directory

---

## Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production

**Netlify Free Tier**:
- 100GB bandwidth per month
- 300 build minutes per month
- Usually sufficient for small projects

### Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (at least 32 characters, random)
3. **Keep MongoDB Atlas IP whitelist** restricted if possible
4. **Use environment variables** for all sensitive data
5. **Enable HTTPS** (both Netlify and Render provide this automatically)

### Custom Domain (Optional)

**Netlify**:
- Go to Site settings → Domain management
- Add your custom domain
- Follow DNS configuration instructions

**Render**:
- Go to your service → Settings → Custom Domains
- Add your custom domain
- Update DNS records as instructed

---

## Quick Reference: Environment Variables

### Render (Backend)
```
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-auth?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SENDER_EMAIL=your_email@gmail.com
NODE_ENV=production
FRONTEND_URL=https://your-app-name.netlify.app
```

### Netlify (Frontend)
```
VITE_BACKEND_URL=https://your-backend-name.onrender.com
```

---

## Support

If you encounter issues:
1. Check the logs in both Render and Netlify dashboards
2. Verify all environment variables are set correctly
3. Test backend endpoints directly using Postman or curl
4. Check browser console for frontend errors

---

**Congratulations!** 🎉 Your MERN authentication app should now be live!

