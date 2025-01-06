import { Link } from "react-router-dom";
import RatingStars from "../../../common/RatingStars";
import { useEffect, useState } from "react";
import GetAvgRating from "../../../../utils/avgRating";
export default function CourseCard({course,Height}){
    const [avgReviewCount,setAvgReviewCount]=useState(0);
    useEffect(()=>{
        const count=GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])
    return(
        <div>
            <Link to={`/courses/${course._id}`}>
                <div>
                    <div>
                        <img src={course?.thumbnail} className={`${Height} w-full rounded-lg object-cover `}/>
                    </div>
                    <div>
                        <h1>{course?.courseName}</h1>
                        <p>{course?.instructor?.firstName}{course?.instructor?.lastName}</p>
                        <div className="flex gap-x-3">
                            <div>{avgReviewCount||0}</div>
                            <RatingStars  Review_Count={avgReviewCount}/>
                            <div>{course?.ratingAndReviews?.length} Ratings</div>
                        </div>
                        <p>${course?.price}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}