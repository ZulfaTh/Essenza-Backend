const express = require('express')

const router=express.Router();

const {createUser, getUsers, getSingleUser, updateUser, deleteUser}=require("../controllers/userController");

router.post("/createUser",createUser);
router.get("/",getUsers);
router.get("/:id",getSingleUser);
router.patch("/:id",updateUser); 
router.delete("/:id",deleteUser);

module.exports=router;