import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import { FreeMode, Pagination } from "swiper";
import {Autoplay,Navigation, Pagination } from 'swiper/modules';
import CourseCard from "./CourseCard";
export default function CourseSlider({ Courses }) {
    return (
        <>
            {
                Courses?.length == 0 ? <div className="text-white">NO Course Found</div> :
                    (
                        <Swiper  slidesPerView={1} loop={true}
                        spaceBetween={20}
                        pagination={true} modules={[Pagination,Autoplay,Navigation]} className="text-white" 
                        navigation={true} autoplay={{delay:2500,disableOnInteraction:false}} 
                        breakpoints={{1024:{slidesPerView:3,}}}
                        > 
                            {
                                Courses?.map((course, ind) => (
                                    <SwiperSlide key={ind}>
                                        <CourseCard course={course} Height={"h-[250px]"} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    )

            }
        </>
    )
}