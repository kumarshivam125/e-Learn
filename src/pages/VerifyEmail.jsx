import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { signUp } from "../services/operations/authAPI";
import {sendOtp} from "../services/operations/authAPI";
const VerifyEmail=()=>{
    const {loading,signupData}=useSelector(state=>state.auth);
    const dispatch=useDispatch();
    const [otp,setOtp]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{
        if(!signupData)
            navigate("/signup");
    },[])
    function submitHandler(e){
        e.preventDefault();
        const { accountType, firstName, lastName, email, password,confirmPassword,}=signupData;
        
        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate));
    }
    return (
        <div className="text-white">   
        {
            loading?(
                <div>Loading...</div>
            ):
            (
                <div>
                    <h1> Verify email </h1>    
                    <p>A verification code has been sent to you. Enter the code below</p>
                    {/* FOR OTP-INPUT FIELD */}
                    <form onSubmit={submitHandler}>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6} 
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} placeholder="-"  
                            className="text-black font-bold bg-richblack-100"
                            />  } //He Told to copy paste this line from "NPMwebsite"
                           
                        />
                        <button>Verify Email</button>
                    </form>
                    <div className="flex">
                        <Link to="/login"> <p>Back to login</p> </Link>
                        <button onClick={()=>dispatch(sendOtp(signupData.email,navigate))}>Resend it</button>
                    </div>
                    
                </div>
            )
        }
        </div>
    );
}
export default VerifyEmail;