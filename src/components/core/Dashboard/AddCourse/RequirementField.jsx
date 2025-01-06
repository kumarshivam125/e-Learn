import { useEffect, useState } from "react"

export default function RequirementField({register,name,placeholder,errors,setValue}){
    const [requirement,setRequirement]=useState([]);
    const [req,setReq]=useState('');
    function removeRequiremntHandler(ind){
        const newList=[...requirement];
        newList.splice(ind,1);
        setRequirement(newList);
    }
    useEffect(()=>{
        register(name,{required:true});
    },[])
    useEffect(()=>{
        setValue(name,requirement);
    },[requirement])
    return(
        <div>
            <label htmlFor={name}>Requirements / Instructions <sup>*</sup></label>
            <input type="text" id={name} placeholder={placeholder} className="w-full rounded-md p-1 bg-richblack-600"
                onChange={e=>setReq(e.target.value)} value={req}
            />
            {/* In below line errors.name is not working IDK WHY */}
            {
                errors[name] && <span className="text-pink-200">Requirements Missing</span>
            }
            <div className="text-yellow-25 font-bold my-2 cursor-pointer" 
            onClick={()=>{
                if(req)
                    setRequirement(prev=>([...prev,req]))
                setReq('')
            }}>Add</div>

            <div >
                {
                    requirement.length>0 && requirement.map((req,ind)=>(
                        <div className="flex gap-x-2 items-center">
                            <p className="text-[18px] ">{req}</p> 
                            <p className="text-richblack-50 cursor-pointer" 
                            onClick={()=>removeRequiremntHandler(ind)}>clear</p>
                        </div>
                    ))
                }
            </div>
        </div>  
    )
}