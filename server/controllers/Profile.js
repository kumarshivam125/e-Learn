const User = require('../models/User');
const Profile = require('../models/Profile');
const Course = require('../models/Course');
const CourseProgress=require('../models/CourseProgress');

const {uploadImageToCloudinary}=require('../utils/imageUploader');

exports.updateProfile = async (req, resp) => {
  try {
    //In UI dateOfBirth and about is OPTIONAL so if it is 
    // entered then use that value else use "" by default
    //get data  
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    //get userID
    const id = req.user.id;
    if (!contactNumber || !gender || !id) {
      resp.status(400).json({
        success: false,
        message: "FILL ALL the Details!!"
      })
    }
    const user = await User.findById(id);
    const userProfileId = user.additionalDetails;
    const updatedProfile = await Profile.findByIdAndUpdate(userProfileId, { dateOfBirth, about, contactNumber, gender }, { new: true });

    const updatedUserDetails=await User.findById(id).populate("additionalDetails");
    resp.status(200).json({
      success: true,
      updatedUserDetails,
      message: "Profile Updated"
    })
  }
  catch (err) {
    resp.status(500).json({
      success: false,
      message: "ERROR While UPDATING Profile"
    })
  }
}

exports.deleteAccount = async (req, resp) => {
  try {
    console.log("Prting ID:",req.user) ;   
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      resp.status(400).json({
        success: false,
        message: "User Not Found"
      })
    }
    const userProfileId = userDetails.additionalDetails;
    //delete data from profile table 
    await Profile.findByIdAndDelete(userProfileId);
    //TODO:HE told DO Belwo In HW But I am doing 
    //In course We are having studentEnrolledArray we have to reduce that count also
    //So from all the courses that user is Enrolled In we will remove from that 
    const coursesEnrolled = userDetails.courses; //This will return array of id of COURSES
    for (let courseId of coursesEnrolled) {
      const course = await Course.findByIdAndUpdate(courseId, { $pull: { studentEnrolled: id } });
    }
    // delete data from User table
    await User.findByIdAndDelete(id);
    resp.status(200).json({
      success: true,
      message: "User DELETED"
    })
  }
  catch (err) {
    resp.status(500).json({
      success: false,
      message: "ERROR While DELETING Profile:"+err.message
    })
  }
}

// exports.getAllUserDetails = async (req, resp) => {
//   try {
//     const id = req.user.id;
//     const userDetails = await User.findById(id).populate("additionalDetails").exec();

//     resp.status(200).json({
//       success: true,
//       userDetails,
//       message: "All Details Fetched"
//     })
//   }
//   catch (err) {
//     resp.status(500).json({
//       success: false,
//       message: "ERROR While Fetching all User Details"
//     })
//   }
// }

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary( displayPicture,process.env.FOLDER_NAME,1000,1000);
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate( { _id: userId },{ image: image.secure_url },{ new: true }).populate("additionalDetails");
    res.send({
      success: true,
      message: 'Image Updated successfully',
      data: updatedProfile,
    })
  } 
  catch (error){
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    let userId = req.user.id
    let userDetails = await User.findOne({_id: userId})
    .populate({
      path:"courses",
      populate:{
        path:"courseContent",
        populate:{
          path:"subSection"
        }
      }
    }).exec();
    
    if(!userDetails){
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    let arr=[];
    let courses=userDetails.courses;
    for(let course of courses){
      let totalLecture=0;
      course.courseContent.forEach(sec=>{
        totalLecture+=sec.subSection.length
      })

      let courseProgress=await CourseProgress.findOne({courseID:course._id ,userId:userId});
      let completedVidLen=courseProgress.completedVideos.length;
      let percentage = (completedVidLen / totalLecture) * 100; // e.g., 12.3456
      let roundedPercentage = Math.round(percentage * 100) / 100; // Result: 12.35
      arr.push(roundedPercentage);
    }
    userDetails=userDetails.toObject();
    userDetails.arr=arr;
    return res.status(200).json({
      success: true,
      data: userDetails,
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.instructorDashboard=async(req,resp)=>{
  try{
    const courseDetails=await Course.find({instructor:req.user.id});
    const courseData=courseDetails.map(course=>{
        const totalStudentEnrolled=course.studentEnrolled.length;
        const totalAmountGenerated=totalStudentEnrolled*course.price;

        const data={
          _id:course._id,
          courseName:course.courseName,
          courseDescription:course.courseDescription,
          totalStudentEnrolled,totalAmountGenerated
        }
        return data
    })
    return resp.status(200).json({
      success: true,
      message: "Data Fetched Sccessfully",
      courses:courseData
    })
  }
  catch(err){
    return resp.status(500).json({
      success: false,
      message: "Internal Server Error"+err.message,
    })
  }
}