import { useState } from "react"
import { useEffect } from "react"
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { useSelector } from "react-redux";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

export default function Instructor(){
    const [loading,setLoading]=useState();
    const [instructorData,setInstructorData]=useState();
    const [courses,setCourses]=useState([]);
    const {token}=useSelector(state=>state.auth);
    const {user}=useSelector(state=>state.profile);

    useEffect(()=>{
        const getData=async()=>{
            setLoading(true);
            const apiData=await getInstructorData(token);
            const instructorCourses=await fetchInstructorCourses(token);
            console.log(apiData);

            if(apiData.length)
                setInstructorData(apiData);
            
            if(instructorCourses)
                setCourses(instructorCourses);

            setLoading(false);
        }
        getData();
    },[])
    //VVIMP In below line i was not using 0 it was not working
    const totalAmount=instructorData?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
    const totalStudentEnrolled=instructorData?.reduce((acc,curr)=>acc+curr.totalStudentEnrolled,0);
    return(
        <div>
            <div>
                <h1>Hi {user.firstName}</h1>
            </div>
            {
                loading?<div>Loading...</div>:
                (
                    courses.length>0?
                    (
                        <div className="w-[700px]">
                            <div className="flex justify-between">
                                <div className="w-[70%] bg-richblack-700 px-7 py-5">
                                    <InstructorChart courses={instructorData}/>
                                </div>
                                <div className="flex flex-col bg-richblack-700 pl-4 pr-8 py-4 gap-y-4">
                                    <p className="text-[30px] font-bold ">Statistics</p>
                                    <div>
                                        <p>Total Course</p>
                                        <p className="text-[27px] font-bold text-richblack-25">{instructorData.length}</p>
                                    </div>
                                    <div>
                                        <p>Total Students</p>
                                        <p className="text-[27px] font-bold text-richblack-25">{totalStudentEnrolled}</p>
                                    </div>
                                    <div>
                                        <p>Total Income</p>
                                        <p className="text-[27px] font-bold text-richblack-25">Rs.{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* Render 3 courses */}
                                <div className="flex justify-between">
                                    <p>Your Courses</p>
                                    <Link to="/dashboard/my-courses">View All</Link>
                                </div>
                                <div className="flex justify-between ">
                                {
                                    courses.slice(0,3).map((course,ind)=>(
                                        <div>
                                            <img src={course.thumbnail} className="w-[150px] h-[100px]"/>
                                            <div>
                                                <p>{course.courseName}</p>
                                                <div className="flex gap-x-3">
                                                    <p>{course.studentEnrolled.length}</p>
                                                    <p> | </p>
                                                    <p>Rs.{course.price}</p>
                                                </div>
                                            </div>
                                        </div>  
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div>
                            <p>You have Not Created Any Course</p>
                            <Link to="/dashboard/create-course">Create a Course</Link>
                        </div>
                    )
                )
            }
        </div>
    )
}