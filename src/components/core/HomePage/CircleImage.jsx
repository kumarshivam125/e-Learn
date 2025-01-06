const CircleImage=()=>{
    return (
        <div className=" w-11/12 mx-auto max-w-maxContent relative flex justify-end mt-[100px]">
            <div className="w-[300px] h-[300px] bg1 rounded-full absolute left-[60%] top-[30%]
            border-[15px] border-pure-greys-5"></div>
            <div className="w-[300px] h-[300px] bg2 rounded-full"></div>
            <div className="w-[200px] h-[200px] bg3 rounded-full absolute left-[80%] -top-[40%]
             border-[15px] border-pure-greys-5"></div>
        </div>
    );
}
export default CircleImage;