const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate=require('../mail/template/emailVerificationTemplate');

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:30*60
    },
    otp:{
        type:String,
        required:true
    }
});
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"Verification Email",emailTemplate(otp) );
        // console.log("Email sent:",mailResponse.response);
    }
    catch(err){
        console.log("ERROR Occured while sending OTP:",err.message);
    }
}
// Below "next" is middleware
OTPSchema.pre('save',async function(next){
    console.log("New document saved to database");
    
    // Only send an email when a new document is created
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})
const OTPModel=mongoose.model('OTP',OTPSchema);
module.exports=OTPModel;
