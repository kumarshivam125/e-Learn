import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
Chart.register(...registerables);

export default function InstructorChart({ courses }) {
    const [currChart, setCurrChart] = useState("students");
    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color =
                `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
            colors.push(color);
        }
        return colors;
    }
    //We have to create data for showing both the charts
    //1.DATA FOR CHART SHOWING STUDENT INFO
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentEnrolled),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }
    //2.DATA FOR CHART SHOWING INCOME INFO
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),
            }
        ]
    }
    const options={

    }
    return (
        <div>
            <p className="text-[20px] font-semibold">Visualise</p>
            <div className="flex gap-x-3 text-yellow-25 font-bold">
                <button onClick={()=>setCurrChart("students")} 
                className={`${currChart=="students"?"bg-richblack-500":""} px-2 py-1 `}>Student</button>
                <button onClick={()=>setCurrChart("income")}
                className={`${currChart=="students"?"":"bg-richblack-500"} px-2 py-1 `}>Income</button>
            </div>
            <div>
                <Pie data={currChart == "students" ? chartDataForStudents : chartDataForIncome} options={options}/>
            </div>
        </div>
    )
}