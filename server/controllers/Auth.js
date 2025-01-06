const User=require('../models/User');
const OTP=require('../models/OTP');
const optGenerator=require('otp-generator');
const bcrypt=require('bcrypt');
const Profile=require('../models/Profile');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const {passwordUpdated}=require('../mail/template/passwordUpdate');
const mailSender = require('../utils/mailSender');

//sendOTP
exports.sendotp=async(req,resp)=>{
    try{
        const {email}=req.body;
        // Check if user already present
        const checkUserPresent=await User.findOne({email});
        
        //If already exist then return error bCZ SendOTP We are using for making new account
        if(checkUserPresent){
            return resp.status(401).json({
                success:false,
                message:"USER Already Exist"
            })
        }
        //6 in below line is length
        let otp=optGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("OTP Generated:",otp);

        // Check OTP is unique or not
        let result=await OTP.findOne({otp:otp});
        // Jab tak Generated OTP is already used until then 
        // generate a OTP
        while(result)
        {
            otp=optGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result=await OTP.findOne({otp:otp});
        }
        //In Below line when we are "creating new OTP Object" then automatically
        // "Pre middleware" in OTP Schema file gets fired so same OTP is sent to
        //ON email and from below line it gets stored in DB.
        // SO in Signup we are checking the OTP sent from UI and what we stored in DB

        const otpBody=await OTP.create({email,otp});
        console.log("Generated OTP:",otpBody);

        resp.status(200).json({
            success:true,
            message:"OTP Sent Successfully",
            otp
        })
    }
    catch(err){
        console.log("Error in OTP Generation",err.message);
        resp.status(500).json({
            success:false,
            message:"Error in OTP Generation:"+err.message
        })
    }
}

//SignUp
exports.signup=async(req,resp)=>{
    try{
        // validate the reqest data
        const {firstName,lastName,email,
            password,confirmPassword,accountType,otp,contactNumber }=req.body;
        if(!firstName||!lastName||!email||
            !password|| !confirmPassword||!otp)
            return resp.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        
        //2 password match karo
        if(password!==confirmPassword)
            return resp.status(400).json({
                success:false,
                message:"Password and confirmPassword dont match!!"
            })
        
        // check user already exist
        // While creating OTP We already checked this 
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent)
        {
            return resp.status(400).json({
                success:false,
                message:"USER Already Exist"
            })
        }

        // fetch most resent OTP from DB
        const recentOpt=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOpt.length==0)
        {
            return resp.status(400).json({
                success:false,
                message:'OTP Not Found'
            })
        }
        // match both OTP
        //HE Wrote recentOpt[0] in his "SHARED" code 
        else if(otp!=recentOpt[0].otp){
            //Invalid OTP
            return resp.status(400).json({
                success:false,
                message:'OTP DONT Match'
            })
        }
        // Hash password 
        const hashedPassword=await bcrypt.hash(password,10);
        
        //I dont know what it is doing
        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        // create entry in DB
        const userProfile=await Profile.create({
            contactNumber:null,
            gender:null,
            dateOfBirth:null,
            about:null
        });

        const user=await User.create({
            firstName,lastName,email,
            password:hashedPassword ,accountType,
            additionalDetails: userProfile._id,
            approved: approved,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });
        //return resp
        resp.status(200).json({
            success:true,
            message:"SignUp Success",
            user
        })
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"SignUp Failed:"+err.message
        })
    }
}

// Login
exports.login=async(req,resp)=>{
    try{
        // Fetch the data
        const {email,password}=req.body;
        // validate the data
        if(!email|| !password)
            return resp.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        // IF User Dont exist then send ERROR
        let checkUserExist=await User.findOne({email}).populate("additionalDetails");
        if(!checkUserExist){
            return resp.status(400).json({
                success:false,
                message:"USER DONT Exist"
            })
        }
        // Match Password
        if(await bcrypt.compare(password,checkUserExist.password)){
            // User Exist GENERATE JWT and cookie
            const paylod={
                email:checkUserExist.email,
                id:checkUserExist._id,
                accountType:checkUserExist.accountType
            }
            const token=jwt.sign(paylod,process.env.JWT_SECERET,{expiresIn:"8h"});

            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            checkUserExist=checkUserExist.toObject();
            checkUserExist.password=undefined;
            checkUserExist.token=token;

            resp.cookie("token",token,options).status(200).json({
                success:true,
                message:"Login IN SuccessFully",
                token,
                checkUserExist
            })
        }
        else{   
            return resp.status(500).json({
                success:false,
                message:"Password DONT MATCH"
            })
        }   
    }   
    catch(err){
        resp.status(500).json({
            success:false,
            message:"ERROR IN Login!!:"+err.message
        })
    }
}

//ChangePassword is used to change the current password 
//ChangePassword
exports.changePassword=async(req,resp)=>{
    try{
        // oldpassword ,newpassword,confirmNewPassword,email
        // const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const { oldPassword, newPassword} = req.body;
        const userDetails=await User.findById(req.user.id);
        // if (newPassword !== confirmNewPassword) {
        //     return resp.status(400).json({
        //         success: false,
        //         message: "password & confirm password DONT match",
        //     });
        // }

        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
        // validate the data
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return resp.status(401).json({
                success: false, 
                message:"password is incorrect" 
            });
        }

        // update pasword in DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,{ password: encryptedPassword },{ new: true });
        
        // send updatedpasword mail
        try{
            const emailResponse=await mailSender(updatedUserDetails.email,
                passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse);
        }
        catch(err){
            return resp.status(500).json({
                success: false,
                message: "Error while sending email"+err.message
            });
        }
        // return response
        return resp.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
    }
    catch(err){
        return resp.status(500).json({
			success: false,
			message: "Error while updating password:"+err.message,
		});
    }
}