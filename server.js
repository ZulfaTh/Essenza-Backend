import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import connectCloudinary from './config/cloudinary.js';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";

import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import staffRouter from "./routes/staffRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import reviewRouter from "./routes/reviewRoute.js";


const app = express();

//Db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "DB connected succesfully and listening to " + process.env.PORT
      );
    });
  })
  .catch((error) => console.log(error));

connectCloudinary();

const allowedOrigins=['http://localhost:5173','http://localhost:5174']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true }));

//API endpoints
app.get("/", (req, res) => {
  res.send("helloo from backend");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);
app.use("/api/admin",adminRouter);
app.use("/api/staff",staffRouter);
app.use("/api/service",serviceRouter);
app.use("/api/payment",paymentRouter);
app.use('/api/reviews',reviewRouter);

