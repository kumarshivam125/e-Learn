import { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
export default function Section({ section,expandAll}) {
    const [show, setShow] = useState(false);
    useEffect(()=>{
        if(expandAll) setShow(true);
        else setShow(false);
    },[expandAll])
    return (
        <div>
            <div>
                <div className="cursor-pointer  px-4 py-5 bg-richblack-800 border border-richblack-400 
                        flex justify-between duration-1000 " onClick={() => setShow(prev => !prev)}>
                    <div className="flex gap-x-1 items-center">
                        <MdOutlineKeyboardArrowDown className={`${show?"rotate-180":""}`}/>
                        <div>{section.sectionName}</div>
                    </div>
                    <p className="text-yellow-50">{section?.subSection?.length} lecture(s)</p>
                </div>
                {
                    show &&
                    <div>
                        {
                            section?.subSection.map((sub) => (
                                <div className="bg-richblack-900 border border-richblack-500 pl-4 flex gap-x-2 items-center py-3">
                                    <FaVideo />
                                    <div >{sub?.title}</div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}