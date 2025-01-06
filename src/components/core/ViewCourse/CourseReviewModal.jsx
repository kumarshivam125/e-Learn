import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createRating } from "../../../services/operations/courseDetailsAPI";

export default function CourseReviewModal({setReviewModal}){
    const {user}=useSelector(state=>state.profile);
    const {register,setValue,handleSubmit,formState:{errors,}}=useForm();
    const {token}=useSelector(state=>state.auth);
    const {courseEntireData}=useSelector(state=>state.viewCourse);

    const ratingChange=(newRating)=>{
        setValue("rating",newRating);
    }
    const mySubmit=async(data)=>{
        setReviewModal(false);
        const resp=await createRating({...data,courseId:courseEntireData._id},token);
        console.log(resp);
    }
    return(
        <div>
            <div className="w-[100vw] h-[100vh] bg-white flex justify-center items-center fixed z-50 top-0 left-0 bg-opacity-35 text-white">
                <div className="w-[500px] h-[300px]">
                    <div className="flex justify-between items-center px-4 py-2 bg-richblack-600">
                        <p className=" text-[25px] font-semibold text-white ">Add Review</p>
                        <RxCross2 onClick={()=>setReviewModal(false)} className="cursor-pointer text-[20px] text-white"/>
                    </div>
                    <div className="bg-richblack-800 px-3 py-3">
                        <div className="flex justify-center items-center gap-x-2">
                            <img src={user.image} className="w-[60px] h-[60px] rounded-full object-cover"/>
                            <div className="flex flex-col">
                                <p className="font-bold">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-richblack-50">Posting Publicly</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(mySubmit)}>
                            <div className="flex justify-center text-richblack-50 ">
                                <ReactStars size={27} onChange={ratingChange}/>
                            </div>
                            <p className="font-bold mt-3 mb-2">Add Your Experience</p>
                            <textarea placeholder="Add Your Experience" rows={3} className="p-3 w-full 
                            rounded-lg bg-richblack-600" {...register("review",{required:true})}/>
                            {errors.courseReview &&<span className="text-pink-200">review is required</span>}
                            <div className="font-bold text-black flex justify-end gap-x-2">
                                <button className="bg-richblack-300 px-3 py-2 rounded-md" type="button"
                                onClick={()=>setReviewModal(false)}>Cancel</button>
                                <button className="bg-yellow-50 px-3 py-2 rounded-md" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}