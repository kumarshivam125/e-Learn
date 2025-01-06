const TimeLine=({heading,subheading,logo})=>{
    return(
        <div>   
            <div className="flex gap-x-4">
                {/* LOGO */}
                <div className="bg-white shadow shadow-richblack-200 h-[50px] w-[50px] rounded-full flex justify-center items-center">
                    <img src={logo}/>
                </div>
                {/* TEXT */}
                <div className="flex flex-col">
                    <p className="font-bold text-[18px]">{heading}</p>
                    <p>{subheading}</p>
                </div>
            </div>
        </div>  
    );
}
export default TimeLine;