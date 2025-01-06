import { useState ,} from "react";
import { useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
// import { GoClock } from "react-icons/go";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { ConfirmationModal } from "../../../common/ConfirmationModal";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/formatDate";

const CourseTable = ({ courses, setCourses }) => {
    const navigate=useNavigate();
    const { token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null);
    const handleCourseDelete = async (courseId) => {
        setLoading(true);
        await deleteCourse({courseId:courseId}, token);
        const result = await fetchInstructorCourses(token);
        if (result)
            setCourses(result);

        setModalData(null);
        setLoading(false);

    }
    return (
        <div>
            <Table>
                <Thead>
                    <Tr className="flex gap-x-36 ">
                        <Th>Courses</Th>
                        <Th>Duration</Th>
                        <Th>Price</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody className="space-y-3">
                    {
                        courses.length == 0 ?
                            <Tr>
                                <Td className="font-bold text-[25px]">No Courses Found</Td>
                            </Tr>
                            : courses.map((course) => (
                                <Tr key={course._id} className="flex gap-x-32">
                                    <Td>
                                        <div className="flex gap-x-4">
                                            <img src={course?.thumbnail} className="h-[150px] w-[200px] rounded-2xl" />
                                            <div className="flex flex-col">
                                                <p>{course.courseName}</p>
                                                <p>{course.courseDescription}</p>
                                                <p>Created :{formatDate(course.createdAt)}</p>
                                                {
                                                    course.status === "Draft" ?
                                                        <div className="flex text-pink-500 font-bold bg-pink-25 rounded-lg px-1 items-center gap-x-1">
                                                            <p>Draft</p>
                                                            <FaClock />
                                                        </div>
                                                        :
                                                        <div className="flex text-yellow-50 font-bold bg-yellow-600 rounded-lg px-1 items-center gap-x-1">
                                                            <p>Published</p>
                                                            <IoIosCheckmarkCircle />
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>2hr30min</Td>
                                    <Td>{course.price}</Td>
                                    <Td >
                                        <div className="flex gap-x-3">
                                            <button onClick={()=>navigate(`/dashboard/edit-course/${course._id}`)}
                                            > <MdEdit /> </button>
                                            <button
                                                onClick={() => {
                                                    setModalData({
                                                        text1: "Do You Want To Delete This Course",
                                                        text2: "ALL the data Related to this Course will be Deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleCourseDelete(course._id),
                                                        btn2Handler: () => setModalData(null)
                                                    })
                                                }}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                    }
                </Tbody>
            </Table>
            {
                modalData && <ConfirmationModal modalData={modalData} />
            }
        </div>
    )
}
export default CourseTable;