import { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import { VscDashboard, VscSignOut } from "react-icons/vsc"
const ProfileDropDown=()=>{
    const [isVisible,setIsVisible]=useState(false);
    const menuRef=useRef(null);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {user}=useSelector(state=>state.profile);
   

    useEffect(()=>{
        const handler=(myevent)=>{
            if(menuRef.current && !menuRef.current.contains(myevent.target))
                setIsVisible(false);
        }

        document.addEventListener("mousedown",handler);
        return ()=>{
            document.removeEventListener("mousedown",handler);
        }
    },[])
    if (!user) return null
    return(
        <div>
            <button className="bg-white text-black font-bold text-[20px] rounded-full relative   
            " onClick={()=>setIsVisible(!isVisible)}>
                <img src={user?.image} alt={`profile-${user?.firstName}`}
                className="aspect-square w-[30px] rounded-full object-cover" />
            </button>
            {
                isVisible && (
                    <div className="absolute top-[80%] right-[1%] bg-richblack-5 text-black mt-6 p-2   
                    rounded-lg flex flex-col gap-y-4" ref={menuRef}>
                        <div className="flex items-center">
                            <VscSignOut className="font-bold " size={"30px"}/> 
                            <p className="px-3 py-1 font-bold  
                            hover:bg-richblack-25 rounded-lg" onClick={()=>dispatch(logout(navigate))}>
                            Logout
                            </p>
                        </div>
                        <div className="flex items-center">
                            <VscDashboard className="font-bold " size={"30px"}/> 
                            <Link to="/dashboard/my-profile"> 
                            <p className="px-3 py-1 font-bold hover:bg-richblack-25 rounded-lg">Profile</p>
                            </Link>
                        </div>
                            {/* <p className="px-3 py-1 hover:bg-richblack-25 rounded-lg ">Profile</p>  */}
                        {/* <VscDashboard/> */}
                    </div>
                )
            }
        </div>
    );
}
export default ProfileDropDown;