import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';
export const Dashboard = () => {
    const {loading:authLoading}=useSelector(state=>state.auth);
    const {loading:profileLoading}=useSelector(state=>state.profile);
    
    if(authLoading|| profileLoading ){
        return(
            <div className='text-white'>Loading....</div>
        )
    }
    return (
        <div className='text-white flex  '>
            <Sidebar/>
            {/* <div className='min-h-[calc(100vh-3.5rem)]'> */}
            <div className='ml-[30%]'>
                <Outlet/>
            </div>
            {/* </div> */}
        </div>
    )
}

