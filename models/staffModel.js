import mongoose from "mongoose";

const Schema=mongoose.Schema;

const staffSchema=new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
           type:String,
           required:true,
           unique:true
        },
        password:{
           type:String,
           required:true
        },
        image:{
           type:String,
           required:true
        },
        speciality:{
           type:String,
           required:true
        },
        experience:{
           type:String,
           required:true
        },
        about:{
            type:String,
            required:true,
        },
        available:{
           type:Boolean,
           default:true
        },
        date:{
           type:Number,
           required:true
        },
        slots_booked:{
           type:Object,
           default:{}
        },
    },{minimize:false}    
);

const staffModel = mongoose.models.staff || mongoose.model('staff',staffSchema);
export default staffModel;