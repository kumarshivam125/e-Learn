import Template from "../components/core/Auth/Template";
import loginImg from "../assets/Images/login.png";
const Login=()=>{
    return(
        <Template
            title={"Welcome Back"}
            desc1={"Build Skills for today,tomorrow,and beyond"}
            desc2={"Education to future-proof your Career"}
            image={loginImg}
            formType={"login"}
        />
    );
}
export default Login;