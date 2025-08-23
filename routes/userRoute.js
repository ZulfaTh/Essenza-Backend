import express from "express";
import { bookAppointment, cancelAppointment, getUserData, listAppointment, updateUser } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/multor.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post("/update-user", upload.single("image"), userAuth, updateUser);
userRouter.post('/book-appointment',userAuth,bookAppointment)
userRouter.get('/appointments',userAuth,listAppointment)
userRouter.post('/cancel-appointment',userAuth,cancelAppointment)

export default userRouter;
