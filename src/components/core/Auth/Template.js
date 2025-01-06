import frameImage from "../../../assets/Images/frame.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import {FcGoogle} from "react-icons/fc";
const Template=({title,desc1,desc2,formType,image})=>{
    return (
        <div className="flex w-11/12 max-w-[1160px] py-8  mx-auto justify-between gap-y-8 flex-wrap">
            <div className="w-11/12 max-w-[450px]">
                <h1 className="text-white font-semibold text-[1.8rem] leading-[2.3rem]">{title}</h1>
                <p className="text-[1.1rem] leading-[1.6rem] mt-4">
                    <span className="text-white">{desc1}</span> <br/>
                    <span className="text-blue-100 italic">{desc2}</span>
                </p>
                {
                    formType==="signup"? <SignupForm />: <LoginForm />
                }
                <div className="flex items-center w-full">
                    <div className="w-full h-[1px] bg-richblack-700"></div>
                    <p className="text-richblack-700 font-medium leading-[1.37rem]">OR</p>
                    <div className="w-full h-[1px] bg-richblack-700"></div>
                </div>
                <button className="w-full flex justify-center items-center font-medium text-richblack-100
                 border border-richblack-700 rounded-[8px] px-[12px] py-[8px] gap-x-2  mt-6">
                    <FcGoogle/>
                    <p>Sign Up With Google</p>
                </button>
            </div>
            {/* Image Section */}
            <div className="relative w-11/12 max-w-[450px]">
                <img src={frameImage} height={504} width={558} loading="lazy"/>
                <img src={image} height={409} width={558} loading="lazy"
                className="absolute -top-4 right-4" />
            </div>
            
        </div>
    );
}
export default Template;