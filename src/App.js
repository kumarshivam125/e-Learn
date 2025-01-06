import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { Toaster } from "react-hot-toast";
import Signup from "../src/pages/Signup";
import Login from "../src/pages/Login";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import { MyProfile } from "./components/core/Dashboard/MyProfile";
import { PrivateRoute } from "./components/core/Auth/PrivateRoute";
import { Error } from "./pages/Error";
import { Dashboard } from "./pages/Dashboard";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import AddCourse from "./components/core/Dashboard/AddCourse/index";

import { useSelector } from "react-redux";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
function App() {
  const {user}=useSelector(state=>state.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 font-inter flex flex-col mx-auto">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/catalog/:catalogName" element={<Catalog/>}/>
        <Route path="/courses/:courseId" element={<CourseDetails/>}/>
        
        {/* THis is called nested routing */}
        <Route element={ <PrivateRoute> <Dashboard/> </PrivateRoute> }>
          <Route path="/dashboard/my-profile" element={ <MyProfile/> }/>
          <Route path="/dashboard/settings" element={ <Settings/> }/>
          {
            user?.accountType==="Student" && 
            <>
              <Route path="/dashboard/cart" element={<Cart/>}/>
              <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>  
            </>
          }
          {
            user?.accountType==="Instructor" && 
            <>
              <Route path="/dashboard/add-course" element={<AddCourse/>}/>
              <Route path="/dashboard/my-courses" element={<MyCourses/>}/>
              <Route path="/dashboard/instructor" element={<Instructor/>}/>
              <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>}/>
            </>
          }
          
        </Route>

        <Route element={<PrivateRoute> <ViewCourse/> </PrivateRoute>}> 
          {
            user?.accountType==="Student" && 
            <>
              <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" 
                element={<VideoDetails/>}/>
            </>
          }
        </Route>

        <Route path="signup" element={
          <OpenRoute> <Signup/> </OpenRoute>
        }/>
        <Route path="login" element={
          <OpenRoute> <Login/> </OpenRoute>
        }/>
        <Route path="forgot-password" element={
          <OpenRoute> <ForgotPassword/> </OpenRoute>
        }/>
        <Route path="update-password/:id" element={
          <OpenRoute> <UpdatePassword/> </OpenRoute>
        }/>
        <Route path="verify-email" element={
          <OpenRoute> <VerifyEmail/> </OpenRoute>
        }/>

        <Route path="*" element={<Error/>}/>
      </Routes>
      <Toaster/>
    </div>
  );
}
export default App;
