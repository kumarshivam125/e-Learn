import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {VscSignOut} from "react-icons/vsc";
import { ConfirmationModal } from "../../common/ConfirmationModal";

const Sidebar=()=>{
    const {user,loading:profileLoading}=useSelector(state=>state.profile);
    const {loading:authLoading}=useSelector(state=>state.auth);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [confirmationModal,setConfirmationModal]=useState(null);

    if(authLoading|| profileLoading ){
        return(
            <div className='text-white'>Loading....</div>
        )
    }
    //VVIMP when i am writing this line here then it is not working
    // const [confirmationModal,setConfirmationModal]=useState(null);
    return (
        <div>
            <div>
                <div className="h-[calc(100vh-3.5rem)] border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10
                flex flex-col w-[200px] fixed">
                    <SidebarLink 
                        link={{name:"My Profile",path:"/dashboard/my-profile",icon:"VscAccount"}}
                    />
                    {
                        sidebarLinks.map(obj=>{
                            if(user.accountType!==obj.type) return null
                            return <SidebarLink key={obj.id} link={obj} /> 
                        })
                    }
                    <div className="w-11/12 h-[1px] bg-richblack-700 my-4 mx-auto "></div>
                
                    <div className="flex flex-col gap-y-4 items-start pl-[20px]">
                        <div className="w-[110%] ml-[-20px] ">
                            <SidebarLink 
                                link={{name:"Setting",path:"dashboard/settings",icon:"VscSettingsGear"}}
                            />
                        </div>
                        <button onClick={()=>setConfirmationModal({
                                text1:"Are You Sure",
                                text2:"You Will be Logged Out",
                                btn1Text:"LogOut",
                                btn2Text:"Cancel",
                                btn1Handler:()=>dispatch(logout(navigate)),
                                btn2Handler:()=>setConfirmationModal(null)
                            })}>
                            <div className="flex gap-x-3 items-center">
                                <VscSignOut/>
                                <p>Log Out</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {
                    confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
                }                
            </div>
        
        </div>
    );
}
export default Sidebar;