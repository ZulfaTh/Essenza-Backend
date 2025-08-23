import serviceModel from "../models/serviceModel.js"

const changeServiceAvailability = async (req,res)=>{
  try {
    const {serviceId} =req.body

    const serviceData = await serviceModel.findById(serviceId)
    await serviceModel.findByIdAndUpdate(serviceId,{available: !serviceData.available})
     res.json({success:true,message:'Availability changed'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const serviceList = async (req,res)=>{
  try {
  
    const services = (await serviceModel.find({}))
    
     res.json({success:true,services})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export  {changeServiceAvailability,serviceList};