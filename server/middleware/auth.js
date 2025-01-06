const jwt=require('jsonwebtoken');
require('dotenv').config();

//auth
exports.auth=(req,resp,next)=>{
    try{
        const token=req.body.token||req.header("Authorization")?.replace("Bearer ","")||req.cookies.token;
        // console.log("auth.js(Token Printing)-->",token);
        if(!token){
            return resp.status(401).json({
                success:false,
                message:"TOKEN Missing!!"
            })    
        }
        // Verify TOKEN
        try{
            const paylod=jwt.verify(token,process.env.JWT_SECERET);
            console.log("Decoded PayLoad from TOKEN",paylod);
            req.user=paylod;
        }
        catch(err){
            return resp.status(500).json({
                success:false,
                message:"Token INVALID(auth.js):"+err.message
            })
        }
        next();
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"Something went wrong while Verifyng TOKEN"+err.message
        })
    }
}

// isStudent
exports.isStudent=(req,resp,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            resp.status(401).json({
                success:false,
                message:"This is Protected Route For STUDENT!!"
            })    
        }
        next();
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"User role dont match"
        })
    }
}

// isInstructor
exports.isInstructor=(req,resp,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            resp.status(401).json({
                success:false,
                message:"This is Protected Route For INSTRUCTOR"
            })    
        }
        next();
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"User role dont match"
        })
    }
}

// isAdmin
exports.isAdmin=(req,resp,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            resp.status(401).json({
                success:false,
                message:"This is Protected Route For ADMIN!!"
            })    
        }
        next();
    }
    catch(err){
        resp.status(401).json({
            success:false,
            message:"User role dont match"
        })
    }
}