import mongoose from "mongoose";
import userModel from "../models/UserModel.js";
import staffModel from '../models/staffModel.js'
import serviceModel from '../models/serviceModel.js';
import appointmentModel from '../models/appointmentModel.js';
import { v2 as cloudinary } from "cloudinary";

//API to get user profile data
const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        image: user.image,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//API to update user profile
const updateUser = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const imageFile = req.file;

    if (!name) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(
      userId,
      { name },
      { new: true } //to display the updated value in postman
    );

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    return res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, staffId, services, slotDate, slotTime, phone } = req.body;

    // ✅ Validate input
    if (!userId || !staffId || !services || services.length === 0 || !slotDate || !slotTime || !phone) {
      return res.json({ success: false, message: "Missing details" });
    }

    // ✅ Validate user
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ Validate staff
    const staffData = await staffModel.findById(staffId).select("-password");
    if (!staffData) {
      return res.json({ success: false, message: "Staff not found" });
    }

    // ✅ Validate and calculate service cost
    let serviceData = [];
    let totalAmount = 0;

    for (const serviceId of services) {
      const service = await serviceModel.findById(serviceId);
      if (!service) {
        return res.json({ success: false, message: `Service not found: ${serviceId}` });
      }
      serviceData.push(service);
      totalAmount += service.price;
    }

    // ✅ Prepare appointment data
    const staffInfo = staffData.toObject();
    delete staffInfo.slots_booked; // Remove unnecessary field

    const appointmentData = {
      userId,
      staffId,
      services,
      userData,
      staffData: staffInfo,
      serviceData,
      phone,
      amount: totalAmount,
      slotTime,
      slotDate,
      date: Date.now(),
      cancelled: false,
      payment:true
    };

    // ✅ Save appointment
    await new appointmentModel(appointmentData).save();

    // ✅ Update staff slot bookings
    let slots_booked = staffData.slots_booked || {};
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    slots_booked[slotDate].push(slotTime);
    await staffModel.findByIdAndUpdate(staffId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user appointments for frontend appointment history
const listAppointment = async (req,res) =>{
  try {
    
    const {userId} = req.body;

    const appointments = await appointmentModel.find({userId})
    .populate("review", "rating comment createdAt");

    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}

//API to cancel appointment
const cancelAppointment = async (req,res) =>{

  try {
    const {userId,appointmentId} = req.body;


    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appoitment id belongs the same userid
    if(appointmentData.userId !== userId){
      return res.json({success:false,message:'Unauthorized action'})
    }

    //this will make cancel
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    //releasing the cancelled timeslot to book
    const {staffId, slotDate,slotTime} = appointmentData

    const staffData =await staffModel.findById(staffId)

    let slots_booked = staffData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !== slotTime)

    await staffModel.findByIdAndUpdate(staffId, {slots_booked})

    res.json({success:true,message:'Appointment cancelled'})


  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
}

export { getUserData, updateUser ,bookAppointment,listAppointment,cancelAppointment};
