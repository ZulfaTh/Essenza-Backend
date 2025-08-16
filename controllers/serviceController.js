import mongoose from "mongoose";
import serviceModel from '../models/serviceModel.js';


//to POST
const addService = async (req, res) => {
  const { name,description,duration,price } = req.body;

  try {
    const service = await serviceModel.create({
      name,
      description,
      duration,
      price
    });
    res.status(200).json(service);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get all 
const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.status(200).json(services);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//to get single 
const getSingleService = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Service not found" });
  }
  try {
    const singleService = await serviceModel.findById(id);
    res.status(200).json(singleService);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//update 
const updateService = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "service not found" });
  }
  try {
    const service = await serviceModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      {new:true}//to display the updated value in postman
    );
    res.status(200).json(service);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//delete 
const deleteService = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Service not found" });
  }
  try {
    const service = await serviceModel.findByIdAndDelete(id);
    // res.status(200).json(service);
      res.status(200).json({ message: "Service deleted successfully" ,service});
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export { addService, getServices, getSingleService ,updateService ,deleteService};
