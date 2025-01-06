import { useDispatch, useSelector } from "react-redux"
import ReactStars from "react-stars";
import { GoStarFill } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { removeFromCart } from '../../../../slices/cartSlice';
export default function RenderCartCourses() {
    const { cart } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    return (
        <div className="flex flex-col gap-y-3"> 
            {
                cart.map((course, ind) => (
                    <div key={ind}>
                        <div className="flex justify-between gap-x-7">
                            <div className="flex gap-x-2">
                                <img src={course?.thumbnail} className="w-[250px] h-[150px] object-cover rounded-md"/>
                                <div>
                                    <p>{course?.courseName}</p>
                                    <p>{course?.category?.name}</p>
                                    <div className="flex items-center gap-x-2">
                                        <span>4.5</span>
                                        <ReactStars
                                            count={5}
                                            size={20}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<GoStarFill />}
                                            fullIcon={<GoStarFill />}
                                        />
                                        <span>{course?.ratingAndReviews?.length} Ratings</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2 bg-richblack-700 rounded-md px-3 py-2 text-pink-200 cursor-pointer">
                                    <RiDeleteBin5Line />
                                    <button onClick={() => dispatch(removeFromCart(course._id))}>Remove</button>
                                </div>
                                <p className="text-yellow-25 text-[20px] text-end">Rs.{course.price}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}