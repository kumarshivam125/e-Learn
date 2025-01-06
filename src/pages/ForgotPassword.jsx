import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword=()=>{
    const [emailSent,setEmailSent]=useState(false);
    const [email,setEmail]=useState("");
    const {loading}=useSelector(state=>state.auth);
    const dispatch=useDispatch();
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }
    return (
        <div className="text-white">
            {
                loading?(<div>Loading</div>):(
                    <div>
                        <h1>{ !emailSent?"Reset Your Password":"Check Email"} </h1>
                        <p>
                            {
                                !emailSent?
                                "Have no fear. We’ll email you instructions to reset your password.If you dont have access to your email we can try account recovery"
                                :`We have sent the reset email to your email ${email}@gmail.com`
                            }
                        </p>

                        <form onSubmit={submitHandler}> 
                            {
                                !emailSent && (
                                    <div>
                                        <p>Email Address</p>
                                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                                            placeholder="Enter Your Email" name="email" 
                                            className="text-black bg-richblack-100 "
                                        />
                                    </div>
                                )
                            }
                            {
                                <button>{!emailSent?"Reset Password":"Resend Email"}</button>
                            }
                        </form>

                        <div>
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
export default ForgotPassword;