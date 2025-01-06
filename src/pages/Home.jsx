import '../App.css';//Mind this line i didnt a
import { FaArrowRight } from "react-icons/fa";
import {Link} from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import aCTAButton from '../components/core/HomePage/aCTAButton';
import Shivam from '../components/core/HomePage/Shivam';
import Banner from "../assets/Images/banner.mp4";//While imporing this suggesstion
//was not showing 
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLine from '../components/core/HomePage/TimeLine';
import logo1 from "../assets/TimeLineLogo/Logo1.svg";
import logo2 from "../assets/TimeLineLogo/Logo2.svg";
import logo3 from "../assets/TimeLineLogo/Logo3.svg";
import logo4 from "../assets/TimeLineLogo/Logo4.svg";
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import { useState } from 'react';
import Card from '../components/core/HomePage/Card';
import CircleImage from '../components/core/HomePage/CircleImage';

const data=["Free","New to Coding","Most Popular","Skills Paths","Career Paths"];
const shiv={
    "Free": [
        {skill: "Learn HTML", desc: "HTML is the standard markup language for creating web pages. It forms the structure of a web page and is easy to learn."},
        {skill: "Learn CSS", desc: "CSS is used to style and layout web pages. It allows you to apply visual styles and effects to HTML elements."},
        {skill: "Web design", desc: "Web design involves creating the layout and visual elements of a website. It combines both technical and creative skills to build user-friendly interfaces."}
    ],
    "New to Coding": [
        {skill: "JS", desc: "JavaScript is a programming language that allows you to implement complex features on web pages. It's essential for creating interactive web applications."},
        {skill: "Tailwind", desc: "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs. It provides a set of predefined classes to apply styles directly in your HTML."},
        {skill: "BootStrap", desc: "Bootstrap is a popular front-end framework for developing responsive and mobile-first websites. It includes pre-designed components and a grid system."}
    ],
    "Most Popular": [
        {skill: "Java", desc: "Java is a versatile and powerful programming language used for building a variety of applications. It is known for its portability across platforms."},
        {skill: "Python", desc: "Python is a high-level programming language that is easy to read and write. It's widely used for web development, data analysis, and automation."},
        {skill: "SCSS", desc: "SCSS (Sassy CSS) is a CSS preprocessor that allows you to use variables, nested rules, and functions. It helps to write more maintainable and scalable CSS."}
    ],
    "Skills Paths": [
        {skill: "Flask", desc: "Flask is a micro web framework for Python. It is designed to be simple and easy to get started with, making it ideal for small to medium-sized applications."},
        {skill: "Django", desc: "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It's perfect for building complex, database-driven websites."},
        {skill: "Fast API", desc: "FastAPI is a modern, fast web framework for building APIs with Python. It is known for its high performance and ease of use, leveraging asynchronous programming."}
    ],
    "Career Paths": [
        {skill: "Next", desc: "Next.js is a React framework that enables server-side rendering and static site generation. It's used for building fast, scalable web applications."},
        {skill: "Nest", desc: "NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses TypeScript and combines elements of OOP, FP, and FRP."},
        {skill: "Sanity", desc: "Sanity.io is a headless CMS that provides real-time collaboration and structured content. It allows developers to build highly customizable content management solutions."}
    ]
};
const Home=()=>{
    const [currCategory,setCategory]=useState(data[0]);
    const [yellowBG,setYellowBG]=useState(0);
    function clickHandle(obj){
        setYellowBG(0);
        setCategory(obj);
    }
    return(
        <div>
            {/* Section 1 */}
            <div className="flex flex-col w-11/12 relative justify-between items-center
             text-white gap-y-[20px] mx-auto mb-[100px]">
                <Link to="/signup">
                    <div className="group mt-16 rounded-full bg-richblack-800 text-richblack-200 font-semibold transition-all
                    duration-200 hover:scale-95">
                        <div className="rounded-full flex items-center gap-x-3 group-hover:bg-richblack-900  px-5 py-[8px]">
                            <div>Become an Instructor</div>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>

                <div className="text-[30px] font-bold text-center">
                    Empower Your Future With 
                    <HighlightText text="Coding Skills"/>
                </div>
 
                <p className="max-w-[800px] text-center text-richblack-200">With our online coding courses, you 
                can learn at your own pace, from anywhere in the world,and get access to a wealth of 
                resources, including hands-on projects, quizzes, and personalized feedback from instructors. </p>
                <div className="flex gap-x-[20px]">
                    <Shivam active={true} linkto={"/signup"}>Learn More</Shivam>
                    <Shivam active={false} linkto={"/login"}>Book a Demo</Shivam>
                </div>
                
                {/* VIDEO SECTION */}
                <div className="shadow-blue-200 lg:mt-8 max-w-[900px] border-r-[15px]
                border-b-[15px] border-r-white relative mb-[100px] "> 
                    {/* <div className='absolute -top-[10px] hello1 h-[20px] w-[80%]'></div> */}

                    <div className='absolute top-0 left-[100%] h-[20px] w-[30px] bg-richblack-900'></div>
                    <div className='absolute top-[100%] left-0 h-[20px] w-[30px] bg-richblack-900'></div>
                    <video loop muted autoPlay className='md:h-[400px]'>
                        <source src={Banner}></source>
                    </video>
                </div>

                {/* Code Section 1*/}
                <div>
                    <CodeBlocks heading={
                        <div className='text-[30px] font-bold text-center'>
                            Unlock your <HighlightText text="coding potential"/>  with our online courses.
                        </div>
                    }
                    subheading="Our courses are designed and taught by industry experts who have years of experience 
                    in coding and are passionate about sharing their knowledge with you." 
                    btn1={{active:true,linkto:"/login",btnText:"Try it Yourself"}} 
                    btn2={{active:false,linkto:"/signup",btnText:"Learn More"}}

                    codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example<\n/title><linkrel="stylesheet"
                    href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav>
                    <ahref="one/">One</a><ahref="two/">Two</a>`} 
                    codecolor={"text-yellow-25"}   />
                </div>
            </div>

            <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center text-white mt-[130px]'>
                <p className='font-bold text-white text-[30px]'>Unlock the <HighlightText text="Power to Code"/></p>
                <p className='my-[10px] font-bold text-richblack-100 text-[20px] '>Learn to build anything you can imagine</p>
                <div className='flex flex-wrap gap-x-5 bg-richblack-800 text-richblack-200 py-[8px] px-[20px] rounded-lg mt-[30px]  '>
                    {
                        data.map(obj=>{
                            return <button className={`${currCategory==obj?"bg-richblack-900 rounded-full":"text-opacity-70 "} 
                            text-richblack-5  px-[20px] py-[10px] hover:bg-richblack-900 hover:rounded-full duration-150 transition-all`}
                            onClick={()=>clickHandle(obj)}>{obj}</button>
                        })
                    }
                </div>
                <Card data={shiv[currCategory]} yellowBG={yellowBG} setYellowBG={setYellowBG}/>
            </div>

            {/* Section 2 */}
            <div className='bg-pure-greys-5 text-richblack-800 pb-[20rem] '>
                <div className='homepage_bg h-[20rem] mx-auto  '>
                    <div className='w-11/12 max-w-[1260px] flex flex-col items-center mx-auto'>
                        <div className='h-[7.5rem] mt-[50px]'></div>
                        <div className='flex gap-3'>
                            <Shivam active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-1'>
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </Shivam>
                            <Shivam active={false} linkto={"/signup"}>Learn More</Shivam>
                        </div>
                    </div>
                </div>
                
                <div className='w-11/12 max-w-maxContent mt-[10%] mx-auto '>
                    <div className='flex justify-center flex-wrap gap-x-10 gap-y-10'>
                        <div className='font-bold text-[30px] max-w-[400px]'>
                            Get the skills you need 
                            <HighlightText text="for a job that is in demand."/>
                        </div>
                        <div className='flex flex-col max-w-[400px] gap-y-6 items-start'>
                            <p>The modern StudyNotion is the dictates its own terms. Today, to be a
                            competitive specialist requires more than professional skills.</p>
                            <Shivam active={true} linkto={"/"}>Learn More</Shivam>
                        </div>
                    </div>
                </div>

                <div className='w-11/12 max-w-maxContent mx-auto flex mt-[100px] justify-center flex-wrap 
                        gap-x-[5rem] gap-y-[5rem]'>
                    <div className='flex flex-col max-w-[400px] gap-y-[3rem] relative z-[10]'>
                        <div className='ml-[1.5rem] absolute -z-[5] bg-richblack-25 h-[350px] w-[4px]'></div>
                        <TimeLine heading="Leadership" subheading="Fully committed to the success company" logo={logo1}/>
                        <TimeLine heading="Responsibility" subheading="Students will always be our top priority" logo={logo2}/>
                        <TimeLine heading="Flexibility" subheading="The ability to switch is an important skills" logo={logo3}/>
                        <TimeLine heading="Solve the problem" subheading="Code your way to a solution" logo={logo4}/>
                    </div>
                    {/* Image Section */}
                    <div className='h-[500px] w-[600px] relative'>
                        <img src={require('../assets/Images/TimelineImage.png')} className='absolute z-[1]' />
                        <div className='hidden md:block absolute top-[8%] left-[3%] clipped-ellipse'></div>
                        <div className=' flex items-center justify-center absolute z-[10] top-[55%] left-[50%] 
                        translate-x-[-50%] translate-y-[120%]       h-[100px] w-[350px] bg-[#014A32] text-white
                            gap-x-10 '>
                            <div className='flex gap-x-2 items-center pr-4 border-r-2 border-r-richblack-5    '>
                                <span className='font-bold text-[30px]'>10</span>
                                <p className='text-[11px] uppercase  opacity-70 '>Years<br/>Experience</p>
                            </div>
                            <div className='flex gap-x-2 items-center'>
                                <span className='font-bold text-[30px]'>250</span>
                                <p className='text-[11px] uppercase opacity-70 '>Types of<br/>Courses</p>
                            </div>
                        </div>
                    </div>
                </div>
            
                {/* Section 3 */}
                <div className='max-w-[100%] mx-auto flex flex-col items-center'>
                    <LearningLanguageSection/>                
                </div>
                <CircleImage/>
            </div>

            {/* Section-3  INSTRUCTOR SECTION */}
            <div className='text-white flex flex-wrap w-11/2 max-w-maxContent mx-auto justify-center py-[100px]
            gap-x-[5rem] gap-y-8 '>
                <img src={require('../assets/Images/Instructor.png')} className='max-w-[600px] px-[50px]'/>
                <div className='flex flex-col items-start  gap-y-5 max-w-[500px]'>
                    <p className='font-bold text-[30px]'>Become an <br/><HighlightText text="instructor"/> </p>
                    <p className='max-w-[600px] mb-10 text-richblack-50 '>Instructors from around the world teach millions of students on StudyNotion.We provide the
                    tools and skills to teach what you love.</p>
                    <Shivam active={true} linkto={""}>Start Teaching Today</Shivam>
                </div>
            </div>

            {/* Footer */}
        </div>
    );
}
export default Home;
