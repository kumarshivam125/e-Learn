import { useSelector } from "react-redux"
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart(){
    const {total,totalItems}=useSelector(state=>state.cart);
    return(
        <div className="text-white ">
            <h1 className="my-4 text-[30px] font-semibold">Your Cart</h1>
            <p className="text-richblack-25 text-[20px]">{totalItems} Courses in Cart</p>
            <hr className="w-[60vw]"></hr>
            {
                total>0 ?(
                    <div className="flex justify-between  mt-3">
                        <RenderCartCourses/>
                        <RenderTotalAmount/>
                    </div>
                ):(<p className="text-richblack-200 mt-[20%] ml-[30%] text-[30px]">Your Cart is Empty</p>)
            }
        </div>
    )
}