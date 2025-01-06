import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import NestedView from "./NestedView";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI";
export default function BuilderForm(){
    const {register,handleSubmit,setValue,formState:{errors,}}=useForm();
    const {token}=useSelector(state=>state.auth);
    //We are using editSectionName to store the id of section
    const [editSectionName,setEditSectionName]=useState(null);
    const {course}=useSelector(state=>state.course);
    const dispatch=useDispatch();
    const [loading,setLoading]=useState(false);
    const cancelEdit=()=>{
        setEditSectionName(null);
        setValue("sectionName","");
    }
    const goBack=()=>{
        dispatch(setEditCourse(true));
        dispatch(setStep(1));        
    }
    const goNext=()=>{
        if(course.courseContent?.length===0)
        {
            toast.error("Please Add Atleast One Section");
            return;
        }
        if(course.courseContent.some(sec=>sec.subSection?.length==0))
        {
            toast.error("Please Add Atleast One Lecture in Each Section");
            return;
        }
        dispatch(setStep(3));        
    }
    const handleEditSectionName=(sectionId,sectionName)=>{
        if(editSectionName==sectionId) {
            cancelEdit();
            return 
        }

        setEditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }
    const mySubmit=async(data)=>{
        let result;
        console.log("HELLEO BEFORE");
        setLoading(true);

        if(editSectionName)
        result=await updateSection({sectionName:data.sectionName,sectionId:editSectionName,courseId:course._id},token);
        
        else //Means We are creating new SECTION
        result=await createSection({sectionName:data.sectionName,courseId:course._id},token);
        
        console.log("HELLEO ");
        if(result)
        {
            dispatch(setCourse(result));

            console.log("AFTER---->",course);
            // setEditCourse(null);
            setEditSectionName(null);
            setValue("sectionName","");
        }
        setLoading(false);
    }   
    return (
        <div className='text-white rounded-md border-richblack-700 bg-richblack-800 p-7 mt-4'>
            <h1 className="text-[20px] font-semibold">Course Builder</h1>
            <form onSubmit={handleSubmit(mySubmit)} className="space-y-4">
                <label>Section Name <sup>*</sup></label>
                <input type='text' id='sectionName' placeholder='ADD a section Name'
                    {...register("sectionName",{required:true})} className="w-full bg-richblack-600 rounded-md p-2"
                />
                { errors.sectionName && <span>Section Name is Required</span>}
                <br/>
                <button className="text-yellow-50 border border-yellow-50 px-3 py-1 rounded-md">
                    <p>{editSectionName?"Edit Section Name":"Create Section"}</p>
                </button>
                {
                    editSectionName && <button className="text-richblack-25 ml-2" type="button"
                    onClick={cancelEdit}>Cancel Edit</button>
                }
                {
                    course.courseContent?.length>0 && 
                    <NestedView handleEditSectionName={handleEditSectionName}/>
                }
                <div className="flex justify-end gap-x-3">
                    <button className="bg-richblack-50  px-3 py-1 text-black font-bold rounded-md" onClick={goBack}>Back</button>
                    <button className="bg-yellow-50 px-3 py-1 text-black font-bold rounded-md" onClick={goNext}>Next</button>
                </div>
            </form>
        </div>
    )
}