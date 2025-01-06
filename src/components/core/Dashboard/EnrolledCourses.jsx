import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses=()=>{
    const {token}=useSelector(state=>state.auth);
    const [enrolledCourses,setEnrolledCourses]=useState(null);
    const [percentage,setPercentage]=useState([]);
    const navigate=useNavigate();
    const getEnrolledCourses=async()=>{
        try{
            const response=await getUserEnrolledCourses(token);
            console.log("ENROLLED COURSE PAGE--",response);
            setEnrolledCourses(response.courses)
            setPercentage(response.arr);
        }
        catch(err){
            console.log("ERROR while fetching all Enrolled courses",err.message)
        }
    }
    useEffect(()=>{
        getEnrolledCourses();
    },[])
    return (
        <div className="">
            {
                !enrolledCourses ? (<div>Loading...</div>) : 
                (
                    enrolledCourses.length==0?(<div>You have Not Enrolled in any course</div>)
                    :(
                        <div className="w-[800px] mt-4">
                            <p className="text-[25px]">Enrolled Courses</p>
                            <div className="px-2 py-3 flex bg-richblack-400 font-bold justify-between" style={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}}>
                                <p>Course Name</p>
                                <p>Duration</p>
                                <p>Progress</p>
                            </div>
                            {
                                enrolledCourses.map((course,i)=>(
                                    <div>
                                        <div className="flex justify-between border border-richblack-400 px-2 py-2 "
                                        onClick={()=>navigate(`/view-course/${course?._id}/section/${course?.courseContent?.[0]?._id}/sub-section/${course?.courseContent?.[0]?.subSection?.[0]?._id}`)}>

                                            <div className="flex gap-x-2 items-center cursor-pointer">
                                                <img src={course.thumbnail} className="w-[130px] h-[90px] object-cover rounded-md"/>
                                                <div className="flex flex-col">
                                                    <p>{course.courseName}</p>
                                                    <p>{course.courseDescription}</p>
                                                </div>
                                            </div>
                                            <p>{course?.timeDuration}</p>
                                            <div>
                                                {/* <p>Progress:{course.progressPercentage||0}%</p> */}
                                                <p>Progress:{percentage[i]||0}%</p>
                                                <ProgressBar 
                                                    completed={percentage[i]||0}
                                                    height="8px"
                                                    isLabelVisible={false}
                                                />
                                                {/* <div>Progress BAR</div> */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                )

            }
        </div>
    )
}
export default EnrolledCourses;