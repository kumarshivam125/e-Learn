const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Student","Instructor","Admin"],
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
//We are adding token to every user so that we can use it during FORGOT password option
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date
    },
    courses:[{type:mongoose.Schema.Types.ObjectId, ref:"Course"}],
    image:{
        type:String, //Image ka url hoga so used string type 
        required:true
    },
    courseProgress:[{type:mongoose.Schema.Types.ObjectId, ref:"CourseProgress"}],
    //LATER Added 
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
},{ timestamps: true })

// { timestamps: true } option is used to automatically add two fields to each document: createdAt and updatedAt
//Done Aotomatically BY Mongoose
const userModel=mongoose.model("User",userSchema);
module.exports=userModel;
