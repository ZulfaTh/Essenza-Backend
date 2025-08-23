import staffModel from "../models/staffModel.js"

const changeStaffAvailability = async (req,res)=>{
  try {
    const {staffId} =req.body

    const staffData = await staffModel.findById(staffId)
    await staffModel.findByIdAndUpdate(staffId,{available: !staffData.available})
     res.json({success:true,message:'Availability changed'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const staffList = async (req,res)=>{
  try {
  
    const staffs = await staffModel.find({}).select(['-password','-email'])
    
     res.json({success:true,staffs})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export  {changeStaffAvailability,staffList};