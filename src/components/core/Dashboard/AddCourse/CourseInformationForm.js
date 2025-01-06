import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import {fetchCourseCategories} from "../../../../services/operations/courseDetailsAPI";

import ChipInput from "./ChipInput";
import RequirementField from "./RequirementField";
import { setStep } from "../../../../slices/courseSlice";
import { setCourse } from "../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { editCourseDetails ,addCourseDetails} from "../../../../services/operations/courseDetailsAPI";
import Upload from "./Upload";
export default function CourseInformationForm(){
    const dispatch=useDispatch();
    const {token} = useSelector((state)=>state.auth);
    const {register,getValues,handleSubmit,setValue,formState:{errors,},}=useForm();
    const {course,editCourse,step}=useSelector(state=>state.course);

    const [loading,setLoading]=useState(false);
    const [categories,setCategories]=useState([]);
    useEffect(()=>{
        const getCategories=async()=>{
            setLoading(true);
            const catego=await fetchCourseCategories();
            setCategories(catego);
            setLoading(false);
        }
        if(editCourse) {
            // SEE THE FIGMA file of this page it have the exactly same properties 
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseCategory", course.category);
            setValue("courseTags", course.tag);
            setValue("courseImage", course.thumbnail);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseRequirements", course.instructions);
        }
        getCategories();
        console.log("ALL Categories---CourseInfoPage--",categories);
    },[])
    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() )
            return true;
        else
            return false;
    }

    //handles next button click 
    const onSubmit = async(data) => {
        if(editCourse) {
            if(isFormUpdated()) 
            {
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }
                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }
                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result) {
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
                console.log("PRINTING FORMDATA", formData);
                console.log("PRINTING result", result);
            } 
            else {
                toast.error("NO Changes made so far");
            }
                        
            return;
        }
        
        //create a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("thumbnailImage", data.courseImage)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("status", "Draft");

        console.log("BEFORE add course API call");
        console.log("PRINTING FORMDATA", formData);
        setLoading(true);
        const result = await addCourseDetails(formData,token);
        if(result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
        console.log("PRINTING FORMDATA", formData);
        console.log("PRINTING result", result);

    }
    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-md border-richblack-700 bg-richblack-800 p-7">
            <div>
                <label htmlFor="courseTitle">Course Title <sup>*</sup> </label>
                <input type="text" id='courseTitle' placeholder="Enter Title" {...register("courseTitle",{required:true})} className="w-full rounded-md p-1 bg-richblack-600"/>
                {
                    errors.courseTitle&& <span className="text-pink-200">Course Title is Required</span>
                }
            </div>       
            <div>
                <label htmlFor="courseShortDesc">Course Short Description <sup>*</sup> </label><br/>
                <textarea rows='5' id='courseShortDesc' {...register("courseShortDesc",{required:true})} placeholder="Enter Short Description" className="w-full rounded-md p-1 bg-richblack-600"/>
                {
                    errors.courseShortDesc&& <span className="text-pink-200">Course Description is Required</span>
                }
            </div>     
            <div>
                <label htmlFor="coursePrice">Price<sup>*</sup> </label>
                <input type='number' id='coursePrice' {...register("coursePrice",{required:true})} placeholder="Enter Price" className="w-full rounded-md p-1 bg-richblack-600"/>
                {
                    errors.coursePrice&& <span className="text-pink-200">Course Price is Required</span>
                }
            </div>    
            <div>
                <label htmlFor="courseCategory">Category<sup>*</sup> </label>
                <select className="w-full rounded-md p-1 bg-richblack-600 " id='courseCategory' {...register("courseCategory",{required:true})}>
                    <option disabled value="">choose a category</option>
                    {
                        !loading && categories.map((cate,ind)=>(
                            <option key={ind} value={cate._id}>{cate.name}</option>
                        ))
                    }
                </select>
                {
                    errors.courseCategory&& <span className="text-pink-200">Course Category is Required</span>
                }
            </div>    
            <ChipInput 
                label="Tags" name="courseTags" placeholder="Enter Tags and Press Enter"
                register={register} errors={errors} setValue={setValue} getValues={getValues}
            />
            <Upload
                label="Course Image" name="courseImage" register={register} errors={errors} 
                setValue={setValue}  editData={editCourse ? course?.thumbnail : null}
            />
            <div>
                <label htmlFor="courseBenefits">Course Benefits<sup>*</sup> </label><br/>
                <textarea rows='5' id='courseBenefits' {...register("courseBenefits",{required:true})} placeholder="Enter Course Benefits" className="w-full rounded-md p-1 bg-richblack-600"/>
                {
                    errors.courseBenefits&& <span className="text-pink-200">Course Benefits is Required</span>
                }
            </div> 
            <RequirementField name="courseRequirements" register={register} errors={errors} 
            placeholder="Enter Requirements Of Course" setValue={setValue} getValues={getValues}/>
            <div className="flex gap-x-2 ">
                {
                    editCourse && 
                    <button onClick={()=>dispatch(setStep(2))} className="bg-richblack-300">Continue Without Saving</button>
                }
                <button className="bg-yellow-50 text-black px-4 py-2 rounded-md 
                font-semibold">{editCourse?"Save Changes":"Next"}</button>
            </div>
        </form>
    )
}