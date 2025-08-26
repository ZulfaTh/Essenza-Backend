import express from "express";
import { bookAppointment, cancelAppointment, getUserData, listAppointment, updateUser } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multor.js";

const userRouter = express.Router();

userRouter.get("/data", authUser, getUserData);
userRouter.post("/update-user", upload.single("image"), authUser, updateUser);
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)

export default userRouter;
