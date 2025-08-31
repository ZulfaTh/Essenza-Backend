import reviewModel from "../models/reviewModel.js";
import appointmentModel from "../models/appointmentModel.js";


export const createReview = async (req, res) => {
  try {
    const { appointmentId, staffId, rating, comment,userId } = req.body;
   

    if (!userId) {
      return res.json({ success:false,message: "User not authenticated" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || !appointment.isCompleted) {
       return res.json({ success:false, message: "Appointment not completed yet" });
    }

    const existingReview = await reviewModel.findOne({ appointmentId });
    if (existingReview) {
       return res.json({ success:false, message: "Review already submitted" });
    }

    const review = new reviewModel({
      appointmentId,
      userId,
      staffId,
      rating,
      comment,
    });

    appointment.review = review._id;
    await appointment.save();

    await review.save();
     res.json({ success:true,message: "Review submitted successfully", review });
  } catch (error) {
     res.json({ success:false,message: error.message });
  }
};


export const getReviewsByStaff = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ staffId: req.params.staffId });
     res.json({ success:true,reviews});
  } catch (error) {
     res.json({ success:false, message: error.message });
  }
};


//to disply to users
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find()
      .populate("userId", "name email")
      .populate("staffId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

