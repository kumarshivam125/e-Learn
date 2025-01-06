const mongoose=require('mongoose');
const courseProgressSchema=new mongoose.Schema({
    courseID:{type:mongoose.Schema.Types.ObjectId, ref:"Course"},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    completedVideos:[{type:mongoose.Schema.Types.ObjectId, ref:"SubSection"}]
});
const courseProgressModel=mongoose.model('CourseProgress',courseProgressSchema);
module.exports=courseProgressModel;