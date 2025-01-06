import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { useSelector } from "react-redux";
// import '~video-react/dist/video-react.css'; 
// import "node_modules/video-react/dist/video-react.css";
import "video-react/dist/video-react.css"; //This is  the correct import for using video-react above both are not working
import { Player } from 'video-react';

import { IoPlay } from "react-icons/io5";
export default function VideoDetails() {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const { token } = useSelector(state => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } = useSelector(state => state.viewCourse);
    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        const setVideoSpecificDetails = async () => {
            // if(courseSectionData.length==0) return;
            if (!courseSectionData.length) return;

            if (!courseId && !sectionId && !subSectionId) navigate("/dashboard/enrolled-courses");
            else {
                console.log("course Section Data:",courseSectionData);
                const filteredData = courseSectionData.filter(section => section._id === sectionId);
                const filteredVideoData = filteredData?.[0]?.subSection?.filter(subSec => subSec._id === subSectionId);
                setVideoData(filteredVideoData?.[0]);
                setVideoEnded(false);
            }

        }
        setVideoSpecificDetails();

    }, [courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        //Agar currentSection 1st section hai AND uska 1st video hai then IT IS 1st VIDEO
        const currentSectionIndex = courseSectionData?.findIndex(sec => sec?._id === sectionId);
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(subSec => subSec?._id === subSectionId);
        if (currentSectionIndex == 0 && currentSubSectionIndex == 0)
            return true;
        else
            return false;
    }
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(sec => sec?._id === sectionId);
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(subSec => subSec?._id === subSectionId);

        const noOfSections = courseSectionData?.length;
        const noOfSubSections = courseSectionData?.[currentSectionIndex]?.subSection?.length;

        if (currentSectionIndex == noOfSections - 1 && currentSubSectionIndex == noOfSubSections - 1)
            return true;
        else
            return false;
    }
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(sec => sec._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(subSec => subSec._id === subSectionId);

        // const noOfSections=courseSectionData.length;
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        if (currentSubSectionIndex === noOfSubSections - 1) {
            navigate(`/view-course/${courseId}/section/${courseSectionData[currentSectionIndex + 1]._id}/sub-section/${courseSectionData[currentSectionIndex + 1].subSection[0]._id}`);
        }
        else
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id}`);
            
            // navigate(`/view-course/${courseId}/section/${sectionId}/sub-section
            // /${courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id}`);
            
            //HE WROTE BELOW THING
            // navigate(`/view-course/${courseId}/section/${sectionId}/sub-section
            // /${courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id}`);
    }
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(sec => sec._id === sectionId);
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(subSec => subSec._id === subSectionId);

        // const noOfSections=courseSectionData.length;

        if (currentSubSectionIndex == 0) {
            const noOfSubSections = courseSectionData[currentSectionIndex - 1].subSection.length;

            navigate(`/view-course/${courseId}/section/${courseSectionData[currentSectionIndex - 1]._id}/sub-section/${courseSectionData[currentSectionIndex - 1].subSection[noOfSubSections - 1]._id}`);
        }
        else
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id}`);
            
            // navigate(`/view-course/${courseId}/section/${sectionId}/sub-section
            // /${courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]}`);
    }
    const handleLectureCompletion = async () => {
        setLoading(true);
        const res = await markLectureAsComplete({ courseId: courseId, subSectionId: subSectionId }, token);
        if (res)
            dispatch(updateCompletedLectures(subSectionId));

        setLoading(false);
    }
    return (
        <div>
            <div className="mt-3">
                {
                    !videoData ? (<div className="text-white">No Data Found</div>)
                        :
                        <Player ref={playerRef}
                            aspectRatio="auto"
                            onEnded={() => setVideoEnded(true)}
                            src={videoData?.videoUrl}
                        >
                            {/* <IoPlay /> */}
                            {
                                videoEnded &&
                                <div>
                                    <div className="flex gap-x-2">
                                        {
                                            !completedLectures.includes(subSectionId) &&
                                            <button onClick={handleLectureCompletion}  className="bg-yellow-50 px-3 py-2 font-semibold
                                            text-black text-[18px] rounded-md">{loading ? "Loading.." : 
                                            "Mark As Completed"}</button>
                                        }
                                        <button onClick={() => {
                                                if (playerRef?.current) {
                                                    playerRef?.current?.seek(0)
                                                    setVideoEnded(false)
                                                }
                                            }} className="bg-yellow-50 px-4 py-2 font-semibold text-black text-[18px]
                                            rounded-md">Rewatch
                                        </button>
                                    </div>
                                    <div className="flex gap-x-2 mt-2">
                                        {
                                            !isFirstVideo() && <button onClick={goToPrevVideo}
                                            className="bg-yellow-50 px-4 py-2 font-semibold text-black text-[18px]
                                            rounded-md">Prev</button>
                                        }
                                        {
                                            !isLastVideo() && <button onClick={goToNextVideo}
                                            className="bg-yellow-50 px-4 py-2 font-semibold text-black text-[18px]
                                            rounded-md">Next</button>
                                        }
                                    </div>
                                </div>
                            }
                        </Player>
                }
            </div>
            <h1 className="mt-24 text-white text-[30px] font-bold">{videoData?.title}</h1>
            <div className="text-white text-[20px]">{videoData?.description}</div>
        </div>
    )
}


