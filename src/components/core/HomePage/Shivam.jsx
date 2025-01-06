import {Link} from "react-router-dom";
const Shivam=({children,active,linkto})=>{
    return(
        <Link to={linkto}>
            <div className={`${active?"bg-yellow-50":"bg-richblack-800"} ${active?"text-black":"text-white"} 
            font-semibold px-[20px] py-[8px] rounded-md hover:scale-95 transition-all duration-200 
            ${active==false?"border-r-[3px] border-r-richblack-700 border-b-[3px] border-b-richblack-700":""}`}>
            {children}</div>
        </Link>
    );
}
export default Shivam;
