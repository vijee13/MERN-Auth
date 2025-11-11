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
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  const origin = req.headers.origin;
  if (origin && /^http:\/\/localhost:\d+$/.test(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // ✅ dynamically use the requesting port
  } else if (
    ["https://yourapp.netlify.app", "https://yourapi.onrender.com"].includes(origin)
  ) {
    res.header("Access-Control-Allow-Origin", origin); // ✅ allow production URLs
  }

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
