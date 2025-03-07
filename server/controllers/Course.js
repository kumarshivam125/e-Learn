const User=require('../models/User'); //course ka "instructor" hoga which is suer type
const Category=require('../models/Category'); //Course ka "Tag" hoga so make a tag and store that object in Course Object
const Course=require('../models/Course');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Section=require('../models/Section');
const SubSection=require('../models/SubSection');
const CourseProgress=require('../models/CourseProgress');
const { convertSecondsToDuration } = require("../utils/secToDuration");
require('dotenv').config();

exports.createCourse=async(req,resp)=>{
    try{
        //fetch data
        let {courseName,courseDescription,whatYouWillLearn, price,tag,category,
        status, instructions,}=req.body;
        
        // get thumbnail
        const thumbnail=req.files?.thumbnailImage;
        console.log("PRINY THUMBNAIL",thumbnail)
        //validation
        if(!courseName|| !courseDescription ||!whatYouWillLearn|| !price || !tag || !category){
            return resp.status(401).json({
                success:false,
                message:"All fields are required"
            }) 
        }
        if (!status || status === undefined) {
			status = "Draft";
		}

        // What we stored from token in auth file we are extracting that only
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        // TODO:Check "userId" and "instructorDetails._id" are same or differnent
        console.log("Instructor Details:",instructorDetails);

        if(!instructorDetails){
            return resp.status(404).json({
                success:false,
                message:"Instructor Not Found"
            }) 
        }
        
        // In below line "category" is id 
        // from POSTMAN we will send id bcz u can see in schema of "course" that we are storing id 
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return resp.status(404).json({
                success:false,
                message:"Category Details Not Found"
            }) 
        }
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //Create new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            instructor: instructorDetails._id,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            tag,
            status,instructions
        })
        
        //add new course to user Schema of instructor
        const updatedInstructorDetails=await User.findByIdAndUpdate({_id:userId},{$push:{courses:newCourse._id}} ,{new:true});
        
        //add new course to Tag schema .HE Told DO IN HW
        const updatedCategoryDetails=await Category.findByIdAndUpdate({_id:category},{$push:{courses:newCourse._id}},{new:true});

        return resp.status(200).json({
            success:true,
            data:newCourse,
            message:"Course Created Successfully"
        }) 
    }   
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"ERROR while Creating Course:"+err.message
        }) 
    }
}

exports.showAllCourses=async(req,resp)=>{
    try{
        const allCourses=await Course.find({},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
        );

        if(!allCourses){
            return resp.status(400).json({
                success:false,
                message:"NO Courses To show"
            })     
        }
        return resp.status(200).json({
            success:true,
            allCourses,
            message:"SUCCESSFULLY Fetched all Courses:"
        }) 
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Cannot Fetch all Courses:"+err.message
        }) 
    }
}

exports.getCourseDetails=async(req,resp)=>{
    try{
        const {courseId}=req.body;
        //find Course Details
        const courseDetails=await Course.findOne({_id:courseId})
                                            .populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            })
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .populate({
                                              path:"ratingAndReviews",
                                              populate:{
                                                path:"user",
                                                select:"image firstName lastName"
                                              }
                                            })
                                            .populate("category").exec();
        if(!courseDetails){
            return resp.status(400).json({
                success:false,
                message:`Could Not Find Course with ID ${courseId}`
            })
        }
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
        
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return resp.status(200).json({
            success:true,
            message:"All Details Fetched",
            data:{
              courseDetails,totalDuration
            }
        })

    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Something Went Wrong While Fetching ALL the Course Details"
        })
    }
}

exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({_id: courseId,})
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({_id: courseId})
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgress = await CourseProgress.findOne({courseID: courseId,userId: userId,});
  
      console.log("courseProgressCount : ", courseProgress)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      if (courseDetails.status === "Draft") {
        return res.status(403).json({
          success: false,
          message: `Accessing a draft course is forbidden`,
        });
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          // completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos: [],
          completedVideos: courseProgress?.completedVideos ?? [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({instructor: instructorId,}).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}
  // Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId} = req.body
      // console.log("DELETE COURSE ID",courseId);
      // console.log("DELETE COURSE DATA",courseId,data);
      // Find the course
      
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
    

      // Unenroll students from the course
      const studentsEnrolled = course.studentEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
      const categoryId=course.category;
      //Removing the Course From Category      
      await Category.findByIdAndUpdate(categoryId,{$pull:{courses:courseId}});

      await Course.findByIdAndDelete(courseId)

      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
}