import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 4000;

connectDb();

// ✅ FIX 1: CORS — production URL bhi allow karo
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // Vercel URL: https://your-app.vercel.app
].filter(Boolean); // undefined values hataao

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// api endpoints
app.get("/", (req, res) => res.send("API WORKING"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ FIX 2: Global error handler — bina iske ApiError responses nahi milenge
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});

app.listen(port, () => console.log(`server started on port : ${port}`));
