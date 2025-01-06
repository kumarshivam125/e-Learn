import { Link, matchPath, useLocation } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import {FiShoppingCart} from "react-icons/fi";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';

import { IoIosArrowDropdown } from "react-icons/io";
// const arr=[
//     {
//         title:"Python",
//         link:"/catalog/python"
//     },
//     {
//         title:"Java",
//         link:"/catalog/Java"
//     },
//     {
//         title:"Web-development",
//         link:"/catalog/web-development"
//     },
// ];
const Navbar = () => {
    const {token}=useSelector(state=>state.auth);
    const {user}=useSelector(state=>state.profile);
    const {totalItems}=useSelector(state=>state.cart);

    const location=useLocation();
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname);
    }

    const [subLinks,setSubLinks]=useState([]);
    const fetchSublinks=async()=>{
        try{
            const result=await apiConnector("GET",categories.CATEGORIES_API);
            console.log("Printing SubLinks Result:",result);
            setSubLinks(result.data.allCategory);
        }
        catch(err)
        {
            console.log("Could not fetch Category List")
        }
    }
    useEffect(()=>{
        fetchSublinks(); 
    },[])

    return (
        <div className='flex min-h-[5rem] justify-center items-center  border-b  border-b-richblack-700 '>
            <div className="flex w-11/12 max-w-maxContent mx-auto items-center  justify-between  text-richblack-25   py-[20px]
            z-[100] fixed top-0 flex-wrap bg-rich   ">
                <Link to="/">
                    <img src={require('../../assets/Logo/Logo-Full-Light.png')} width={160} height={42} />
                </Link> 
                <nav className='flex gap-x-6'>
                    {
                        NavbarLinks.map((obj,index) => {
                            return <div key={index}>
                                {
                                    obj.title==="Catalog"?(
                                        <div className='flex gap-x-1 cursor-pointer relative group'>
                                            <p>{obj.title}</p> 
                                            <IoIosArrowDropdown size={23} className='group-hover:rotate-180 transition-all duration-200'/>
                                            <div className='absolute invisible  left-[30%] top-[50%] bg-[#fff] 
                                            min-w-[200px]  group-hover:visible  translate-y-[20px] 
                                            flex flex-col text-black transition-all duration-100 rounded-lg font-semibold  text-start
                                            px-5 py-3 text-[20px] text-nowrap catalog_square_div'>
                                                {
                                                    subLinks?.length==0||subLinks==[]?(<div className='text-black '>No courses in catalog</div>):
                                                    (
                                                        subLinks?.map((x,ind)=>(
                                                            <Link key={ind} to={`/catalog/${x.name.split(" ").join("-").toLowerCase()}`} 
                                                            className='p-3 text-black hover:bg-richblack-25 rounded-lg '><p>{x.name}</p></Link>
                                                        ))
                                                    )
                                                }
                                            </div>
                                            {/* SEE APP.CSS instead below i used ::before selctor SAW ON YT */}
                                            {/* <div className='invisible group-hover:visible bg-pure-greys-5 h-[30px] w-[30px] absolute top-0
                                            rotate-45 left-[50%] translate-x-5 translate-y-5  transition-all duration-200 z-[-2]
                                            catalog_square_div'>
                                            </div> */}
                                        </div>
                                    ):
                                    (
                                        <Link to={obj?.path}> <p 
                                        className={`${matchRoute(obj.path)?"text-yellow-25":""}`}>{obj.title}</p></Link>
                                    )
                                }
                            </div>
                        })
                    }
                </nav>
                
                {/* LOGIN /SIGNUP/DASHBOARD */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user&&user?.accountType!="Instructor" && (
                            <Link to="/dashboard/cart" className='relative'>
                                <FiShoppingCart size={"20px"} className='font-bold'/>
                                {
                                    totalItems>0 && (
                                        <span>{totalItems}</span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token==null && (
                            <Link to="/login"><button className='text-white px-5 py-2 rounded-lg bg-richblack-700 border border-richblack-800'>Login</button></Link>
                        )
                    }
                    {
                        token==null && (
                            <Link to="/signup"><button className='text-white px-4 py-2 rounded-lg bg-richblack-700 border border-richblack-800'>Signup</button></Link>
                        )
                    }
                    {
                        token!==null &&  <ProfileDropDown/>
                    }
                </div>
            </div>
        </div>

        // 
    );
}
export default Navbar;