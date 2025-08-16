import mongoose from "mongoose";
import staffModel from '../models/staffModel.js';

//to create a user-POST
const addStaff = async (req, res) => {
  const { name,description, role } = req.body;

  try {
    const staff = await staffModel.create({
      name,
      description,
      role,
    });
    res.status(200).json(staff);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get all users
const getStaffs = async (req, res) => {
  try {
    const staffs = await staffModel.find({});
    res.status(200).json(staffs);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get single user
const getSingleStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "staff not found" });
  }
  try {
    const singleStaff = await staffModel.findById(id);
    res.status(200).json(singleStaff);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//update users
const updateStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Staff not found" });
  }
  try {
    const staff = await staffModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      {new:true}//to display the updated value in postman
    );
    res.status(200).json(staff);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//delete users
const deleteStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Staff not found" });
  }
  try {
    const user = await staffModel.findByIdAndDelete(id);
    // res.status(200).json(staff);
      res.status(200).json({ message: "Staff deleted successfully" ,user});
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export { addStaff, getStaffs, getSingleStaff ,updateStaff ,deleteStaff};
