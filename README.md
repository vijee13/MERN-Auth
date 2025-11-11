# MERN Authentication System

A full-stack authentication system built with MongoDB, Express, React, and Node.js.

## Features

- User Registration & Login
- JWT-based Authentication
- Email Verification with OTP
- Password Reset with OTP
- Protected Routes
- Cookie-based Session Management

## Project Structure

```
Mern-Auth/
├── client/          # React frontend
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
├── server/          # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SENDER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SENDER_EMAIL` - Email address for sending OTPs
- `EMAIL_PASSWORD` - App password for email service
- `NODE_ENV` - Environment (development/production)

### Client (.env)
- `VITE_BACKEND_URL` - Backend API URL (optional, defaults to proxy)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/is-auth` - Check authentication status
- `POST /api/auth/send-verify-otp` - Send email verification OTP
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/send-reset-otp` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### User
- `GET /api/user/data` - Get user data (protected)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer

### Frontend
- React
- React Router
- Axios
- React Toastify
- Tailwind CSS
- Vite

## License

MIT

