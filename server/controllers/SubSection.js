const SubSection=require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
require('dotenv').config();

exports.createSubSection=async(req,resp)=>{
    try{
        //fetch from req body
        const {sectionId,title,description}=req.body;
        //extract file 
        const video=req.files.video;
        
        //validation
        if(!sectionId || !title || !description|| !video){
            resp.status(400).json({
                success:false,
                message:"Fill ALL Fields"
            })
        }
        //upload video to cloudinary
        const uplodResponse=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        
        //create SubSection and update the section
        const newSubSection= await SubSection.create({
            title,timeDuration:uplodResponse.duration,description,videoUrl:uplodResponse.secure_url
        });        
 
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{$push:{subSection:newSubSection._id}} 
            ,{new:true}).populate("subSection");
        
        resp.status(200).json({
            success:true,
            data:updatedSection,
            message:"SubSection Created!!"
        })                                        
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"ERROR while Creating SUBSECTION:"+err.message
        })
    }
}
//HW:TODO
exports.updateSubSection=async(req,resp)=>{
    try{
        const {subSectionId,title,description,sectionId}=req.body;
        const findingSubSection=await SubSection.findById(subSectionId);

        if(!findingSubSection){
            return resp.status(401).json({
                success:false,
                message:"Sub Section Not Present"
            })
        }
        if (title !== undefined) 
            findingSubSection.title = title
        
        if(description !== undefined) 
            findingSubSection.description = description
        
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
            findingSubSection.videoUrl = uploadDetails.secure_url
            findingSubSection.timeDuration = uploadDetails.duration
        }
        await findingSubSection.save()
        
        const result=await Section.findById(sectionId).populate("subSection");
        return resp.status(200).json({
            success:true,
            message:"Sub Section Updated",
            data:result
        })
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"ERROR while Updating SUBSECTION:"+err.message
        })
    }
}
exports.deleteSubSection=async(req,resp)=>{
    // try{
    //     const {sectionId,subSectionId}=req.body;
    //     const deletedSubSection=await SubSection.findByIdAndDelete(subSectionId);
    //     if(!deletedSubSection){
    //         resp.status(401).json({
    //             success:false,
    //             message:"Subsection Not Found:"
    //         })
    //     }
    //     const updatedSection=await Section.findByIdAndUpdate(sectionId,
    //         {$pull:{subSection:deletedSubSection._id}},{new:true}
    //     ).exec();
    //     const newSection=await Section.findById(sectionId).populate("subSection");
    //     return resp.status(200).json({
    //         success:true,
    //         data:newSection,            
    //         message:"Sub Section Deleted"
    //     })
    // }
    // catch(err){
    //     resp.status(500).json({
    //         success:false,
    //         message:"ERROR while Deleting SUBSECTION:"+err.message
    //     })
    // }

    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subSection: subSectionId,
            },
          }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
            return resp.status(404).json({
                success: false, 
                message: "SubSection not found" 
            })
        }
        const updatedSection=await Section.findById(sectionId).populate("subSection");
        // const updatedSection = await Section.findById(sectionId).populate("subSection")
    
        return resp.json({
          success: true,
          data:updatedSection,
          message: "SubSection deleted successfully",
        })
      } catch (error) {
        console.error(error)
        return resp.status(500).json({
          success: false,
          message: "An error occurred while deleting the SubSection",
        })
      }
}