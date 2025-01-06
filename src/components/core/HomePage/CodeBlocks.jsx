import { TypeAnimation } from "react-type-animation";
import aCTAButton from "./aCTAButton";
import { FaArrowRightLong } from "react-icons/fa6";
import Shivam from "./Shivam";

const CodeBlocks=({heading,subheading,btn1,btn2,codeblock,backgroundGradient,codecolor})=>{
    //see below we are directly using {heading} bcz from "Home" we are directly 
    //passing everything in <div></div>
    return(
        <div className="flex flex-wrap mx-auto justify-between gap-x-4">
            <div className="flex flex-col w-[500px] items-center gap-y-[1rem]">
                {heading} 
                <p className="w-[500px] text-center text-richblack-200">{subheading}</p>
                <div className="flex justify-between gap-x-[1rem] mt-[2rem]">
                    <Shivam active={btn1.active} linkto={btn1.linkto}>
                        <div className="flex gap-2 items-center">
                            {btn1.btnText}
                            <FaArrowRightLong/>
                        </div>
                    </Shivam>
                    <Shivam active={btn2.active} linkto={btn2.linkto}> {btn2.btnText} </Shivam>
                </div>
            </div>
            {/* Coding Animation */}
            <div className="text-center w-[10px] flex flex-col text-richblack-400 font-bold font-inter">
                {/* HW-->Gradient */}
                <p>1</p>                
                <p>2</p>                
                <p>3</p>                
                <p>4</p>                
                <p>5</p>                
                <p>6</p>                
                <p>7</p>                
                <p>8</p>                
                <p>9</p>                
                <p>10</p>                
                <p>11</p>                
            </div>
            <div className={`w-[500px] flex flex-col font-mono font-bold gap-2 ${codecolor} pr-2`}>
                <TypeAnimation 
                    sequence={[codeblock,0,""]}
                    // repeat={Infinity}

                    style={{whiteSpace:"pre-line",display:"block"}}
                />
            </div>           
        </div>
    );
}
export default CodeBlocks;