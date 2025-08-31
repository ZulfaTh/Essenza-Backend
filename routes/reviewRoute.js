import express from "express";
import { createReview, getReviewsByStaff,getAllReviews } from "../controllers/reviewController.js";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";

const reviewRouter = express.Router();

reviewRouter.post("/add-review",authUser, createReview); 
reviewRouter.get("/staff/:staffId", getReviewsByStaff); 
reviewRouter.get("/list",getAllReviews);  
// reviewRouter.get('/user',getReviewsByUser)            

export default reviewRouter;
