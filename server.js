import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import authRouter from "./routes/authRoutes.js";


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

const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true }));

//API endpoints
app.get("/", (req, res) => {
  res.send("helloo from backend");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/staffs", staffRoutes);
