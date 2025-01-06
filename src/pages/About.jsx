import HighlightText from '../components/core/HomePage/HighlightText'
import AboutSectionForm from './AboutSectionForm';
const data = [
    { title: "Curriculum Based on Industry Needs", desc: "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",order:1 },
    { title: "Our Learning Methods", desc: "Studynotion partners with more than 275+ leading universities and companies to bring" ,order:2},
    { title: "", desc: "" ,order:3},
    { title: "Certification", desc: "Studynotion partners with more than 275+ leading universities and companies to bring" ,order:1},
    { title: `Rating "Auto-grading"`, desc: "Studynotion partners with more than 275+ leading universities and companies to bring" ,order:2},
    { title: "Ready to Work", desc: "Studynotion partners with more than 275+ leading universities and companies to bring" ,order:1},
];
const colors={
    1:"[#2C333F]",
    2:"[#161D29]",
    3:"[#000814]",
}
const common=""
const About = () => {
    return (
        <div>
            <div className='bg-[#161D29] w-[100%] min-h-[100px] text-white pb-[100px] mx-auto  pt-[50px]'>
                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center'>
                    <h1 className='font-bold text-[35px] text-center'>Driving Innovation in Online Education for a <br /> <HighlightText text="Brighter Future" /> </h1>
                    <p className='text-center max-w-[800px] text-richblack-100'>
                        Studynotion is at the forefront of driving innovation in online education. We're passionate about creating
                        a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a
                        vibrant learning community
                    </p>
                </div>
            </div>
            
            <div className='grid grid-cols-1 gap-y-8 grid-rows-7 md:gap-y-0 md:grid-cols-4 md:grid-rows-2 mt-[200px] w-11/12 max-w-maxContent mx-auto text-white pb-[100px]'>
                <div className='col-span-2'>
                    <div>
                        <h1 className='text-[30px] font-bold text-white'>World-Class Learning for <HighlightText text="Anyone, Anywhere" /></h1>
                        <p className='text-richblack-25 '>Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.</p>
                        <button className='bg-yellow-50 font-bold text-black rounded-s-md px-5 py-3 '>Learn More</button>
                    </div>
                </div>
                {
                    data.map((card,ind)=>{
                        return <div className={`bg-${colors[card.order]} px-6 pt-5 pb-[100px] min-w-[200px] ${card.title==""?"invisible md:visible":""}`} key={ind}>
                                    <p className='font-bold mt-5 mb-8  '>{card.title}</p>
                                    <p className='text-richblack-300 '>{card.desc}</p>
                                </div>
                    })
                }
            </div>

            <AboutSectionForm/>
        </div>
    );
}
export default About;