const mongoose=require('mongoose');
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:[{type:mongoose.Schema.Types.ObjectId,ref:"Section"}],
    ratingAndReviews:[{type:mongoose.Schema.Types.ObjectId,ref:"RatingAndReview"}],
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    tag: {
		type: [String],
		required: true,
	},
    category:{ type:mongoose.Schema.Types.ObjectId,ref:"Category" },
    studentEnrolled:[{type:mongoose.Schema.Types.ObjectId,ref:"User" }],
    //After seeing his codebase i added i dont know why this BELOW
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
const courseModel=mongoose.model('Course',courseSchema);
module.exports=courseModel;
