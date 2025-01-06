const SubSection=require('../models/SubSection');
const CourseProgress=require('../models/CourseProgress');

exports.updateCourseProgress=async(req,resp)=>{
    try{
        const {courseId,subSectionId}=req.body;
        const userId=req.user.id;

        const subSection=await SubSection.findById(subSectionId);
        if(!subSection){
            return resp.status(404).json({
                success:false,
                message:"Invalid Subsection"
            })
        }
        const courseProgress=await CourseProgress.findOne({courseID:courseId,userId:userId});
        if(!courseProgress){
            return resp.status(404).json({
                success:false,
                message:"Course Progress Dont Exist"
            })
        }
        else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return resp.status(404).json({
                    success:false,
                    message:"Sub Section Already Completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId);
            await courseProgress.save();
            
            return resp.status(200).json({
                success:true,
                message:"Video Completed",
                data:courseProgress
            })
        }
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Internal Server"+err.message,
        })
    }
}