import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {resetPassword} from "../services/operations/authAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const UpdatePassword=()=>{
    const {loading}=useSelector(state=>state.auth);
    
    const [showPassword1,setShowPassword1]=useState(false);
    const [showPassword2,setShowPassword2]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();

    const [formData,setFormData]=useState({
        password:"",confirmPassword:""
    })
    function changeHandler(e){
        setFormData(prev=>( { ...prev, [e.target.name]:e.target.value} ) )
    }
    function submitHandler(e){
        e.preventDefault();
        const token=location.pathname.split("/").at(-1);
        dispatch(resetPassword(formData.password,formData.confirmPassword,token,navigate));    
    }
    return(
        <div className="text-white">
            {   
                loading?(
                    <div>Loading....</div>
                ):(
                    <div>
                        <h1>Choose  new password</h1>
                        <p>Almost done. Enter your new password and youre all set.</p>

                        <form onSubmit={submitHandler}>
                            <p>New Password</p>
                            <input value={formData.password} onChange={changeHandler}
                                type={showPassword1?"text":"password"} 
                                name="password"
                               required className="text-black bg-richblack-100 "
                            />
                            <div onClick={()=>setShowPassword1(prev=>!prev)}> 
                            {
                                showPassword1?<FaRegEyeSlash/>:<FaRegEye />
                            } 
                            </div>

                            <p>Confirm new password</p>
                            <input value={formData.confirmPassword} onChange={changeHandler}
                                type={showPassword2?"text":"password"} name="confirmPassword"
                               required className="text-black bg-richblack-100 "
                            />
                            <div onClick={()=>setShowPassword2(prev=>!prev)}> 
                            {
                                showPassword2?<FaRegEyeSlash/>:<FaRegEye />
                            } 
                            </div>
                            <button>Reset Password</button>
                            <Link to="/login"> <p>Back to login</p> </Link>
                        </form>
                    </div>
                )
            }
        </div>
    );
}
export default UpdatePassword;