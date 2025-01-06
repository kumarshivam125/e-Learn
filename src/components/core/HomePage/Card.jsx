const Card = ({data,yellowBG,setYellowBG}) => {
    return (
        <div className='flex flex-wrap gap-x-10 mt-[50px] gap-y-[150px] justify-center'>
            {
                data.map((x,ind) => {
                    return <div className={`${yellowBG==ind?"bg-richblack-5 text-black border-opacity-100":
                    "border-opacity-0 bg-richblack-800"} border-r-[15px] border-r-yellow-50 border-b-[15px] border-b-yellow-50 
                    p-[20px] -mb-[100px]  hover:bg-richblack-5 hover:text-black duration-150 transition-all relative`} 
                    onClick={()=>setYellowBG(ind)}>
                        <h1 className="font-bold text-xl">{x.skill}</h1>
                        <p className={`mt-5  min-h-[200px] max-w-[300px] ${yellowBG==ind?"text-black":"text-richblack-200"} `}>{x.desc}</p>

                        <div className={`${yellowBG==ind?"absolute bg-richblack-900 left-[100%] top-0 h-[15px] w-[15px]":""}`}></div>
                        <div className={`${yellowBG==ind?"absolute bg-white homepage_bg left-0 top-[100%] h-[15px] w-[15px]":""}`}></div>
                        <div className="border-dashed border w-[120px] scale-x-[3] translate-x-[100%] "></div>
                    </div>
                })
            }
        </div>
    );
}
export default Card;