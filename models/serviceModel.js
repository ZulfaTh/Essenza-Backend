import mongoose from "mongoose";

const Schema=mongoose.Schema;

const ServiceSchema=new Schema(
    {
        name:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
         duration:{
            type:String,
            require:true,
        },
         price:{
            type:String,
            require:true,
        }
    },    
);

export default mongoose.model("Service",ServiceSchema);