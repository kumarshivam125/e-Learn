import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../data/countrycode.json";
import toast from "react-hot-toast";
const AboutSectionForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm();
    const mySubmitHandler = async (data) => {
        //Automatically all the data will be aggregated and stored in "data" object
        console.log("Logging Contact Us form Data", data);
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                firstname: "",
                lastname: "",
                phoneNo: "",
                code:"",
                email: "",
                message: "",
            })
        }
    }, [reset, isSubmitSuccessful])

    return (
        <div className="text-white flex flex-col mx-auto max-w-maxContent w-11/12 items-center pb-[100px] relative">
            <h1 className=""> Get In Touch </h1>
            <p className="mb-8 ">We'd love to here for you, Please fill out this form.</p>

            <form onSubmit={handleSubmit(mySubmitHandler)}>
                <div className="flex flex-col gap-y-8">
                    {/* First Name Last Name */}
                    <div className="flex gap-x-8 items-center">
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="firstname">First Name</label>
                            <input type="text" id="firstname" name="firstname" {...register("firstname", { required: true })}
                                placeholder="Enter first Name" className="rounded-md px-3 py-3 placeholder:text-richblack-400  bg-richblack-700 outline-none "
                            />
                            {
                                errors.firstname && <span className="absolute right-2 bg-yellow-50 text-black font-bold rounded-md px-3">Please Enter your First Name</span>
                            }
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastname" {...register("lastname", { required: true })}
                                placeholder="Enter Last Name" className="rounded-md px-3 py-3 placeholder:text-richblack-400  bg-richblack-700 outline-none "
                            />
                            {
                                errors.lastname && <span>Please Enter your Last Name</span>
                            }
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" {...register("email", { required: true })}
                            placeholder="Enter Youe Email" className="rounded-md px-3 py-3 placeholder:text-richblack-400  bg-richblack-700 outline-none "
                        />
                        {
                            errors.email && <span>Please Enter your Email</span>
                        }
                    </div>

                    <div className="">
                        <label htmlFor="firstname">Phone Number</label>
                        <div className="flex gap-x-8  rounded-md text-richblack-400  
                        bg-richblack-700 outline-none">
                            <div className="">
                                <select className="w-[150px]">
                                    {
                                        CountryCode.map((obj,ind)=>{
                                            return <option value={obj.code} key={ind}  {...register("code",{required:true})}>{obj.code}-{obj.country}</option>
                                        })
                                    }
                                </select>                                
                            </div>
                            <div className="w-[70%] text-richblack-25">
                                <input type="number" id="phoneNo" name="phoneNo" {...register("phoneNo", { required: true })}
                                    placeholder="Enter Phone" className="rounded-md px-3 py-3 placeholder:text-richblack-400  bg-richblack-700 outline-none "
                                />
                                {
                                    errors.phoneNo && <span>Please Enter your phoneNo</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Text area */}
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="message"></label>
                        <textarea rows={10} cols={30} placeholder="Enter Message"
                            name="message" id="message" {...register("message", { required: true })}
                            className="rounded-md pl-5  py-3 placeholder:text-richblack-400  bg-richblack-700 outline-none "
                        />
                        {
                            errors.email && <span>Please Enter Message</span>
                        }
                    </div>
                    <button className="bg-yellow-50 font-bold text-black">Send Message</button>
                </div>
            </form>
        </div>
    );
}
export default AboutSectionForm;