import { Form, useForm } from "react-hook-form";
import { useDispatch ,useSelector} from "react-redux";
import { useEffect, useState } from "react";
import { resetCourseState, setStep } from "../../../../slices/courseSlice";
import { editCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const PublishCourse=()=>{
    const {register,handleSubmit,setValue,getValues,formState:{errors,}}=useForm();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const { token } = useSelector(state => state.auth);
    const { course } = useSelector(state => state.course);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        if(course?.status==="Published")
            setValue("public",true); 
    },[])
    const goBack=()=>{
        dispatch(setStep(2));
    }
    const goToCourses=()=>{
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    }
    const mySubmit=async()=>{
        // console.log("CAME IN SUBMIT FUN") 
        if(course?.status==="Published" && getValues("public")===true||
        course?.status==="Draft" && getValues("public")===false)
        {
            //NO Updation  //NO API CALL
            //so SHOW ALL COURSES
            goToCourses();
            return;
        }
        console.log("CAME BEFORE UPDATE")
        //IF form UPDATED

        const formData=new FormData();
        formData.append("courseId",course._id);
        const courseStatus=getValues("public")?"Published":"Draft";
        formData.append("status",courseStatus);
        setLoading(true);
        const result=await editCourseDetails(formData,token);
        if(result){
            goToCourses();
        }
        setLoading(false);
    }
    return(
        <div className="bg-richblack-800 p-6 rounded-md mt-4">
            <p>Publish Course</p>
            <form onSubmit={handleSubmit(mySubmit)}>
                <div>
                    {/* MIND IN below line {required:true} and "errors" is not written BCZ IF TICK is not selected 
                    then course will be saved as "DRAFT"
                    */}
                    <input type='checkbox' id='public' {...register("public")}
                        className="mr-3"
                    />
                    <label htmlFor="public">Make This Course as Public</label>
                </div>
                <div className="text-black flex justify-end font-semibold gap-x-3 my-3">
                    <button className="bg-richblack-300 px-3 py-2  rounded-md"
                    type="button" onClick={goBack} disabled={loading}>Back</button>
                    <button className="bg-yellow-50 px-3 py-2 rounded-md" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    )
}
export default PublishCourse;