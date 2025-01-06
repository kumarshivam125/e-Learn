import HighlightText from "./HighlightText";
import Shivam from "./Shivam";
const LearningLanguageSection=()=>{
    return (
        <div className="mt-[80px]">
            <p className="font-bold text-[30px] text-center">Your swiss knife for 
            <HighlightText text="learning any language"/> </p>
            <p className="max-w-[600px] text-center ">Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
            progress tracking, custom schedule and more.</p>
            <div className="hidden md:flex mt-[10px] relative w-11/12 max-w-[500px] pb-[35rem] mb-0">
                <img src={require("../../../assets/Images/Know_your_progress.png")} className="absolute -left-[40%]"/>
                <img src={require("../../../assets/Images/Compare_with_others.png")} className="absolute left-[20%]"/>
                <img src={require("../../../assets/Images/Plan_your_lessons.png")} className="absolute left-[80%]"/>
            </div>

            <div className="md:hidden mt-[20px] flex flex-wrap justify-center items-center ">
                <img src={require("../../../assets/Images/Know_your_progress.png")} />
                <img src={require("../../../assets/Images/Compare_with_others.png")}/>
                <img src={require("../../../assets/Images/Plan_your_lessons.png")} />
            </div>
            <div className="text-center flex justify-center">
                <Shivam active={true}  linkto={""} >Learn More</Shivam>
            </div>
        </div>
    );
}
export default LearningLanguageSection;