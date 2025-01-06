import { useNavigate } from "react-router-dom";
import { buyCourse } from "../../../../services/operations/paymentAPI";
import { useDispatch, useSelector } from "react-redux";
export default function RenderTotalAmount(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const {total,cart}=useSelector(state=>state.cart);
    const handleBuyCourse=()=>{
        const courses=cart.map(course=>course._id);
        buyCourse(token,courses,user,navigate,dispatch);
        
    }
    return(
        <div className="bg-richblack-600 px-6 rounded-md h-[150px] ">
            <p className="my-2">Total:</p>
            <p className="text-[20px] text-yellow-25">Rs.{total}</p>
            <button onClick={handleBuyCourse} className="mt-1 bg-yellow-50 px-12 py-2 rounded-md text-black font-bold">Buy Now</button>
        </div>
    )
}