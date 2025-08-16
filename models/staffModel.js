import mongoose from "mongoose";

const Schema=mongoose.Schema;

const StaffSchema=new Schema(
    {
        name:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        
        role:{
            type:String,
            require:true,
        }
    },    
);

export default mongoose.model("Staff",StaffSchema);