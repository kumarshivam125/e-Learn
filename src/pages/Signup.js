import Template from "../components/core/Auth/Template";
import signupImg from "../assets/Images/signup.png";
const Signup=()=>{
    return(
        <Template
            title="Join the millions learning to code with StudyNotion for free"
            desc1="Build skills today,tomorrow and beyond."
            desc2="Education to future-proof your Career"
            image={signupImg}
            formType="signup"
        />
    );
}
export default Signup;