const {instance}=require('../config/razorpay');
const Course=require('../models/Course');
const User=require('../models/User');
const mailSender=require('../utils/mailSender');
const {courseEnrollmentEmail}=require('../mail/template/courseEnrollmentEmail');
const {paymentSuccessEmail}=require('../mail/template/paymentSuccessEmail');
const crypto=require('crypto');

const mongoose = require('mongoose');
const CourseProgress = require('../models/CourseProgress');


//Initiate the razorpay Order
exports.capturePayment=async(req,resp)=>{
    const {courses}=req.body;
    const userId=req.user.id;
    if(courses.length==0){
        return resp.status(401).json({
            success:false,
            message:"Please Provide Course Id"
        })
    }
    let totalAmount=0;
    for(const course_id of courses)
    {
        try{
            let course=await Course.findById(course_id);
            if(!course){
                return resp.status(401).json({
                    success:false,
                    message:"Cannot Find the Course"
                })
            }
            const uid=new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return resp.status(401).json({
                    success:false,
                    message:"Student Already Enrolled in Course"
                })
            }
            totalAmount+=course.price;
        }
        catch(err){
            console.log("ERROR IN Capture Payment",err);
            return resp.status(500).json({
                success:false,
                message:"Error in Capture Payment "+err.message
            })
        }
    }

    const options={
        amount:totalAmount*100,
        currency:"INR",
        receipt:Math.random().toString(),
    }
    try{
        const paymentResponse=await instance.orders.create(options);
        return resp.status(200).json({
            success:true,
            message:paymentResponse
        })
    }
    catch(err){
        console.log("ERROR IN Capture Payment",err);
        return resp.status(500).json({
            success:false,
            message:"Could Not Initiate the Order "+err.message
        })
    }
}
//Verify the signature of RazorPay and Server
exports.verifySignature=async(req,resp)=>{
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const razorpay_signature=req.body?.razorpay_signature;
    const courses=req.body?.courses;
    const userId=req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return resp.status(401).json({
            success:false,
            message:"ALL fields are required"
        })
    }
    let body=razorpay_order_id+"|"+razorpay_payment_id;
    const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(body.toString()).digest("hex");

    if(expectedSignature===razorpay_signature){
        //Enroll the Student
        await enrollStudent(courses,userId,resp);
        return resp.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }
    return resp.status(500).json({
        success:false,
        message:"Payment Failed"
    })

}    

const enrollStudent=async(courses,userId,resp)=>{
    for(const courseId of courses){
        try{
            const enrolledCourse=await Course.findByIdAndUpdate(courseId,{$push:{studentEnrolled:userId}},{new:true});
            if(!enrolledCourse)
            {
                return resp.status(500).json({
                    success:false,
                    message:"Course Not Found"
                })
            }
            const courseProgress=await CourseProgress.create({courseID:courseId,userId:userId,completedVideos:[]});

            const enrolledStudent=await User.findByIdAndUpdate(userId,
                {$push:{courses:courseId,courseProgress:courseProgress._id}} ,{new:true});
             
            const mailResponse=await mailSender(enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
            )
            console.log("Course Enrollment Email Sent Successfully",mailResponse);
        }
        catch(err){
            console.log(err);
        }
    }
}

exports.sendPaymentSuccessEmail=async(req,resp)=>{
    const {orderId,paymentId,amount}=req.body;
    const userId=req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return resp.status(401).json({
            success:false,
            message:"ALL fields are required"
        })
    }
    try{
        const enrolledStudent=await User.findById(userId);
        await mailSender(enrolledStudent.email,'Payment Successful',
            paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId)
        )
    }
    catch(err){
        console.log("Error in Sending paymentSuccess Mail",err);
        return resp.status(500).json({
            success:false,
            message:"Error in sending Payment Mail" 
        })
    }
}