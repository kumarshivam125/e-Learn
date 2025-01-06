import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import CourseCard from "../components/core/Dashboard/Catalog/CourseCard";
import CourseSlider from "../components/core/Dashboard/Catalog/CourseSlider";

export default function Catalog(){
    const {catalogName}=useParams();
    const [catalogPageData,setCatalogPageData]=useState();
    const [categoryId,setCategoryId]=useState("");
    useEffect(()=>{
        const getCategories=async()=>{
            const res=await apiConnector("GET",categories.CATEGORIES_API);
            const category_id= res?.data?.allCategory.
                filter(cat=>cat.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id;       
            setCategoryId(category_id);    
        }
        getCategories();
    },[catalogName])

    useEffect(()=>{
        const getCategoryPageDetails=async()=>{
            try{
                const res=await getCatalogPageData(categoryId);
                console.log("Catalog Page Data",res);
                setCatalogPageData(res?.data);
                // console.log(catalogPageData);
            }
            catch(err){
                console.log("ERROR in Catalog",err);
            }
        }
        // console.log("CATEGORY ID:",categoryId);

        //IN below line U must add the check condition otherwise initally courseId will be null 
        //and for that also API Calling was happening and ERROR toast was showing
        if(categoryId)
            getCategoryPageDetails();

    },[categoryId])

    return(
        <div className="text-white">
            <div>
                <p>{"Home/Catalog/"}<span>{catalogPageData?.selectedCategory?.name}</span></p>
                <p>{catalogPageData?.selectedCategory?.name}</p>
                <p>{catalogPageData?.selectedCategory?.description}</p>
            </div>
            
            <div className="mt-5">
                {/* SECTION 1 */}
                <div>
                    <div className="font-semibold text-[30px]">Courses For You To get Started</div>
                    <div className="flex gap-x-2">
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.selectedCategory?.courses}/>
                    </div>
                </div>
                {/* SECTION 2 */}
                <div>
                    <p className="font-semibold text-[30px]">Top Courses in {catalogPageData?.selectedCategory?.name}</p>
                    <div>
                        <CourseSlider Courses={catalogPageData?.differentCategory?.courses}/>
                    </div>
                </div>
                {/* SECTION 3 */}
                <div>
                    <p className="font-semibold text-[30px]">Frequently Bought</p>
                    <div className="py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {
                                catalogPageData?.mostSellingCourses?.slice(0,4)
                                .map((course,ind)=>(
                                    <CourseCard course={course} key={ind} Height={"h-[400px]"}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}