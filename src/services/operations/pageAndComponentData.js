import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCatalogPageData=async(categoryId)=>{
    let result=[];
    const toastId=toast.loading("Loading...");

    try{
        const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{categoryId:categoryId});
        console.log("CATALOG API RESPONSE......",response);
        if(!response?.data?.success)
            throw new Error(response?.data?.message)
        
        toast.success("Catalog Data Fetched");
        result=response?.data;
    }
    catch(err){
        toast.error("Error in Fetching Catlog Page Data",err?.response?.data?.message);
        console.log(err);
    }
    toast.dismiss(toastId);
    return result;
}