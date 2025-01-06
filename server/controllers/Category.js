const Category=require('../models/Category');
function getRandomInt(max){
    return Math.floor(Math.random() * max)
}
exports.createCategory=async(req,resp)=>{
    try{
        const {name,description}=req.body;
        if(!name || !description) {
            return resp.status(401).json({
                success:false,
                message:"All fields are Required!!"
            })
        }
        const categoryDetails=await Category.create({name,description});
        console.log("Category Created:",categoryDetails);
        return resp.status(200).json({
            success:true,
            message:"Category Created Success!!"
        })
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"Something went Wrong while Creating Category:"+err.message
        })
    }
}

exports.showAllCategories=async(req,resp)=>{
    try{
       //Below line means We dont have any criteria for "finding" so 1st arg is {}
       //But "name" and "decsription" should be present in document 
        const allCategory=await Category.find({},{name:true,description:true});
        return resp.status(200).json({
            success:true,
            message:"All Categories Fetched!!",
            allCategory
        })
    }
    catch(err){
        resp.status(500).json({
            success:false,
            message:"Something went Wrong while Fetching ALL Categories:"+err.message
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
	try {
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: ", categoryId);
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
        }).exec()
    
        //console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.")
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            })
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }
    
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({_id: { $ne: categoryId },})
        let differentCategory = await Category
        .findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
        .populate({
            path: "courses",
            match: { status: "Published" },
        }).exec();

          //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            }
        }).exec();

        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);
        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } 
    catch (error){
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
    }
};