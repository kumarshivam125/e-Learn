import { useSelector } from "react-redux"
import { FaCheck } from "react-icons/fa";
import CourseInformationForm from "./CourseInformationForm";
import BuilderForm from "./courseBuilder/BuilderForm";
import PublishCourse from "./PublishCourse";
export default function RenderSteps() {
    const { step } = useSelector(state => state.course);
    const steps = [
        {
            id: 1,
            title: "Course Information"
        },
        {
            id: 2,
            title: "Course Builder"
        },
        {
            id: 3,
            title: "Publish"
        },
    ]
    return (
        <>
            <div className="flex gap-x-[10rem] ">
                {
                    steps.map((item, ind) => (
                        <>
                            <div>
                                <div className={`${step === item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                                    : step > item.id?"bg-yellow-50 text-richblack-800":"border-richblack-700 bg-richblack-800 text-richblack-300"} h-[50px] w-[50px] flex justify-center items-center rounded-full`}>
                                    {
                                        step > item.id ? <FaCheck /> : item.id
                                    }
                                </div>
                                {/* ADD Code for dashes */}
                            </div>
                        </>
                    ))
                }
            </div>
            <div className="flex gap-x-[5rem] ">
                {
                    steps.map((item)=>(
                        <div>
                            <p>{item.title}</p>
                        </div>
                    ))
                }
            </div>
            { step==1&& <CourseInformationForm/> }
            {step==2&& <BuilderForm/>}
            {step==3&& <PublishCourse/>}
        </>
    )
}