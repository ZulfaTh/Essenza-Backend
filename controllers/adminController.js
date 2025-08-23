import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import staffModel from "../models/staffModel.js";
import serviceModel from "../models/serviceModel.js";
import jwt from "jsonwebtoken";

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
    const { name, about,duration,price } = req.body;
    const imageFile = req.file;

    //Checking for all data to add staff
    if (!name || !about ||!duration ||!price) {
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

export { addStaff,addService, loginAdmin, allStaffs ,allServices};
