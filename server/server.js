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

// ------------------------
// 🌍 Allowed Frontend URLs
// ------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL, // Netlify URL from Render dashboard
];

// ------------------------
// 🔐 CORS Middleware
// ------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Mobile apps / Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------------
// 🧩 Standard Middlewares
// ------------------------
app.use(express.json());
app.use(cookieParser());

// ------------------------
// 🛣 API Routes
// ------------------------
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Test Route
app.get("/", (req, res) => res.send("🚀 Backend running successfully"));

// ------------------------
// 🚀 Start Server
// ------------------------
connectDB().then(() => {
  app.listen(port, () =>
    console.log(`🔥 Server running at http://localhost:${port}`)
  );
});
