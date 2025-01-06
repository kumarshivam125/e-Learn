import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
// import Sidebar from './Sidebar';
export const MyProfile = () => {
    const { user } = useSelector(state => state.profile);
    const navigate = useNavigate();

    return (
        <div className=' flex flex-col items-center gap-y-7 mx-auto text-richblack-5 mt-3 pb-[300px]'>
            <div className='max-w-[600px] flex flex-col gap-y-6'>
                <h1 className='text-start text-[25px] font-bold'>My Profile</h1>
                <div className='bg-richblack-800  flex justify-between items-center py-[20px] px-[20px] rounded-lg'>
                    <div className='flex items-center gap-x-8'>
                        <img src={user?.image} className='w-[60px] h-[60px] rounded-full object-cover' />
                        <div className='flex flex-col'>
                            <h1 className='font-bold text-[20px]'>{user.firstName} {user.lastName}</h1>
                            <p className='text-richblack-300  '>{user?.email}</p>
                        </div>
                    </div>
                    <div className='bg-yellow-50 flex px-5 py-2 text-black items-center font-bold rounded-md gap-x-2 cursor-pointer '
                    onClick={() => navigate("/dashboard/settings")}>
                        <p>Edit</p>
                        <FiEdit />
                    </div>
                </div>

                <div className='bg-richblack-800 flex justify-between items-center py-[30px] px-[20px] rounded-lg'>
                    <div className='flex flex-col gap-x-8  gap-y-6'>
                        <p className=' font-bold text-[20px]'>About</p>
                        <p className='text-richblack-300 text-[15px]'>
                            { user?.additionalDetails?.about ?? "Write Something About yourself"}
                        </p>
                    </div>
                    <div className='bg-yellow-50 flex px-5 py-2 text-black items-center font-bold rounded-md gap-x-2 cursor-pointer '
                        onClick={() => navigate("/dashboard/settings")}>
                        <p>Edit</p>
                        <FiEdit />
                    </div>
                </div>

                <div className='bg-richblack-800 flex flex-col py-[30px] px-[20px] rounded-lg gap-y-6'>
                    <div className='flex justify-between'>
                        <p className='font-bold text-[20px]'>Personal Details</p>
                        <div className='bg-yellow-50 flex px-5 py-2 text-black items-center font-bold rounded-md gap-x-2 cursor-pointer '
                            onClick={() => navigate("/dashboard/settings")}>
                            <p>Edit</p>
                            <FiEdit />
                        </div>
                    </div>
                    
                    <div className='flex justify-start gap-x-8'>
                        <div className='flex flex-col gap-y-5'>
                            <div>
                                <p className='text-richblack-300'>firstName</p>
                                <p className='font-semibold'>{user?.firstName}</p>
                            </div>
                            <div>
                                <p className='text-richblack-300'>Email</p>
                                <p className='font-semibold'>{user?.email}</p>
                            </div>                    
                            <div>
                                <p className='text-richblack-300'>Gender</p>
                                <p className='font-semibold'>
                                    { user?.additionalDetails?.gender ?? "Add Gender" }
                                </p>
                            </div>                    
                        </div>
                        <div className='flex flex-col gap-y-5'>
                            <div>
                                <p className='text-richblack-300'>lastName</p>
                                <p className='font-semibold'>{user?.lastName}</p>
                            </div>
                            <div>
                                <p className='text-richblack-300'>Contact Number</p>
                                <p className='font-semibold'>
                                    { user?.additionalDetails?.contactNumber ??"Add Number"}
                                </p>
                            </div>                    
                            <div>
                                <p className='text-richblack-300'>Date of Birth</p>
                                <p className='font-semibold'>
                                    { user?.additionalDetails?.dateOfBirth ??"Add DOB"}
                                </p>
                            </div>                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
