import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import CourseTable from "./InstructorCourses/CourseTable";
export default function MyCourses(){
    const {token}=useSelector(state=>state.auth);
    const navigate=useNavigate();
    const [courses,setCourses]=useState([]);
    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token);
            setCourses(result);
        }
        fetchCourses();
    },[])
    return(
        <div className="mt-8">
            <div className="flex justify-between mb-5">
                <h1>My Courses</h1>
                <button onClick={()=>navigate("/dashboard/add-course")}
                className="bg-yellow-50 px-3 py-2 text-black rounded-md font-semibold ">Add Course</button>
            </div>
            {courses&&<CourseTable courses={courses} setCourses={setCourses}/>}
        </div>
    )
}