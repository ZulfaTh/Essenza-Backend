import express from "express";
import {
  addStaff,
  getStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = express.Router();

router.post("/addStaff", addStaff);
router.get("/", getStaffs);
router.get("/:id", getSingleStaff);
router.patch("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
