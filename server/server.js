import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Universal CORS — supports any localhost port and production URLs
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow localhost for development
  if (origin && /^http:\/\/localhost:\d+$/.test(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } 
  // Allow production frontend URL from environment variable
  else if (process.env.FRONTEND_URL) {
    // Remove trailing slash for comparison
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    const requestOrigin = origin ? origin.replace(/\/$/, '') : '';
    
    if (requestOrigin === frontendUrl) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
    }
  }
  // Fallback: allow any origin in development mode only
  else if (process.env.NODE_ENV === "development") {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    // ✅ Handle preflight request immediately
    return res.sendStatus(200);
  }

  next();
});


// ✅ Express middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Test route
app.get("/", (req, res) => res.send("✅ Backend running properly with CORS"));

// ✅ Start Server
const startServer = async () => {
  await connectDB();
  app.listen(port, () =>
    console.log(`🚀 Server running on http://localhost:${port}`)
  );
};

startServer();
