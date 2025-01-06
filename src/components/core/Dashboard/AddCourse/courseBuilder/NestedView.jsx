import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { ConfirmationModal } from "../../../../common/ConfirmationModal";
import { BiSolidDownArrow } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import SubSectionModal from "./SubSectionModal";
import setCourse from "../../../../../slices/courseSlice";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { IoIosVideocam } from "react-icons/io";
export default function NestedView({ handleEditSectionName }) {
    const { token } = useSelector(state => state.auth);
    const { course } = useSelector(state => state.course);
    const dispatch = useDispatch();
    const [addSubsection, setAddSubsection] = useState(null);
    const [viewSubsection, setViewSubsection] = useState(null);
    const [editSubsection, setEditSubsection] = useState(null);

    const [modalData, setModalData] = useState(null);
    const [tmp,setTmp]=useState();
    const handleDeleteSection = async(sectionId) => {
        const result=await deleteSection({sectionId,courseId:course._id},token);
        console.log("IN FRONTEND AFETER DELETE",result);
        setTmp(result);
        if(result)
        {
            // const updatedCourseContent=
            // dispatch(setCourse(null));
            // dispatch(setCourse(result));
            dispatch(setCourse(tmp));
            // const updatedCourse={...course,courseContent:result.courseContent};
            // dispatch(setCourse(updatedCourse));
        }
        // setModalData(null);
    }
    //*******************VVVVVIMP FUNCTION**************************
    const handleDeleteSubSection = async(subSectionId, sectionId) => {
        const result=await deleteSubSection({subSectionId, sectionId},token);
        console.log("DELETE SUBSECTION RESPO",result);
        if(result)
        {
            // const updatedCourseContent=course.courseContent.map(section=>section._id==sectionId?result:section);
            // const updatedCourse={...course,courseContent:updatedCourseContent};
            const sections=course.courseContent.find(sec=>sec._id==sectionId);
            sections[0].subSection.map(sub=>sub._id==subSectionId?{}:result.subSection);
            const updatedCourseContent=course.courseContent;
            const updatedCourse={...course,courseContent:updatedCourseContent};
            console.log(updatedCourse);
            dispatch(setCourse(updatedCourse));
        }
        setModalData(null);
    }
    return (
        <div>
            <div className="rounded-lg bg-richblack-700 p-6">
                {
                    course?.courseContent?.map((section) => (
                        <details key={section._id} open>
                            <summary className="flex justify-between items-center">
                                <div className="flex gap-x-2 items-center">
                                    <RxDropdownMenu />
                                    {section.sectionName}
                                </div>
                                <div className="flex items-center gap-x-4">
                                    <button onClick={() => handleEditSectionName(section._id, section.sectionName)} type="button"><MdModeEditOutline /></button>
                                    <button onClick={() => {
                                        setModalData({
                                            text1: "Delete This Section",
                                            text2: "All Lectures in this Section will be Deleted",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setModalData(null)
                                        })
                                    }} type="button"
                                    ><RiDeleteBin7Fill /></button>
                                    <span>|</span>
                                    <BiSolidDownArrow />
                                </div>
                            </summary>
                            <div>
                                {
                                    section?.subSection?.map((data) => (
                                        <div key={data?._id} onClick={() => setViewSubsection(data)}
                                            className="flex justify-between items-center">
                                            <div className="flex gap-x-2 pl-3 items-center cursor-pointer">
                                                <IoIosVideocam />
                                                <p>{data.title}</p>
                                            </div>
                                            <div className="flex items-center gap-x-3" onClick={(e)=>e.stopPropagation()}>
                                                <button onClick={() => setEditSubsection({ ...data, sectionId: section._id })}>
                                                    <MdModeEditOutline />
                                                </button>
                                                <button onClick={() => {
                                                    setModalData({
                                                        text1: "Delete This Sub Section",
                                                        text2: "This Lecture will be Deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                        btn2Handler: () => setModalData(null)
                                                    })
                                                }}><RiDeleteBin7Fill /></button>
                                            </div>
                                        </div>
                                    ))
                                }
                                <button onClick={() => setAddSubsection(section._id)} 
                                    className="flex items-center mt-2 ml-3 gap-x-2 text-yellow-50">
                                    <FaPlus />
                                    <p>Add Lecture</p>
                                </button>
                            </div>
                        </details>
                    ))
                }
            </div>
            <div>
                {
                    addSubsection ? <SubSectionModal modalData={addSubsection} setModalData={setAddSubsection} add={true} /> :
                    viewSubsection ? <SubSectionModal modalData={viewSubsection} setModalData={setViewSubsection} view={true} />
                    : editSubsection ? <SubSectionModal modalData={editSubsection} setModalData={setEditSubsection} edit={true} />
                    : <div></div>
                }
            </div>
            {
                modalData&& <ConfirmationModal modalData={modalData}/>
            }
        </div>
    )
} 