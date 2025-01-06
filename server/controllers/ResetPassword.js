const User=require('../models/User');
const mailSender=require('../utils/mailSender');
const bcrypt=require('bcrypt');
const crypto=require('crypto');

// "ResetPassword" is used when USer forgot his password and want to set a new password
// resetpasswordToken
exports.resetPasswordToken=async(req,resp)=>{
    try{
        //get email from req body
        const email=req.body.email;

        // check user exist or not 
        const user=await User.findOne({email});
        if(!user){
            resp.status(401).json({
                success:false,
                message:"You Are not registered With US"
            })
        }   
        
        // const newToken=crypto.randomUUID();
        
        //NEw Added
        //generate TOKEN
        const newToken = crypto.randomBytes(20).toString("hex");

        // Update User By adding TOKEN and EXPIRATION TIME 
        const updatedDetails=await User.findOneAndUpdate({email:email},
            {
                token:newToken,
                resetPasswordExpires:new Date(Date.now()+15*60*1000) //Setting 15 Min as expiration Time
            },
            {new:true}
        )
        
        // generate URL This is the link of FRONTEND
        const url=`http://localhost:3000/update-password/${newToken}`;
        // Send Mail having URL
        await mailSender(email,"Password Reset Link",`Reset Link:${url}`)
        
        // Return RESPONSE
        return resp.status(200).json({
            success:true,
            message:"Email Sent For RESET PASSWORD Successfully!!"
        })
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Soemthing went wrong while Resseting the Password:"+err.message
        })
    }
}

// resetPassword
exports.resetPassword=async(req,resp)=>{
    try{
        //data fetch
        const {password,confirmPassword,token}=req.body;
        //validation 
        if(password!==confirmPassword){
            return resp.status(401).json({
                success:false,
                message:"Password not Matching"
            })
        }
        const userDetails=await User.findOne({token:token});
        // if No user -TOKEN Invalid
        if(!userDetails){
            return resp.status(401).json({
                success:false,
                message:"TOKEN is Invalid"
            }) 
        }
        //Check token expired
        if(userDetails.resetPasswordExpires < Date.now()){
            return resp.status(401).json({
                success:false,
                message:"TOKEN Expired, Regenerate TOKEN again"
            }) 
        }
        
        // hash password
        const hashedPassword=await bcrypt.hash(password,10);
        
        // password update 
        //VVIMP IN below line initally i was using findByIdAndUpdate() 
        //BUT U are finding BY TOKEN BUt function name is findByIdAndUpdate() 
        //so in that ONLY Id can be used 
        const updatedDetails=await User.findOneAndUpdate(
            {token:token},//this shows hat find the document based on "token"
            {password:hashedPassword},
            {new:true}
        );

        // reutrn response
        return resp.status(200).json({
            success:true,
            message:"Password Reset done"
        }) 
    }
    catch(err){
        return resp.status(500).json({
            success:false,
            message:"Soemthing went wrong while Resseting the Password(resetPassword fun):"+err.message
        })
    }
}