import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

export default function ViewCourse(){
    const [reviewModal,setReviewModal]=useState(false);
    const {courseId}=useParams();
    const {token}=useSelector(state=>state.auth);
    const dispatch=useDispatch();
    useEffect(()=>{
        const getCourseSpecificDetails=async()=>{
            const result=await getFullDetailsOfCourse(courseId,token);

            dispatch(setEntireCourseData(result?.courseDetails));
            dispatch(setCourseSectionData(result?.courseDetails?.courseContent));
            
            dispatch(setCompletedLectures(result?.completedVideos));
            let lectures=0;
            result?.courseDetails?.courseContent.forEach(section=>{
                lectures+=section?.subSection.length;
            })
            dispatch(setTotalNoOfLectures(lectures));
        }
        getCourseSpecificDetails();
    },[])
    return(
        <>
            <div>
                <VideoDetailsSidebar setReviewModal={setReviewModal}/>
                <div className="w-[calc(100vw-300px)] ml-[250px]">
                    <Outlet/>
                </div>
            </div>
            {
                reviewModal&& <CourseReviewModal setReviewModal={setReviewModal}/> 
            }
        </>
    )
}