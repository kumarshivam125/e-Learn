import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";
export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false }) {
    const { register, handleSubmit, getValues, setValue, formState: { errors, } } = useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector(state => state.auth);
    const { course } = useSelector(state => state.course);
    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, [])
    const isFormUpdated = () => {
        const currentValues = getValues();
        if (currentValues.lectureTitle !== modalData.title || currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl
        )
            return true;
        else
            return false;

    }
    const handleEditSubSection = async () => {
        const currValues = getValues();
        const formData = new FormData();
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currValues.lectureTitle !== modalData.title) {
            formData.append("title", currValues.lectureTitle);
        }
        if (currValues.lectureDesc !== modalData.description) {
            formData.append("description", currValues.lectureDesc);
        }
        if (currValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currValues.lectureVideo);
        }
        setLoading(true);
        const result = await updateSubSection(formData, token);
        if (result) {
            const updatedCourseContent=course.courseContent.map(section=>section._id==modalData.sectionId?result:section);
            const updatedCourse={...course,courseContent:updatedCourseContent};
            dispatch(setCourse(updatedCourse));

            // dispatch(setCourse(result));
        }
        setModalData(null);

        setLoading(false);

    }
    const mySubmit = async (data) => {
        if (view) return;
        if (edit) {
            if (!isFormUpdated())
                toast.error("No Changes Made in Form");
            else
                handleEditSubSection();
            return;
        }
        //Means ABB ADD WALA case 
        const formData = new FormData();
        //See in NestedView File for ADD we are sending "addSubSection"  state variable 
        //that is having sectionId
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("video", data.lectureVideo);
        setLoading(true);
        const result = await createSubSection(formData, token);
        if (result) {
            const updatedCourseContent=course.courseContent.map(section=>section._id==modalData?result:section);
            const updatedCourse={...course,courseContent:updatedCourseContent};
            dispatch(setCourse(updatedCourse));

            // dispatch(setCourse(result));
        }
        setModalData(null);

        setLoading(false);
    }
    return (
        <div className="w-[100vw] h-[100vh] bg-richblack-25 top-0 left-0 fixed bg-opacity-50 overflow-y-scroll">
            <div className="w-[500px] mx-auto bg-richblack-700 p-4 rounded-lg mt-16 ">
                <div className="flex justify-between">
                    <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture </p>
                    <button onClick={() => (!loading ? setModalData(null) : {})}>
                        <RxCross2 />
                    </button>
                </div>
                <form onClick={handleSubmit(mySubmit)}>
                    <Upload name="lectureVideo" label="Lecture Video" register={register}
                        setValue={setValue} errors={errors} video={true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.videoUrl : null}
                    />
                    <div>
                        <label>Lecture Title</label>
                        <input id='lectureTitle' placeholder="Enter Lecture Title"
                            {...register("lectureTitle",{required:true})} className="w-full rounded-md bg-richblack-500"
                        />
                        { errors.lectureTitle && <span>Lecture Title is Required </span> }
                    </div>
                    <div>
                        <label>Lecture Description</label>
                        <textarea id='lectureDesc'  {...register("lectureDesc",{required:true})}
                            className="w-full min-h-[70px] rounded-md bg-richblack-500" placeholder="Enter Lecture Description"
                        />
                        { errors.lectureDesc && <span>Lecture Description is Required </span> }
                    </div>
                    {
                        !view && (
                            <div>
                                <button className="bg-yellow-50 font-bold px-3 text-black rounded-md">{loading?"Loading...":edit?"Save Changes":"Create"}</button>
                            </div>
                        )
                    }
                </form>
            </div>
        </div>
    )
}