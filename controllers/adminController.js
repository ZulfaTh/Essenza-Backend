import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/UserModel.js";
import staffModel from "../models/staffModel.js";
import serviceModel from "../models/serviceModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";

//API for adding staff
const addStaff = async (req, res) => {
  try {
    const { name, email, password, speciality, experience, about } = req.body;
    const imageFile = req.file;

    //Checking for all data to add staff
    if (!name || !email || !password || !speciality || !experience || !about) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //checking for unique email address
    const existingStaff = await staffModel.findOne({ email });

    if (existingStaff) {
      return res.json({
        success: false,
        message: "Staff email already exists",
      });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    //validating strong passowrd
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //hashing staff password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    //store data in db
    const staffData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      experience,
      about,
      date: Date.now(),
    };
    const newStaff = new staffModel(staffData);
    await newStaff.save();

    res.json({ success: true, message: "Staff Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for adding service
const addService = async (req, res) => {
  try {
    const { name, about, duration, price } = req.body;
    const imageFile = req.file;

    //Checking for all data to add staff
    if (!name || !about || !duration || !price) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    //store data in db
    const serviceData = {
      name,
      image: imageUrl,
      about,
      duration,
      price,
      date: Date.now(),
    };
    const newService = new serviceModel(serviceData);
    await newService.save();

    res.json({ success: true, message: "Service Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Edit staff
const updateStaff = async (req, res) => {
  try {
    const { staffId, name, experience, speciality, about } = req.body;
    const imageFile = req.file;

    if (!name || !experience || !speciality || !about) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = { name, experience, speciality, about };

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    const updatedStaff = await staffModel.findByIdAndUpdate(
      staffId,
      updateData,
      { new: true }
    );

    return res.json({ success: true, message: "Profile updated", staff: updatedStaff });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Edit Service
const updateService = async (req, res) => {
  try {
    const { serviceId, name, about, duration, price } = req.body;
    const imageFile = req.file;

    if (!name || !about || !duration || !price) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = { name, about, duration, price };

    if (imageFile) {
      // upload new image if provided
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    const updatedService = await serviceModel.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Service updated",
      service: updatedService,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Staff
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.json({ success: false, message: "Staff ID is required" });
    }

    await staffModel.findByIdAndDelete(staffId);

    res.json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.json({ success: false, message: "Service ID is required" });
    }

    await serviceModel.findByIdAndDelete(serviceId);

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//ApI to get all users for admin page
const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password"); 
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get all staffs list for admin page
const allStaffs = async (req, res) => {
  try {
    const staffs = await staffModel.find({}).select("-password"); //this will remove password property
    res.json({ success: true, staffs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get all staffs list for admin page
const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allReviews = async (req, res) => {
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

//API to get all appointment list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("review", "rating comment");

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { staffId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.staffId === staffId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for apppointment cancellation by admin
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    //this will make cancel
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing the cancelled timeslot to book
    const { staffId, slotDate, slotTime } = appointmentData;

    const staffData = await staffModel.findById(staffId);

    let slots_booked = staffData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await staffModel.findByIdAndUpdate(staffId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for admin
const adminDashboard = async (req, res) => {
  try {
    const staffs = await staffModel.find({});
    const users = await userModel.find({});
    const services = await serviceModel.find({});
    const appointments = await appointmentModel
      .find({})
      .populate("review", "rating comment");

    const dashData = {
      staffs: staffs.length,
      users: users.length,
      services: services.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addStaff,
  updateStaff,
  deleteStaff,
  addService,
  updateService,
  deleteService,
  loginAdmin,
  allUsers,
  allStaffs,
  allServices,
  allReviews,
  appointmentsAdmin,
  appointmentComplete,
  appointmentCancel,
  adminDashboard,
};
