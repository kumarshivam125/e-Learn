const express=require('express');
const app=express();

//Routes
const courseRoute=require('./routes/Course');
const paymentRoute=require('./routes/Payments');
const profileRoute=require('./routes/Profile');
const userRoute=require('./routes/User');

const cookieParser=require('cookie-parser');
const cors=require('cors');
const expressFileUpload=require('express-fileupload');

//Connections
const dbConnect=require('./config/database');
const {cloudinaryConnect}=require('./config/cloudinary');
require('dotenv').config();
const PORT=process.env.PORT||5000;


dbConnect();
cloudinaryConnect();

// using "body parser" middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:3000", credentials:true }));
app.use(expressFileUpload({ useTempFiles : true, tempFileDir : '/tmp/'}));

//Using Routes
app.use('/api/v1/auth',userRoute);
app.use('/api/v1/profile',profileRoute);
app.use('/api/v1/course',courseRoute);
app.use('/api/v1/payment',paymentRoute);

//default Route
app.get("/",(req,resp)=>{
    resp.status(200).json({
        success:true,
        message:"Your Server is Running...."
    })
    console.log("Your Server is Running....")
})

app.listen(PORT,()=>console.log(`Connection Started at ${PORT}`));