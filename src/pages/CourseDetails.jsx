import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/paymentAPI";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import RatingStars from "../components/common/RatingStars";
import { MdLanguage } from "react-icons/md";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { formatDate } from "../services/formatDate";
import { FaShareSquare } from "react-icons/fa";
import Section from "../components/core/Course/Section";
import { IoMdArrowDropright } from "react-icons/io";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { addToCart } from "../slices/cartSlice";
import ReactStars from "react-stars";
const CourseDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const { courseId } = useParams();
    const { loading } = useSelector(state => state.profile);
    const { paymentLoading } = useSelector(state => state.course);
    const [courseData, setCourseData] = useState();
    const [timeDuration,setTimeDuration]=useState("");
    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                console.log()
                setTimeDuration(result.totalDuration);
                setCourseData(result.courseDetails);
                // console.log("IN FRONTEND API DATA",result);

            }
            catch (err) {
                console.log("ERROR In Fetching Course Data", err)
            }
        }
        getCourseDetails();
    }, [courseId])

    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [totalNoOfLecture, setTotalNoOfLecture] = useState(0);
    useEffect(() => {
        console.log("IN FRONTEND", courseData);
        const count = GetAvgRating(courseData?.ratingAndReviews);
        setAvgReviewCount(count);

        let lectures = 0;
        if (courseData?.courseContent) {
            for (let section of courseData?.courseContent)
                lectures += section.subSection.length || 0;
        }
        setTotalNoOfLecture(lectures);

    }, [courseData])

    const [modalData, setModalData] = useState("");
    const [expandAll,setExpandAll]=useState(false);
    // const [collapseAll,setCollapseAll]=useState(false);

    const handleBuyCourse = () => {
        // We only want the Login IN user to buy our Course SO we are checking token
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setModalData({
            text1: "You Are Not Logged In",
            text2: "Please Login To Purchase Course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setModalData(null)
        })
    }
    const handleAddToCart=()=>{
        if(user&& user?.accountType==="Instructor"){
            toast.error("You Are an Instructor,You Cant Buy a Course");
            return;
        }
        if(token){
            dispatch(addToCart(courseData));
            return;
        }
        setModalData({
            text1: "You Are Not Logged In",
            text2: "Please Login To Add To Cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setModalData(null)
        })
    }
    const handleShare=()=>{
        copy(window.location.href);
        toast.success("Link Copied");
    }
    if (loading || paymentLoading || !courseData) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <div className="text-white min-h-screen">
                <div className="relative bg-richblack-800 pt-10 pb-16 ">
                    <div className="ml-[20%]">
                        <p>{courseData.courseName}</p>
                        <p>{courseData.courseDescription}</p>
                        <div className="flex gap-x-2">
                            <span>{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} />
                            <span>{`(${courseData?.ratingAndReviews?.length} reviews)`}</span>
                            <span>{`(${courseData?.studentEnrolled?.length} student Enrolled)`}</span>
                        </div>
                        <div>
                            <p>Created At {formatDate(courseData?.createdAt)}</p>
                            <div className="flex gap-x-1 items-center">
                                <MdLanguage/>
                                <p>English</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col absolute left-[65%] top-[20%] bg-richblack-700 
                    border border-richblack-900 rounded-lg  px-5 pt-5 pb-10">
                        <img src={courseData.thumbnail} className="w-[300px]"/>
                        {
                            (!user || !courseData?.studentEnrolled?.includes(user._id))&&
                            <p className="font-bold text-[20px] mt-2">₹{courseData.price}</p>
                        }
                        
                        <button className="bg-yellow-50 text-black rounded-md py-1 px-2 font-bold my-3" 
                        onClick={user && courseData?.studentEnrolled?.includes(user._id)
                        ?()=>navigate("/dashboard/enrolled-courses") :handleBuyCourse}>
                        {user && courseData?.studentEnrolled?.includes(user._id)?"Go To Course":"Buy Now"}
                        </button>
                        {
                            (!user || !courseData?.studentEnrolled?.includes(user._id))&&
                            <button className="bg-richblack-800 rounded-md py-1 px-2 font-bold"
                            onClick={handleAddToCart}>Add To Cart</button>

                        }
                        
                        <p className="text-center my-3 text-richblack-50">30 Days Money Back garuntee</p>
                        <p className="text-[20px] font-semibold">This Course includes</p>
                        <div className="flex flex-col gap-y-1 mt-2 justify-center text-caribbeangreen-200 font-medium">
                            {
                                courseData?.instructions?.map((item,ind)=>(
                                    <div className="flex" key={ind}>
                                        <IoMdArrowDropright/>
                                        <p>{item}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex justify-center items-center gap-x-1 mt-1 text-yellow-200 cursor-pointer">
                            <FaShareSquare/>
                            <p onClick={handleShare}>Share</p>
                        </div>
                    </div>
                </div>
                <div className="mt-7  ml-[20%] max-w-[42%] pb-6">
                    <div className="pl-4 py-4 bg-richblack-900
                    border border-richblack-500">
                        <p className="font-bold text-[25px]">What You will Learn</p>
                        <p className="text-richblack-50">{courseData.whatYouWillLearn}</p>
                    </div>
                    <div className="font-bold text-[25px] mt-3">Course Content</div>
                    <div className="flex justify-between mb-3">
                        <div className="text-richblack-50">
                        {`${courseData?.courseContent?.length} section(s) ${totalNoOfLecture} lecture(s) ${timeDuration} Total Length`}</div>
                    
                        <button className="text-yellow-50" 
                        onClick={()=>setExpandAll(prev=>!prev)}>{expandAll?"Collapse":"Expand"} all sections</button>
                    </div>
                    <div>
                        {
                            courseData?.courseContent?.map((section) => (
                                <Section section={section} expandAll={expandAll}/>
                            ))
                        }
                    </div>
                    <p className="font-bold text-[30px] mt-4">Author</p>
                    <div className="flex items-center gap-x-2">
                        <img src={courseData.instructor.image} className="w-[50px] h-[50px] rounded-full"/>    
                        <p>{`${courseData.instructor.firstName} ${courseData.instructor.lastName}`}</p>
                    </div>
                    <div>
                        <h1 className="text-[25px] font-bold mt-5">Review From Learners</h1>
                        <div className="flex flex-col gap-y-4">
                            {
                                courseData.ratingAndReviews&&
                                courseData.ratingAndReviews.map((data,ind)=>(
                                    <div key={ind} className="flex bg-richblack-700 p-3 rounded-md items-center gap-x-4">
                                        <img src={data?.user?.image} className="w-[100px] h-[100px] rounded-full object-cover"/>
                                        <div className="flex flex-col">
                                            <p className="font-semibold">{`${data?.user?.firstName} ${data?.user?.lastName}`}</p>
                                            <ReactStars
                                                count={5}
                                                edit={false}
                                                value={data.rating}
                                                size={24}
                                            />
                                            {/* <p>Rating:<span className="text-yellow-50 text-[17px] font-semibold"> {}⭐</span></p> */}
                                            <p>{`Review: ${data.review}`}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
               
            </div>
            {modalData && <ConfirmationModal modalData={modalData} />}
        </div>
    )
}
export default CourseDetails;