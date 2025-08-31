import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "staff" },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
