const { default: mongoose } = require("mongoose");
const userModel = require("../models/UserModel.js");

//to create a user-POST
const createUser = async (req, res) => {
  const { name, email, userName, password, role } = req.body;

  try {
    const user = await userModel.create({
      name,
      userName,
      email,
      password,
      role,
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get single user
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "user not found" });
  }
  try {
    const singleUser = await userModel.findById(id);
    res.status(200).json(singleUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//update users
const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user not found" });
  }
  try {
    const user = await userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      }
    );
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//delete users
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user not found" });
  }
  try {
    const user = await userModel.findByIdAndDelete(id);
    // res.status(200).json(user);
      res.status(200).json({ message: "User deleted successfully" ,user});
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = { createUser, getUsers, getSingleUser ,updateUser ,deleteUser};
