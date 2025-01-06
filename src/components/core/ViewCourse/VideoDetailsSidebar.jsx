import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
export default function VideoDetailsSidebar({setReviewModal}){
    const [sectionActive,setSectionActive]=useState("");
    const [videoActive,setVideoActive]=useState("");
    const navigate=useNavigate();
    const location=useLocation();
    const {sectionId,subSectionId}=useParams();
    const {courseSectionData, courseEntireData,
        completedLectures,totalNoOfLectures}=useSelector(state=>state.viewCourse);
    
    useEffect(()=>{
        const setActiveFlags=()=>{
            if(!courseSectionData.length)
                return;

            const currentSectionIndex=courseSectionData?.findIndex(data=>data._id===sectionId);
            const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.
                subSection?.findIndex(data=>data._id===subSectionId);
            
            const activeSubSectionId=courseSectionData?.[currentSectionIndex]?.subSection[currentSubSectionIndex]?._id;
            setSectionActive(courseSectionData?.[currentSectionIndex]?._id)
            setVideoActive(activeSubSectionId);
        }
        setActiveFlags();
    },[courseSectionData,courseEntireData,location.pathname])
    return(
        <div className="bg-richblack-800 w-[230px] h-[100vh] fixed text-white">
            <div className="flex flex-col">
                <div className="flex justify-between mt-3 items-center px-3">
                    <p className="text-[30px] text-richblack-100 cursor-pointer"
                    onClick={()=>navigate("/dashboard/enrolled-courses")}> <IoIosArrowDropleftCircle/> </p>
                    <button className="bg-yellow-50 px-3 py-2 text-black font-semibold
                    rounded-md" onClick={()=>setReviewModal(true)}>Add Review</button>
                </div>
                <p className="text-[20px] mt-3 font-bold mb-2 px-3">{courseEntireData?.courseName}</p>
                <p className="px-3 text-[16px]">{completedLectures?.length}/{totalNoOfLectures}</p>
                <div className="px-3 mb-2">
                    <hr/>
                </div>
                {
                    courseSectionData.map((sec,ind)=>(
                        <>
                            <div className={`bg-richblack-400 px-5 flex justify-between items-center cursor-pointer`} key={ind}
                            onClick={()=>setSectionActive(sec?._id)}>
                                <div className="font-medium text-[20px]">{sec.sectionName}</div>
                                <IoIosArrowDown className={`${sec._id==sectionActive ?"rotate-180":""}`}/>
                            </div>
                            <div>
                                {
                                    sec?._id==sectionActive&&
                                    sec.subSection.map((vid,ind)=>(
                                        <div className={`${videoActive===vid._id?"bg-yellow-50" :"bg-richblack-700"} px-5 flex 
                                        gap-x-2 items-center cursor-pointer`} key={ind}
                                        onClick={()=>{
                                            setVideoActive(vid._id)
                                            navigate(`/view-course/${courseEntireData?._id}/section/${sec?._id}/sub-section/${vid?._id}`)
                                        }}>
                                            <input type="checkbox" checked={completedLectures?.includes(vid?._id)}/>
                                            <div className="font-medium text-[20px]">{vid.title}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}