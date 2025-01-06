const mongoose=require('mongoose');
require('dotenv').config();
const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("DB Connection Done\n"))
    .catch((err)=>{
        console.log("ERROR In DB Connection:",err.message);
        process.exit(1);
    })
};
module.exports=dbConnect;