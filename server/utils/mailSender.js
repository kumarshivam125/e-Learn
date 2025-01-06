const nodemailer=require('nodemailer');
require('dotenv').config();
const mailSender=async(email,title,body)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });
        const result=await transporter.sendMail({
            from:"e-Learn By SHIVAM",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(result);
        return result;//HE didnt told why we are writing this
    }
    catch(err){
        console.log("ERROR While Sending Mail:",err);
    }
}
module.exports=mailSender;