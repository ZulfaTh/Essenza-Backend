import mongoose from "mongoose";
import userModel from '../models/UserModel.js';

// //to get all
// const getUsers = async (req, res) => {
//   try {
//     const users = await userModel.find({});
//     res.status(200).json(users);
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// };

//to get single
const getUserData = async (req, res) => {
 
    try {
      const {userId}=req.body;

    const user = await userModel.findById(userId);

    if(!user){
      return res.json({success:false,message:'User not found'});
    }

    res.json({
      success:true,
      userData:{
        name:user.name,
        email:user.email,
        isAccountVerified:user.isAccountVerified
      }
    })
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// //update 
// const updateUser = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "user not found" });
//   }
//   try {
//     const user = await userModel.findByIdAndUpdate(
//       {
//         _id: id,
//       },
//       {
//         ...req.body,
//       },
//       {new:true}//to display the updated value in postman
//     );
//     res.status(200).json(user);
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// };

// //delete 
// const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "user not found" });
//   }
//   try {
//     const user = await userModel.findByIdAndDelete(id);
//     // res.status(200).json(user);
//       res.status(200).json({ message: "User deleted successfully" ,user});
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// };

export{ getUserData};
