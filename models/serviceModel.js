import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required:true,
  },
  image: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});


const serviceModel = mongoose.models.service || mongoose.model('service',serviceSchema);
export default serviceModel;
