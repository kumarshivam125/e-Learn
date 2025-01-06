const Course=require('../models/Course');
const Section=require('../models/Section');
const SubSection=require('../models/SubSection');

exports.createSection=async(req,resp)=>{
    try{
        //fetch data
        const {sectionName,courseId}=req.body;
        
        // validate data
        if(!sectionName || !courseId){
            return resp.status(401).json({
                success:false,
                message:"Fill all the Fields"
            })
        }
        // make section
        const newSection= await Section.create({sectionName});

        //add sectionID to course 
        const updatedCourse=await Course.findByIdAndUpdate(courseId,
            {$push:{courseContent:newSection._id}},{new:true})
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        });


        return resp.status(200).json({
            success:true,
            updatedCourse,
            message:"Section Created"
        })
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Something went Wrong while creating Section"+err.message
        })
    }
}
exports.updateSection=async(req,resp)=>{
    try{
        const {sectionId,sectionName,courseId}=req.body;
        if(!sectionId || !sectionName){
            return resp.status(500).json({
                success:false,
                message:"Enter ALL Fields"
            })
        }
        const updatedSection=await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});

        const course=await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        return resp.status(200).json({
            success:true,
            message:"Section UPDATED",
            data:course
        })
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Error while UPDATING Section"+err.message
        })
    }
}
exports.deleteSection=async(req,resp)=>{
    try{
        // //Assumming we are sending ID in params
        // // const {sectionId}=req.params;

        // // const {courseId}=req.body;
        // const {sectionId,courseId}=req.body;
        // // console.log("IN CONTROLLER",sectionId,courseId);

        // // const deletedSection=await Section.deleteOne({_id:sectionId}); //Can use this also
        // const section=await Section.findById(sectionId);
        // if(!section){
        //     return resp.status(401).json({
        //         success:false,
        //         message:"Section Not Found"
        //     })
        // }
        // // for(let subSecId in section.subSection){
        // //     await SubSection.findByIdAndDelete(subSecId);
        // // }
        // await SubSection.deleteMany({_id: {$in: section.subSection}});
        // const deletedSection=await Section.findByIdAndDelete(sectionId); 
        
        // //TODO:Do We need to delete Section from course Schema ?? 
        // // I DID BELOw he will explain later 
        // let updatedCourse=await Course.findByIdAndUpdate(courseId,{$pull:{courseContent:deletedSection._id}});
        
        // updatedCourse=await Course.findById(courseId)
        // .populate({
        //     path:"courseContent",
        //     populate:{
        //         path:"subSection"
        //     }
        // });
        const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return resp.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId)
        .populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		});
		// .exec();

		resp.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});


        // return resp.status(200).json({
        //     success:true,
        //     message:"Section DELETED",
        //     data:updatedCourse,
        // })
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Something went Wrong while DELETING Section "+err.message
        })
    }
}
