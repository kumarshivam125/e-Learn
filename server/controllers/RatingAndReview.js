const RatingAndReview=require('../models/RatingAndReview');
const User=require('../models/User');
const Course=require('../models/Course');
const mongoose = require('mongoose');

//createRating
exports.createRating=async(req,resp)=>{
    try{
        const userId=req.user.id;
        const {courseId,rating,review}=req.body;
        //check if user is enrolled or not BCZ Only 
        // enrolled student should be able to Give Rating and 
        //review
        
        //This what i wrote
        // const checkUserEnrolled=await Course.findById(courseId).studentEnrolled.includes(userId);
        
        //This is what he wrote
        const checkUserEnrolled=await Course.findOne( 
            {_id:courseId, studentEnrolled:{$elemMatch:{$eq:userId}}} 
        );

        if(!checkUserEnrolled){
            return resp.status(401).json({
                success: false,
                message: "You cant Rate And Review the Course" 
            });
        }
        //Check if user Already Did RatingAndReview Then we wont allow to Do Again
        //BOTH Conditions Should Be Equal
        const checkStudentAlreadyRated=await RatingAndReview.findOne( {user:userId, course:courseId} );
        if(checkStudentAlreadyRated){
            return resp.status(401).json({
                success: false,
                message: "Already Given Review Cant Give Again" 
            });
        }
       
        const newRatingAndReview=await RatingAndReview.create({
            user:userId,
            course:courseId,
            rating,review,
        });
        const updatedCourse=await Course.findByIdAndUpdate(courseId,
            {$push:{ratingAndReviews:newRatingAndReview._id}},{new:true}
        );
        // console.log(updatedCourse);

        return resp.status(200).json({
            success: true,
            message: "Rating and Review Created",
            data:newRatingAndReview
        });
    }   
    catch(err){
        return resp.status(500).json({
            success: false,
            message: "Error while Creating Rating:"+err.message
        });
    }
}

//getAverageRating
exports.getAverageRating=async(req,resp)=>{
    try{

        let courseId=req.body;
        courseId=new mongoose.Schema.Types.ObjectId(courseId);
        const result=await RatingAndReview.aggregate([
            { $match:{course:courseId}},
            { $group:{_id:null,averageRating:{$avg:"$rating"} } }
        ]);

        if(result.length > 0){
            return resp.status(200).json({
                success: true,
                averageRating:result[0].averageRating,
                message: "Average Rating Sent" 
            });
        } 

        //If no rating and Review RETURN 0
        return resp.status(200).json({
            success: true,
            averageRating:0,
            message: "Average Rating is 0,No rating Given Till Now" 
        });
    }
    catch(err){
        return resp.status(401).json({
            success: false,
            message: "You cant Rate And Review the Course" 
        });
    }
}

//getAllRating
//HE Told this is not restricted to one COURSE This will fetch all the reviews from all the 
//course. HE Told that we can also bring the Rating and Reviews OF EACH course 
// INITALLY I was doing that only i Was calling the Reviews for Each Course using course id
// u can see the course id is commented
exports.getAllRating=async(req,resp)=>{
    try{
        // const courseId=req.body;
        const allRatingAndReviews=await RatingAndReview.find().sort({rating:-1})
                                                    .populate({
                                                        path:"user",
                                                        select:"firstName lastName email image"
                                                    })
                                                    .populate({
                                                        path:"course",
                                                        select:"courseName"
                                                    }).exec(); 
        return resp.status(200).json({
            success: true,
            data:allRatingAndReviews, 
            message: "All Rating Review Fetched" 
        });
    }
    catch(err){
        return resp.status(500).json({
            success: false,
            message: "ALL Reviews Cant BE Fetched!!"+err.message 
        });
    }
}
