import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import RenderSteps from "../AddCourse/RenderSteps";
import { useEffect } from "react";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
export default function EditCourse(){
    const {courseId}=useParams();
    const { token } = useSelector(state => state.auth);
    const { course } = useSelector(state => state.course);
    const [loading, setLoading] = useState(false);
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllCourseDetails=async()=>{
            setLoading(true);
            const result=await getFullDetailsOfCourse(courseId,token);
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));
            }
            setLoading(false);
        }
        fetchAllCourseDetails();
    },[])
    if(loading){
        return(
            <div>LOADING...</div>
        )
    }
    return(
        <div >
            <h1>Edit Course</h1>
            {/* <div> */}
                {
                    course?<RenderSteps/>:<div>Course Not Found</div>
                }
            {/* </div> */}
        </div>
    )
}