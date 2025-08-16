import mongoose from "mongoose";

const Schema=mongoose.Schema;

const UserSchema=new Schema(
    {
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
            unique:true,//cant have same email
        },
        // userName:{
        //     type:String,
        //     require:true,
        // },
        password:{
            type:String,
            require:true,
        },
         // role:{
        //     type:String,
        //     require:true,
        // }
        verifyOtp:{
            type:String,
            default:'',
        },
        verifyOtpExpireAt:{
            type:Number,
            default:0
        },
        isAccountVerified:{
            type:Boolean,
            default:false
        },
        resetOtp:{
            type:String,
            default:'',
        },
        resetOtpExpireAt:{
            type:Number,
            default:0,
        },

    },    
);

// // module.exports=mongoose.model("User",UserSchema);
// export default mongoose.model("User", UserSchema);

const userModel=mongoose.models.user || mongoose.model('user',UserSchema);

export default userModel;
